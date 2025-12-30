import { map, store } from "storion";
import { notPersisted } from "storion/persist";
import { abortable, AbortableResult, async, logging } from "storion/async";
import { storageService } from "@/services/storage";

export const persistStore = store({
  state: {
    tasks: {} as Record<string, PromiseLike<any>>,
  },
  setup({ focus, get }) {
    const storage = get(storageService);
    const lastResults = new Map<string, AbortableResult<void>>();
    const tasks = focus("tasks").as(map());

    const loadData = abortable(async (_, key: string) => {
      const result = await tasks.ensure(key, async () => {
        const res = await storage.getItem(key);
        return JSON.parse(res ?? "{}");
      });
      // Remove task after completion - async.all treats raw Promises as always pending
      tasks.delete(key);
      return result;
    }).use(logging("persistStore.loadData"));

    const saveData = abortable(async (_, key: string, data: any) => {
      await storage.setItem(key, JSON.stringify(data));
    }).use(logging("persistStore.saveData"));

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
