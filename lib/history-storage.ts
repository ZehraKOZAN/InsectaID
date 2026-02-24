import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HistoryItem } from "./insect-data";

const HISTORY_KEY = "@insectaid_history";

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch {
    return [];
  }
}

export async function addToHistory(item: HistoryItem): Promise<void> {
  try {
    const history = await getHistory();
    history.unshift(item);
    if (history.length > 50) {
      history.pop();
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    console.error("Failed to save history");
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch {
    console.error("Failed to clear history");
  }
}

export async function removeFromHistory(id: string): Promise<void> {
  try {
    const history = await getHistory();
    const filtered = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch {
    console.error("Failed to remove history item");
  }
}
