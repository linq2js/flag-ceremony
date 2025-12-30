import { Router } from "expo-router";

/**
 * Safely go back in navigation stack.
 * If there's no history (e.g., page was refreshed), navigate to home instead.
 */
export function safeGoBack(router: Router) {
  if (router.canGoBack()) {
    router.back();
  } else {
    // No history - navigate to home
    router.replace("/");
  }
}

