import AsyncStorage from "@react-native-async-storage/async-storage";
import { Resolver } from "storion";

export function storageService(_: Resolver) {
  return {
    getItem(key: string) {
      return AsyncStorage.getItem(key);
    },
    setItem(key: string, value: string) {
      return AsyncStorage.setItem(key, value);
    },
    removeItem(key: string) {
      return AsyncStorage.removeItem(key);
    },
  };
}
