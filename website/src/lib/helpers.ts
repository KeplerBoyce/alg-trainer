import { AUF_ALGS, COLOR_MAP, DEFAULT_STICKERS, STICKERS_LL, STICKERS_COLL, STICKERS_OLL, EPLL_ALGS, PLL_ALGS, INITIAL_FACE_MAPPING } from "./constants"
import type { Color, Face, FaceMapping, InitialStickerType, Layer, Randomization, Stickers } from "./types"
import min2phase from "min2phase.js"

min2phase.initFull();

export const updateKnowledgeForgot = (num: number) => {
    return Math.max(1, num / 10);
}

export const updateKnowledgeHard = (num: number) => {
    return Math.max(1, num -= 10);
}

export const updateKnowledgeGood = (num: number) => {
    return Math.min(100, num += 5);
}

export const updateKnowledgeEasy = (num: number) => {
    return Math.min(100, num += 20);
}

export const casesStr = (num: number) => {
    return `${num} case${num != 1 ? "s" : ""}`;
}

export const squareStyle = (color: Color, small?: boolean) => {
    if (small) {
        return `flex-shrink-0 w-4 h-4 border border-black rounded-sm ${COLOR_MAP[color]}`;
    }
    return `flex-shrink-0 w-8 h-8 border border-black rounded-md ${COLOR_MAP[color]}`;
}

export const horizStyle = (color: Color, small?: boolean) => {
    if (small) {
        return `flex-shrink-0 w-4 h-2 border border-black rounded-sm ${COLOR_MAP[color]}`;
    }
    return `flex-shrink-0 w-8 h-4 border border-black rounded-md ${COLOR_MAP[color]}`;
}

export const vertStyle = (color: Color, small?: boolean) => {
    if (small) {
        return `flex-shrink-0 w-2 h-4 border border-black rounded-sm ${COLOR_MAP[color]}`;
    }
    return `flex-shrink-0 w-4 h-8 border border-black rounded-md ${COLOR_MAP[color]}`;
}

export const emptyStyle = (small?: boolean) => {
    if (small) {
        return "flex-shrink-0 w-2 h-2";
    }
    return "flex-shrink-0 w-4 h-4";
}

export const getInitialStickers = (initialStickers?: InitialStickerType) => {
    switch (initialStickers ?? "DEFAULT") {
        case "LL": return STICKERS_LL;
        case "COLL": return STICKERS_COLL;
        case "OLL": return STICKERS_OLL;
        default: return DEFAULT_STICKERS;
    }
}

const cleanAlg = (alg: string) => {
    // Remove parentheseses
    alg = alg.replace(/[\(\)]/g, '');
    // Replace all whitespace with single spaces (remove double spaces)
    alg = alg.replace(/\s+/g, ' ');
    // Trim leading and trailing whitespace
    return alg.trim();
}

const simplifySolution = (solution: string[], index: number) => {
    while (index > 0) {
        const move1 = solution[index - 1];
        const move2 = solution[index];

        if (move1[0] === move2[0]) {
            let amount = 0;
            // Rotation amount from first move
            if (move1.length === 1) {
                amount = 1;
            } else if (move1[1] === '2') {
                amount = 2;
            } else {
                amount = 3;
            }
            // Rotation amount from second move (find the sum)
            if (move2.length === 1) {
                amount += 1;
            } else if (move2[1] === '2') {
                amount += 2;
            } else {
                amount += 3;
            }
            amount %= 4;
            // Replace move based on total amount of the two moves after merging
            if (amount === 0) {
                solution = [...solution.slice(0, index - 1), ...solution.slice(index + 1)];
                index -= 1;
            } else if (amount === 1) {
                solution = [...solution.slice(0, index - 1), move1[0], ...solution.slice(index + 1)];
                break;
            } else if (amount === 2) {
                solution = [...solution.slice(0, index - 1), `${move1[0]}2`, ...solution.slice(index + 1)];
                break;
            } else {
                solution = [...solution.slice(0, index - 1), `${move1[0]}'`, ...solution.slice(index + 1)];
                break;
            }
        } else {
            break;
        }
    }
    return solution;
}

