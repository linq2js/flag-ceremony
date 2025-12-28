import { effect, store } from "storion";
import type { Language, TranslationKey } from "../i18n/translations";
import { getTranslation, translations } from "../i18n";
import { notPersisted, persisted } from "storion/persist";

export const i18nStore = store({
  name: "i18n",
  state: {
    language: "vi" as Language,
    dayNames: [] as string[],
  },
  setup: ({ state, focus }) => {
    const [, setLanguageState] = focus("language");

    // Effect to update dayNames when language changes
    effect(() => {
      const t = translations[state.language];
      state.dayNames = [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat];
    });

    const setLanguage = (lang: Language) => {
      setLanguageState(lang);
    };

    return {
      setLanguage,
      t(key: TranslationKey, params?: Record<string, string | number>) {
        let text = getTranslation(state.language, key);

        if (params) {
          Object.entries(params).forEach(([paramKey, value]) => {
            text = text.replace(`{${paramKey}}`, String(value));
          });
        }

        return text;
      },
    };
  },
  meta: [persisted(), notPersisted.for("dayNames")],
});

export type I18nState = {
  language: Language;
  dayNames: string[];
};

export type I18nActions = {
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};
