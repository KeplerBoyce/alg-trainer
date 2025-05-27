import type { Color } from "./types";

export const COLOR_MAP = {
    "WHITE": "bg-white",
    "YELLOW": "bg-yellow-400",
    "GREEN": "bg-green-500",
    "BLUE": "bg-sky-400",
    "RED": "bg-rose-500",
    "ORANGE": "bg-amber-500",
};

const faceWithColor = (color: Color) => {
    return {
        top: {left: color, middle: color, right: color},
        middle: {left: color, middle: color, right: color},
        bottom: {left: color, middle: color, right: color},
    }
}

export const DEFAULT_STICKERS = {
    u: faceWithColor("YELLOW"),
    d: faceWithColor("WHITE"),
    l: faceWithColor("RED"),
    r: faceWithColor("ORANGE"),
    f: faceWithColor("GREEN"),
    b: faceWithColor("BLUE"),
}
