import type { Color } from "./types";

export const COLOR_MAP = {
    "WHITE": "bg-white",
    "YELLOW": "bg-yellow-400",
    "GREEN": "bg-green-500",
    "BLUE": "bg-sky-400",
    "RED": "bg-rose-500",
    "ORANGE": "bg-amber-500",
    "BLANK": "bg-gray-400",
};

const faceWithColor = (color: Color) => {
    return {
        top: {left: color, middle: color, right: color},
        middle: {left: color, middle: color, right: color},
        bottom: {left: color, middle: color, right: color},
    }
};

const faceWithTopStrip = (color: Color) => {
    return {
        top: {left: color, middle: color, right: color},
        middle: {left: "BLANK", middle: "BLANK", right: "BLANK"},
        bottom: {left: "BLANK", middle: "BLANK", right: "BLANK"},
    }
}

const faceWithTopCorners = (color: Color) => {
    return {
        top: {left: color, middle: "BLANK", right: color},
        middle: {left: "BLANK", middle: "BLANK", right: "BLANK"},
        bottom: {left: "BLANK", middle: "BLANK", right: "BLANK"},
    }
}

export const INITIAL_FACE_MAPPING = {
    F: "F",
    R: "R",
    U: "U",
    B: "B",
    L: "L",
    D: "D",
};

export const DEFAULT_STICKERS = {
    u: faceWithColor("YELLOW"),
    d: faceWithColor("WHITE"),
    l: faceWithColor("RED"),
    r: faceWithColor("ORANGE"),
    f: faceWithColor("GREEN"),
    b: faceWithColor("BLUE"),
};

export const STICKERS_LL = {
    u: faceWithColor("YELLOW"),
    d: faceWithColor("BLANK"),
    l: faceWithTopStrip("RED"),
    r: faceWithTopStrip("ORANGE"),
    f: faceWithTopStrip("GREEN"),
    b: faceWithTopStrip("BLUE"),
};

export const STICKERS_COLL = {
    u: faceWithColor("YELLOW"),
    d: faceWithColor("BLANK"),
    l: faceWithTopCorners("RED"),
    r: faceWithTopCorners("ORANGE"),
    f: faceWithTopCorners("GREEN"),
    b: faceWithTopCorners("BLUE"),
};

export const STICKERS_OLL = {
    u: faceWithColor("YELLOW"),
    d: faceWithColor("BLANK"),
    l: faceWithColor("BLANK"),
    r: faceWithColor("BLANK"),
    f: faceWithColor("BLANK"),
    b: faceWithColor("BLANK"),
};

export const AUF_ALGS = [
    "",
    "U",
    "U2",
    "U'",
];

export const EPLL_ALGS = [
    "",
    "M2 U' M2 U2 M2 U' M2",
    "y2 M2 U M U2 M' U M2",
    "y2 M2 U' M U2 M' U' M2",
    "M2 U M2 U M' U2 M2 U2 M'",
];

export const PLL_ALGS = [
    "",
    "x R' U R' D2 R U' R' D2 R2 x'",
    "x R2 D2 R U R' D2 R U' R x'",
    "y R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    "R2 U R' U R' U' R U' R2 D U' R' U R D'",
    "R' U' R U D' R2 U R' U R U' R U' R2 D",
    "R2 U' R U' R U R' U R2 D' U R U' R' D",
    "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    "y R' U L' U2 R U' R' U2 R L",
    "R U R' F' R U R' U' R' F R2 U' R'",
    "y R U' R' U' R U R D R' U' R D' R' U2 R'",
    "R' U2 R U2 R' F R U R' U' R' F' R2",
    "R U R' U' R' F R2 U' R' U' R U R' F'",
    "M2 U' M2 U2 M2 U' M2",
    "y2 M2 U M U2 M' U M2",
    "y2 M2 U' M U2 M' U' M2",
    "M2 U M2 U M' U2 M2 U2 M'",
    "y x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
    "F R U' R' U' R U R' F' R U R' U' R' F R F'",
];

// Maps from net style, randomization, and initial sticker enums to string names
export const NET_STYLE_MAP = {
    "FULL": "Full",
    "LL": "Last Layer",
    "ROUX": "Roux",
};
export const RANDOMIZATION_MAP = {
    "AUF": "AUF",
    "EPLL": "EPLL",
    "PLL": "PLL",
};
export const INITIAL_STICKERS_MAP = {
    "DEFAULT": "All",
    "LL": "Last Layer",
    "COLL": "COLL",
    "OLL": "OLL",
};

// Maps from initial stickers option to Stickers object
export const STICKERS_OBJECT_MAP = {
    "DEFAULT": DEFAULT_STICKERS,
    "LL": STICKERS_LL,
    "COLL": STICKERS_COLL,
    "OLL": STICKERS_OLL,
};