// Adds or adjusts the y rotation at the start of an alg based on the random AUF
export const adjustYRotation = (alg: string, auf: string) => {
    const currRotation = (() => {
        if (alg[0] !== 'y') {
            return 0;
        } else if (alg[1] === '\'') {
            return 3;
        } else if (alg[1] === '2') {
            return 2;
        }
        return 1;
    })();

    // These are flipped because the "auf" arg is the AUF applied at scramble time
    // (We want to apply a rotation to reverse that AUF)
    const addedRotation = (() => {
        if (auf === "") {
            return 0;
        } else if (auf === "U") {
            return 3;
        } else if (auf === "U2") {
            return 2;
        }
        return 1;
    })();

    // Strip away the current rotation, if there is any
    if (alg[0] === 'y') {
        if (alg[1] === '\'') {
            alg = alg.slice(2);
        } else if (alg[1] === '2') {
            alg = alg.slice(2);
        } else if (alg[1] === ' ') {
            alg = alg.slice(2);
        } else {
            // For if there is no space after the y, which shouldn't happen -- just for safety
            alg = alg.slice(1);
        }
    }
    const newRotation = (() => {
        switch ((currRotation + addedRotation) % 4) {
            case 0: return "";
            case 1: return "y ";
            case 2: return "y2 ";
            default: return "y' ";
        }
    })();
    return `${newRotation}${alg}`;
}

// Applies a rotation to a face mapping to remap faces
const rotateFaceMapping = (faceMapping: FaceMapping, rotation: string) => {
    const amount = (() => {
        if (rotation.length === 1) {
            return 1;
        } else if (rotation[1] === '2') {
            return 2;
        }
        return 3;
    })();
    
    // Perform the rotation `amount` times
    let temp: string;
    for (let i = 0; i < amount; i++) {
        switch (rotation[0]) {
            case 'x':
                temp = faceMapping.F;
                faceMapping.F = faceMapping.D;
                faceMapping.D = faceMapping.B;
                faceMapping.B = faceMapping.U;
                faceMapping.U = temp;
                break;
            case 'y':
                temp = faceMapping.F;
                faceMapping.F = faceMapping.R;
                faceMapping.R = faceMapping.B;
                faceMapping.B = faceMapping.L;
                faceMapping.L = temp;
                break;
            case 'z':
                temp = faceMapping.U;
                faceMapping.U = faceMapping.L;
                faceMapping.L = faceMapping.D;
                faceMapping.D = faceMapping.R;
                faceMapping.R = temp;
                break;
            default:
                break;
        }
    }
    return faceMapping;
}

// Convert sequence of moves into only FRUBLD face turns (no slice/wide moves, etc.)
export const faceTurnsOnly = (alg: string) => {
    // Mapping of which face is currently in which position
    // e.g. after a y rotation, an F move will actually be an R move
    let mapping = structuredClone(INITIAL_FACE_MAPPING);
    let moves = alg.split(' ');

    // First, translate slice moves and wide moves into only face turns and rotations
    moves = moves.flatMap(move => {
        switch (move) {
            case "f": return ["B", "z"];
            case "r": return ["L", "x"];
            case "u": return ["D", "y"];
            case "b": return ["F", "z'"];
            case "l": return ["R", "x'"];
            case "d": return ["U", "y'"];
            case "f'": return ["B'", "z'"];
            case "r'": return ["L'", "x'"];
            case "u'": return ["D'", "y'"];
            case "b'": return ["F'", "z"];
            case "l'": return ["R'", "x"];
            case "d'": return ["U'", "y"];
            case "f2": return ["B2", "z2"];
            case "r2": return ["L2", "x2"];
            case "u2": return ["D2", "y2"];
            case "b2": return ["F2", "z2"];
            case "l2": return ["R2", "x2"];
            case "d2": return ["U2", "y2"];
            case "M": return ["L'", "R", "x'"];
            case "S": return ["F'", "B", "z"];
            case "E": return ["D'", "U", "y'"];
            case "M'": return ["L", "R'", "x"];
            case "S'": return ["F", "B'", "z'"];
            case "E'": return ["D", "U'", "y"];
            case "M2": return ["L2", "R2", "x2"];
            case "S2": return ["F2", "B2", "z2"];
            case "E2": return ["D2", "U2", "y2"];
            default: return [move];
        }
    });

    // Now, handle cube rotations to translate into only face turns
    const finalMoves = [];
    for (const move of moves) {
        switch (move[0]) {
            case 'x':
            case 'y':
            case 'z':
                mapping = rotateFaceMapping(mapping, move);
                break;
            case 'F':
            case 'R':
            case 'U':
            case 'B':
            case 'L':
            case 'D':
                if (move.length === 1) {
                    finalMoves.push(mapping[move[0]]);
                } else {
                    finalMoves.push(`${mapping[move[0]]}${move[1]}`);
                }
                break;
            default:
                break;
        }
    }
    return finalMoves.join(' ');
}

