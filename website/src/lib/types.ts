export type Color = "WHITE" | "YELLOW" | "GREEN" | "BLUE" | "RED" | "ORANGE";
export type AlgSet = "dSolved" | "dSwapped" | "oneDSolved" | "oneDSwapped" | "dEdgesUOpposites" | "dEdgesUAdjacents";
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

export type AlgWithDupes = {
    normal: Algorithm[],
    mirrorM: Algorithm[],
    mirrorS: Algorithm[],
    mirrorBoth: Algorithm[],
}
