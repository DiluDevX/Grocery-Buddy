import * as SecureStore from "expo-secure-store";

// Simple token cache that works on web and native
const tokenCache = {
  async getToken(key: string) {
    try {
      // On web, use localStorage. On native, use SecureStore
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      // Fallback to in-memory storage if both fail
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      // On web, use localStorage. On native, use SecureStore
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback: do nothing if storage fails
      console.warn("Failed to save token");
    }
  },
};

export { tokenCache };
