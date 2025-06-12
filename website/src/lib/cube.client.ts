import * as CubeJS from 'cubejs';
import { simplifySolution, stripParentheses } from './helpers';
import { AUF_ALGS, EPLL_ALGS, PLL_ALGS } from './constants';
import type { Randomization } from './types';

const Cube = CubeJS.default;
Cube.initSolver();

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
    const auf3 = AUF_ALGS[Math.floor(Math.random() * AUF_ALGS.length)];
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
    // Another AUF after the reversed algorithm (so user doesn't always see in same orientation)
    targetCube.move(auf3);

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
    // Return both the scramble and the final random AUF applied (so we can add the necessary
    // rotation to the start of the solution)
    return [Cube.inverse(simplified), auf3];
}
