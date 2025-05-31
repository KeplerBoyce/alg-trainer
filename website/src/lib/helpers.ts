import { AUF_ALGS, COLOR_MAP, DEFAULT_STICKERS, DEFAULT_STICKERS_TOP_ONLY, EPLL_ALGS, PLL_ALGS } from "./constants"
import type { Color, Face, Layer, Randomization, Stickers } from "./types"
import CubeJS from 'cubejs';
const Cube = CubeJS;

Cube.initSolver();

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

const stripParentheses = (alg: string) => {
    return alg.replace(/[\(\)]/g, '');
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

// Generates a "random" looking scramble to produce the inverse state of an algorithm
export const randomAlgScramble = (alg: string, numRandom: number, randomization: Randomization) => {
    alg = stripParentheses(alg);
    const allMoves = ["R", "R'", "R2", "U", "U'", "U2", "F", "F'", "F2",
                      "L", "L'", "L2", "D", "D'", "D2", "B", "B'", "B2"];
    const inverse = Cube.inverse(alg);
    const targetCube = new Cube();

    // Apply randomization according to which randomization mode is selected
    const auf1 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
    const auf2 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
    switch (randomization) {
        case "AUF":
            targetCube.move(auf2);
            break;
        case "EPLL":
            const epll = EPLL_ALGS[Math.floor(Math.random() * EPLL_ALGS.length)];
            targetCube.move(auf1);
            targetCube.move(epll);
            targetCube.move(auf2);
            break;
        case "PLL":
            const pll = PLL_ALGS[Math.floor(Math.random() * PLL_ALGS.length)];
            targetCube.move(auf1);
            targetCube.move(pll);
            targetCube.move(auf2);
            break;
    }

    targetCube.move(inverse);

    let currState = targetCube.clone();
    let randomMoves = [];

    let lastFace = '';
    for (let i = 0; i < numRandom; i++) {
        while (true) {
            const chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            const chosenFace = chosenMove[0];

            if (chosenFace !== lastFace) {
                randomMoves.push(chosenMove);
                currState.move(chosenMove);
                lastFace = chosenMove[0];
                break;
            }
        }
    }
    let solution = `${randomMoves.join(' ')} ${currState.solve()}`.split(' ');
    // Check for merging last random move with first solution move if same face
    const simplified = simplifySolution(solution, numRandom).join(' ');
    return Cube.inverse(simplified);
}

export const getAlgStickers = (alg: string, topColorOnly?: boolean) => {
    alg = stripParentheses(alg);
    let stickers;
    if (topColorOnly) {
        stickers = structuredClone(DEFAULT_STICKERS_TOP_ONLY);
    } else {
        stickers = structuredClone(DEFAULT_STICKERS);
    }
    // Regex for matching all possible Rubik's Cube move notations, empty list on null
    const moves = alg.match(/[LMRUEDFSBlrudfbxyz][']?2?/g) || [];

    for (const move of reverseMoves(moves)) {
        applyMove(stickers, move);
    }
    return stickers;
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
            stickers.b.bottom.left = stickers.l.top.left;
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
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            cycleLayer(stickers, "L");
            break;
        case "x'":
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "R");
            cycleLayer(stickers, "M");
            cycleLayer(stickers, "M");
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
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            cycleLayer(stickers, "D");
            break;
        case "y'":
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "U");
            cycleLayer(stickers, "E");
            cycleLayer(stickers, "E");
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