// Generates a "random" looking scramble to produce the inverse state of an algorithm
export const randomAlgScramble = (alg: string, numRandom: number, randomization: Randomization) => {
    if (!alg) {
        return ["", ""];
    }
    const scramble: string[] = [];
    alg = cleanAlg(alg);

    // Apply randomization according to which randomization mode is selected
    const auf1 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
    const auf2 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
    const auf3 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
    switch (randomization) {
        case "AUF":
            scramble.push(auf1);
            break;
        case "EPLL":
            const epll = EPLL_ALGS[Math.floor(Math.random() * EPLL_ALGS.length)];
            scramble.push(auf1);
            scramble.push(epll);
            scramble.push(auf2);
            break;
        case "PLL":
            const pll = PLL_ALGS[Math.floor(Math.random() * PLL_ALGS.length)];
            scramble.push(auf1);
            scramble.push(pll);
            scramble.push(auf2);
            break;
    }

    scramble.push(reverseMoveString(alg));
    // Another AUF after the reversed algorithm (so user doesn't always see in same orientation)
    scramble.push(auf3);

    const allMoves = ["R", "R'", "R2", "U", "U'", "U2", "F", "F'", "F2",
                      "L", "L'", "L2", "D", "D'", "D2", "B", "B'", "B2"];
    const randomMoves = [];
    let lastFace = '';
    for (let i = 0; i < numRandom; i++) {
        while (true) {
            const chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            const chosenFace = chosenMove[0];

            if (chosenFace !== lastFace) {
                randomMoves.push(chosenMove);
                lastFace = chosenFace;
                break;
            }
        }
    }
    const fullScramble = [faceTurnsOnly(cleanAlg(scramble.join(' '))), ...randomMoves].join(' ');
    const cube = min2phase.fromScramble(fullScramble);
    const solution = cleanAlg(min2phase.solve(cube));
    const withRandom = `${randomMoves.join(' ')} ${solution}`;
    // Check for merging last random move with first solution move if same face
    const simplified = simplifySolution(withRandom.split(' '), numRandom).join(' ');
    // Return both the scramble and the final random AUF applied (so we can add the necessary
    // rotation to the start of the solution)
    return [reverseMoveString(simplified), auf3];
}

