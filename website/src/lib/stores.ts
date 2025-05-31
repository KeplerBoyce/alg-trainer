import { localStorageStore } from "./localStorageStore";

// Maps from algset (string) to object mapping alg (string) knowledge level (number 0-100)
export const knowledge = localStorageStore<{
    [key: string]: {
        [key: string]: number,
    },
}>("knowledge", {});
