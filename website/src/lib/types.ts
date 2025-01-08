export type Color = "WHITE" | "YELLOW" | "GREEN" | "BLUE" | "RED" | "ORANGE";

export const COLOR_MAP = {
    "WHITE": "bg-white",
    "YELLOW": "bg-yellow-400",
    "GREEN": "bg-green-500",
    "BLUE": "bg-sky-400",
    "RED": "bg-rose-500",
    "ORANGE": "bg-amber-500",
};

export type Piece = "TOP_BACK" | "TOP_LEFT" | "TOP_FRONT" | "TOP_RIGHT" | "BOTTOM_BACK" | "BOTTOM_FRONT";

export type PieceInfo = {
    piece: Piece,
    flipped: boolean,
};

export type Algorithm = {
    state: {
        topBack: PieceInfo,
        topLeft: PieceInfo,
        topFront: PieceInfo,
        topRight: PieceInfo,
        bottomBack: PieceInfo,
        bottomFront: PieceInfo,
        mParity: 0 | 1 | 2 | 3,
        uParity: 0 | 1 | 2 | 3,
    },
    solution: string,
};
