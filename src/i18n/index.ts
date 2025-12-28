import { translations } from "./translations";
import type { Language, TranslationKey } from "./translations";

export { translations };
export type { Language, TranslationKey };

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations.en[key] || key;
};

export const t = (
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>
): string => {
  let text = getTranslation(lang, key);

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, String(value));
    });
  }

  return text;
};

export const getDayNames = (lang: Language): string[] => {
  const t = translations[lang];
  return [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat];
};
