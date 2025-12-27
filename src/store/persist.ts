import { map, store } from "storion";
import { notPersisted } from "storion/persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { abortable, AbortableResult } from "storion/async";

export const persistStore = store({
  state: {
    tasks: {} as Record<string, PromiseLike<any>>,
  },
  setup({ focus }) {
    let lastResult: AbortableResult<void>;
    const tasks = focus("tasks").as(map());

    const loadData = (key: string) => {
      return tasks.ensure(key, async () => {
        const res = await AsyncStorage.getItem(key);
        return JSON.parse(res ?? "{}");
      });
    };

    const saveData = abortable(async ({ safe }, key: string, data: any) => {
      const prev = JSON.parse((await safe(AsyncStorage.getItem(key))) ?? "{}");
      await AsyncStorage.setItem(
        key,
        JSON.stringify({ ...((prev as unknown as object) ?? {}), ...data })
      );
    });

    return {
      loadData,
      saveData(key: string, data: any) {
        lastResult?.abort();
        lastResult = saveData(key, data);
      },
    };
  },
  meta: notPersisted(),
});
