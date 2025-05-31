import { localStorageStore } from "./localStorageStore";

// Maps from alg (string) to knowledge level (number 0-100)
export const knowledge = localStorageStore<{
    [key: string]: number,
}>("knowledge", {});
