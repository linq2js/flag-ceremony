import { map, store } from "storion";
import { notPersisted } from "storion/persist";
import { abortable, AbortableResult } from "storion/async";
import { storageService } from "@/services/storage";

export const persistStore = store({
  state: {
    tasks: {} as Record<string, PromiseLike<any>>,
  },
  setup({ focus, get }) {
    const storage = get(storageService);
    const lastResults = new Map<string, AbortableResult<void>>();
    const tasks = focus("tasks").as(map());

    const loadData = (key: string) => {
      return tasks.ensure(key, async () => {
        const res = await storage.getItem(key);
        return JSON.parse(res ?? "{}");
      });
    };

    const saveData = abortable(async ({ safe }, key: string, data: any) => {
      const prev = JSON.parse((await safe(storage.getItem(key))) ?? "{}");
      await storage.setItem(
        key,
        JSON.stringify({ ...((prev as unknown as object) ?? {}), ...data })
      );
    });

    return {
      loadData,
      saveData(key: string, data: any) {
        lastResults.get(key)?.abort();
        lastResults.set(key, saveData(key, data));
      },
    };
  },
  meta: notPersisted(),
});