// Applies the reverse of an alg to the solved cube
export const getAlgStickers = (alg: string, initialStickers?: Stickers) => {
    alg = cleanAlg(alg);
    let stickers = structuredClone(initialStickers ?? DEFAULT_STICKERS);
    // Regex for matching all possible Rubik's Cube move notations, empty list on null
    const moves = alg.match(/[LMRUEDFSBlrudfbxyz][']?2?/g) || [];

    for (const move of reverseMoves(moves)) {
        applyMove(stickers, move);
    }
    return stickers;
}

export const reverseMoveString = (moves: string) => {
    return reverseMoves(moves.split(' ')).join(' ');
}

export const reverseMoves = (moves: string[]) => {
    const newMoves: string[] = [];
    for (const move of [...moves].reverse()) {
        // Cases for CCW, 180, and CW, respectively
        if (move.length > 1 && move.charAt(1) == '\'') {
            newMoves.push(move.charAt(0));
        } else if (move.length > 1 && move.charAt(1) == '2') {
            newMoves.push(move);
        } else if (move.length == 1) {
            newMoves.push(`${move}'`);
        } else {
            // Something went wrong -- handle with empty string, which will do nothing
            newMoves.push("");
        }
    }
    return newMoves;
}

// Cycles face stickers of layer clockwise 90 degrees in place
export const cycleFace = (face: Face) => {
    let temp = face.top.left;
    face.top.left = face.bottom.left;
    face.bottom.left = face.bottom.right;
    face.bottom.right = face.top.right;
    face.top.right = temp;
    temp = face.top.middle;
    face.top.middle = face.middle.left;
    face.middle.left = face.bottom.middle;
    face.bottom.middle = face.middle.right;
    face.middle.right = temp;
}

// Cycles entire layer clockwise 90 degrees
export const cycleLayer = (stickers: Stickers, layer: Layer) => {
    let temp: Color;
    switch (layer) {
        case "L":
            cycleFace(stickers.l);
            temp = stickers.u.top.left;
            stickers.u.top.left = stickers.b.bottom.right;
            stickers.b.bottom.right = stickers.d.top.left;
            stickers.d.top.left = stickers.f.top.left;
            stickers.f.top.left = temp;
            temp = stickers.u.bottom.left;
            stickers.u.bottom.left = stickers.b.top.right;
            stickers.b.top.right = stickers.d.bottom.left;
            stickers.d.bottom.left = stickers.f.bottom.left;
            stickers.f.bottom.left = temp;
            temp = stickers.u.middle.left;
            stickers.u.middle.left = stickers.b.middle.right;
            stickers.b.middle.right = stickers.d.middle.left;
            stickers.d.middle.left = stickers.f.middle.left;
            stickers.f.middle.left = temp;
            break;
        case "M":
            temp = stickers.b.bottom.middle;
            stickers.b.bottom.middle = stickers.d.top.middle;
            stickers.d.top.middle = stickers.f.top.middle;
            stickers.f.top.middle = stickers.u.top.middle;
            stickers.u.top.middle = temp;
            temp = stickers.b.top.middle;
            stickers.b.top.middle = stickers.d.bottom.middle;
            stickers.d.bottom.middle = stickers.f.bottom.middle;
            stickers.f.bottom.middle = stickers.u.bottom.middle;
            stickers.u.bottom.middle = temp;
            temp = stickers.b.middle.middle;
            stickers.b.middle.middle = stickers.d.middle.middle;
            stickers.d.middle.middle = stickers.f.middle.middle;
            stickers.f.middle.middle = stickers.u.middle.middle;
            stickers.u.middle.middle = temp;
            break;
        case "R":
            cycleFace(stickers.r);
            temp = stickers.u.top.right;
            stickers.u.top.right = stickers.f.top.right;
            stickers.f.top.right = stickers.d.top.right;
            stickers.d.top.right = stickers.b.bottom.left;
            stickers.b.bottom.left = temp;
            temp = stickers.u.bottom.right;
            stickers.u.bottom.right = stickers.f.bottom.right;
            stickers.f.bottom.right = stickers.d.bottom.right;
            stickers.d.bottom.right = stickers.b.top.left;
            stickers.b.top.left = temp;
            temp = stickers.u.middle.right;
            stickers.u.middle.right = stickers.f.middle.right;
            stickers.f.middle.right = stickers.d.middle.right;
            stickers.d.middle.right = stickers.b.middle.left;
            stickers.b.middle.left = temp;
            break;
        case "U":
            cycleFace(stickers.u);
            temp = stickers.f.top.left;
            stickers.f.top.left = stickers.r.top.left;
            stickers.r.top.left = stickers.b.top.left;
            stickers.b.top.left = stickers.l.top.left;
            stickers.l.top.left = temp;
            temp = stickers.f.top.right;
            stickers.f.top.right = stickers.r.top.right;
            stickers.r.top.right = stickers.b.top.right;
            stickers.b.top.right = stickers.l.top.right;
            stickers.l.top.right = temp;
            temp = stickers.f.top.middle;
            stickers.f.top.middle = stickers.r.top.middle;
            stickers.r.top.middle = stickers.b.top.middle;
            stickers.b.top.middle = stickers.l.top.middle;
            stickers.l.top.middle = temp;
            break;
        case "E":
            temp = stickers.l.middle.left;
            stickers.l.middle.left = stickers.b.middle.left;
            stickers.b.middle.left = stickers.r.middle.left;
            stickers.r.middle.left = stickers.f.middle.left;
            stickers.f.middle.left = temp;
            temp = stickers.l.middle.right;
            stickers.l.middle.right = stickers.b.middle.right;
            stickers.b.middle.right = stickers.r.middle.right;
            stickers.r.middle.right = stickers.f.middle.right;
            stickers.f.middle.right = temp;
            temp = stickers.l.middle.middle;
            stickers.l.middle.middle = stickers.b.middle.middle;
            stickers.b.middle.middle = stickers.r.middle.middle;
            stickers.r.middle.middle = stickers.f.middle.middle;
            stickers.f.middle.middle = temp;
            break;
        case "D":
            cycleFace(stickers.d);
            temp = stickers.f.bottom.left;
            stickers.f.bottom.left = stickers.l.bottom.left;
            stickers.l.bottom.left = stickers.b.bottom.left;
            stickers.b.bottom.left = stickers.r.bottom.left;
            stickers.r.bottom.left = temp;
            temp = stickers.f.bottom.right;
            stickers.f.bottom.right = stickers.l.bottom.right;
            stickers.l.bottom.right = stickers.b.bottom.right;
            stickers.b.bottom.right = stickers.r.bottom.right;
            stickers.r.bottom.right = temp;
            temp = stickers.f.bottom.middle;
            stickers.f.bottom.middle = stickers.l.bottom.middle;
            stickers.l.bottom.middle = stickers.b.bottom.middle;
            stickers.b.bottom.middle = stickers.r.bottom.middle;
            stickers.r.bottom.middle = temp;
            break;
        case "F":
            cycleFace(stickers.f);
            temp = stickers.u.bottom.left;
            stickers.u.bottom.left = stickers.l.bottom.right;
            stickers.l.bottom.right = stickers.d.top.right;
            stickers.d.top.right = stickers.r.top.left;
            stickers.r.top.left = temp;
            temp = stickers.u.bottom.right;
            stickers.u.bottom.right = stickers.l.top.right;
            stickers.l.top.right = stickers.d.top.left;
            stickers.d.top.left = stickers.r.bottom.left;
            stickers.r.bottom.left = temp;
            temp = stickers.u.bottom.middle;
            stickers.u.bottom.middle = stickers.l.middle.right;
            stickers.l.middle.right = stickers.d.top.middle;
            stickers.d.top.middle = stickers.r.middle.left;
            stickers.r.middle.left = temp;
            break;
        case "S":
            temp = stickers.u.middle.left;
            stickers.u.middle.left = stickers.l.bottom.middle;
            stickers.l.bottom.middle = stickers.d.middle.right;
            stickers.d.middle.right = stickers.r.top.middle;
            stickers.r.top.middle = temp;
            temp = stickers.u.middle.right;
            stickers.u.middle.right = stickers.l.top.middle;
            stickers.l.top.middle = stickers.d.middle.left;
            stickers.d.middle.left = stickers.r.bottom.middle;
            stickers.r.bottom.middle = temp;
            temp = stickers.u.middle.middle;
            stickers.u.middle.middle = stickers.l.middle.middle;
            stickers.l.middle.middle = stickers.d.middle.middle;
            stickers.d.middle.middle = stickers.r.middle.middle;
            stickers.r.middle.middle = temp;
            break;
        case "B":
            cycleFace(stickers.b);
            temp = stickers.u.top.left;
            stickers.u.top.left = stickers.r.top.right;
            stickers.r.top.right = stickers.d.bottom.right;
            stickers.d.bottom.right = stickers.l.bottom.left;
            stickers.l.bottom.left = temp;
            temp = stickers.u.top.right;
            stickers.u.top.right = stickers.r.bottom.right;
            stickers.r.bottom.right = stickers.d.bottom.left;
            stickers.d.bottom.left = stickers.l.top.left;
            stickers.l.top.left = temp;
            temp = stickers.u.top.middle;
            stickers.u.top.middle = stickers.r.middle.right;
            stickers.r.middle.right = stickers.d.bottom.middle;
            stickers.d.bottom.middle = stickers.l.middle.left;
            stickers.l.middle.left = temp;
            break;
    }
}

export const applyMove = (stickers: Stickers, move: string) => {
    switch (move) {
        case "L":
            cycleLayer(stickers, "L");
            break;
        case "L'":
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            break;
        case "L2":
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            break;
        case "M":
            cycleLayer(stickers, "M");
            break;
        case "M'":
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "M2":
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "R":
            cycleLayer(stickers, "R");
            break;
        case "R'":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            break;
        case "R2":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            break;
        case "U":
            cycleLayer(stickers, "U");
            break;
        case "U'":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            break;
        case "U2":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            break;
        case "E":
            cycleLayer(stickers, "E");
            break;
        case "E'":
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "E2":
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "D":
            cycleLayer(stickers, "D");
            break;
        case "D'":
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            break;
        case "D2":
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            break;
        case "F":
            cycleLayer(stickers, "F");
            break;
        case "F'":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            break;
        case "F2":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            break;
        case "S":
            cycleLayer(stickers, "S");
            break;
        case "S'":
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "S2":
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "B":
            cycleLayer(stickers, "B");
            break;
        case "B'":
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            break;
        case "B2":
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            break;
        case "l":
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "M");
            break;
        case "l'":
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "l2":
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "r":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "r'":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            break;
        case "r2":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            break;
        case "u":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "u'":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            break;
        case "u2":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "d":
            cycleLayer(stickers, "D");
            break;
        case "d'":
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "d2":
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            break;
        case "f":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            break;
        case "f'":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "f2":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "b":
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "b'":
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "S");
            break;
        case "b2":
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            break;
        case "x":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            break;
        case "x'":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "L");
            break;
        case "x2":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            break;
        case "y":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            break;
        case "y'":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "D");
            break;
        case "y2":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            break;
        case "z":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            break;
        case "z'":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "B");
            break;
        case "z2":
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "F");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "S");
            cycleLayer(stickers, "B");
            cycleLayer(stickers, "B");
            break;
    }
}
