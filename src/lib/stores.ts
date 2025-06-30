import { localStorageStore } from "./localStorageStore";
import type { AlgSetConfig } from "./types";

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

// Configs for user-created algsets, algset name maps to object containing net style, randomization, and stickers
export const configs = localStorageStore<AlgSetConfig>("configs", {});
