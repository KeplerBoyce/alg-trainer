// Blank color is for nets with empty stickers like OLL
export type Color = "WHITE" | "YELLOW" | "GREEN" | "BLUE" | "RED" | "ORANGE" | "BLANK";

export type Layer = "L" | "M" | "R" | "U" | "E" | "D" | "F" | "S" | "B";

// FULL shows all six faces
// LL shows only stickers of U layer
// ROUX shows all stickers of U layer as well as middle column of D layer
export type NetStyle = "FULL" | "LL" | "ROUX";

export type Randomization = "AUF" | "EPLL" | "PLL";

export type AlgSet = string[];

export type Row = {
    left: Color,
    middle: Color,
    right: Color,
}

export type Face = {
    top: Row,
    middle: Row,
    bottom: Row,
}

// Top/down/left/right orientation of faces is based on the following rotations for each face:
// U: x', D: x, F: no rotation, B: y2, L: y', R: y
export type Stickers = {
    u: Face,
    d: Face,
    l: Face,
    r: Face,
    f: Face,
    b: Face,
}

export type AlgSetConfig = {
    [key: string]: {
        netStyle: NetStyle,
        randomization: Randomization,
        topOnly: boolean,
    },
};
