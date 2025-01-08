import type { Color, PieceInfo } from "./types";

export const getEdgeColor = (piece: PieceInfo, mainFace: boolean): Color => {
    switch (piece.piece) {
        case "TOP_BACK":
            if (piece.flipped) return mainFace ? "BLUE" : "YELLOW";
            else return mainFace ? "YELLOW" : "BLUE";
        case "TOP_LEFT":
            if (piece.flipped) return mainFace ? "RED" : "YELLOW";
            else return mainFace ? "YELLOW" : "RED";
        case "TOP_FRONT":
            if (piece.flipped) return mainFace ? "GREEN" : "YELLOW";
            else return mainFace ? "YELLOW" : "GREEN";
        case "TOP_RIGHT":
            if (piece.flipped) return mainFace ? "ORANGE" : "YELLOW";
            else return mainFace ? "YELLOW" : "ORANGE";
        case "BOTTOM_BACK":
            if (piece.flipped) return mainFace ? "BLUE" : "WHITE";
            else return mainFace ? "WHITE" : "BLUE";
        case "BOTTOM_FRONT":
            if (piece.flipped) return mainFace ? "GREEN" : "WHITE";
            else return mainFace ? "WHITE" : "GREEN";
    }
}
