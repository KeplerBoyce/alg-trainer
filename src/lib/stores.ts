import { localStorageStore } from "./localStorageStore";

// Maps from algset (string) to object mapping alg (string) knowledge level (number 0-100)
export const knowledge = localStorageStore<{
    [key: string]: {
        [key: string]: number,
    },
}>("knowledge", {});

// User-created algsets, algset name maps to object in which subset name maps to alg list
export const algsets = localStorageStore<{
    [key: string]: {
        [key: string]: string[],
    },
}>("algsets", {});
