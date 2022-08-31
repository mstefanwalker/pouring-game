export type Move = {
    from: number;
    to: number;
}

export type Board = {
    vials: Vial[];
}

export type Vial = {
    size: number;
    liquid: Liquid[];
}

export type Liquid = number;

export namespace game {

    export function gameWon(board: Board): boolean {
        let vialByLiquid: {[liquid: number]: Vial} = {};
        for (let vial of board.vials) {
            if (vial.liquid.length === 0) {
                continue;
            }
            let bottomLiquid = vial.liquid[0];
            if (vialByLiquid[bottomLiquid] === undefined) {
                vialByLiquid[bottomLiquid] = vial;
            } else {
                return false;
            }
            for (let i = 1; i < vial.liquid.length; i++) {
                if (vial.liquid[i] !== bottomLiquid) {
                    return false;
                }
            }
        }
        return true;
    }

    export function applyMove(board: Board, move: Move): Board {
        let newBoard = copyBoard(board);
        let vials = newBoard.vials;
        let from: Vial = vials[move.from];
        let to: Vial = vials[move.to];
        let movingLiquid: Liquid[] = popMatchingLiquid(from);
        to.liquid = to.liquid.concat(movingLiquid);
        while (to.liquid.length > to.size) {
            let spilledLiquid: Liquid = to.liquid.pop() as Liquid;
            from.liquid.push(spilledLiquid);
        }
        return {vials: vials};
    }

    function copyBoard(board: Board): Board {
        let vials: Vial[] = [];
        for (let vial of board.vials) {
            vials.push({
                size: vial.size,
                liquid: vial.liquid.slice(),
            });
        }
        return {vials: vials};
    }

    function popMatchingLiquid(vial: Vial): Liquid[] {
        let liquidToMatch = vial.liquid.pop() as Liquid;
        let poppedLiquid = [liquidToMatch];
        for (let i = vial.liquid.length - 1; i >= 0; i--) {
            if (vial.liquid[i] === liquidToMatch) {
                poppedLiquid.push(vial.liquid.pop() as Liquid);
            } else {
                return poppedLiquid;
            }
        }
        return poppedLiquid;
    }

    export function getMoves(board: Board): Move[] {
        let moves: Move[] = [];
        moves = [...movesToEmptyVials(board), ...moves];
        moves = [...movesToPartialEmptyVials(board), ...moves];
        return moves;
    }

    function movesToPartialEmptyVials(board: Board): Move[] {
        let vials = board.vials;
        let partialEmptyMoves: Move[] = [];
        let nonEmptyVials: number[] = getNonEmptyVials(board);
        let partialEmptyVials: number[] = getPartialEmptyVials(board);
        for (let from = 0; from < nonEmptyVials.length; from++) {
            for (let to = 0; to < partialEmptyVials.length; to++) {
                let nonEmptyVial: Vial = vials[nonEmptyVials[from]];
                let partialEmptyVial: Vial = vials[partialEmptyVials[to]];
                if (nonEmptyVials[from] !== partialEmptyVials[to] && getTopLiquid(nonEmptyVial) === getTopLiquid(partialEmptyVial)) {
                    partialEmptyMoves.push({from: nonEmptyVials[from], to: partialEmptyVials[to]});
                }
            }
        }
        return partialEmptyMoves;
    }

    function getPartialEmptyVials(board: Board): number[] {
        return findAllIndexes(board.vials, vial => vial.liquid.length >= 1 && vial.liquid.length < vial.size);
    }

    function getTopLiquid(vial: Vial): Liquid {
        return vial.liquid[vial.liquid.length - 1];
    }

    function movesToEmptyVials(board: Board): Move[] {
        let nonEmptyVials: number[] = getNonEmptyVials(board);
        let emptyVials: number[] = getEmptyVials(board);
        let moves: Move[] = [];
        let vials = board.vials;
        for (let from = 0; from < nonEmptyVials.length; from++) {
            for (let to = 0; to < emptyVials.length; to++) {
                moves.push({from: nonEmptyVials[from], to: emptyVials[to]});
            }
        }
        return moves;
    }

    function getNonEmptyVials(board: Board): number[] {
        return findAllIndexes(board.vials, vial => vial.liquid.length !== 0);
    }

    function getEmptyVials(board: Board): number[] {
        return findAllIndexes(board.vials, vial => vial.liquid.length === 0);
    }

    function findAllIndexes(array: any[], predicate: (value: any) => boolean): number[] {
        let indexes: number[] = [];
        for (let i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                indexes.push(i);
            }
        }
        return indexes;
    }
}

export namespace calculate {

    export function moveEqual(move1: Move, move2: Move): boolean {
        return move1.from === move2.from && move1.to === move2.to;
    }

    export function boardEqual(board1: Board, board2: Board): boolean {
        if (board1.vials.length !== board2.vials.length) {
            return false;
        }
        for (let v = 0; v < board1.vials.length; v++) {
            if (board1.vials[v].size !== board2.vials[v].size) {
                return false;
            }
            if (board1.vials[v].liquid.length !== board2.vials[v].liquid.length) { 
                return false;
            }
            for (let l = 0; l < board1.vials[v].liquid.length; l++) {
                if (board1.vials[v].liquid[l] !== board2.vials[v].liquid[l]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Used for tree search.
     * There are two transformations that don't effect the shape of the move tree generated from any given board:
     *   1. Swapping all of one color with another color across all vials
     *   2. Swapping the order of vials without changing thier contents
     * Given the complete move tree from a given board A, after either of these transformations are applied
     * to produce a board B, one mapping can be written such that when the mapping is applied to each move
     * individually, it transforms board A's move tree into board B's move tree.
     * 
     * This means that in caclulations like a breadth first search to find the shortest solve for a given board,
     * nodes on the tree that have a tree-equivilent board to a board already discovered don't need to be expanded
     * on in the search.
    */ 
    export function boardTreeEquivalent(board1: Board, board2: Board): boolean {
        let vialPatternsEquivalent = areVialPatternsEquivalent(board1.vials, board2.vials);
        if (!vialPatternsEquivalent) {
            return false;
        }
        let vialRowsEquivalent = areVialRowsEquivalent(board1.vials, board2.vials);
        if (!vialRowsEquivalent) {
            return false;
        }
        return true;
    }

    function areVialRowsEquivalent(vials1: Vial[], vials2: Vial[]): boolean {
        let mostLiquid = Math.max(...vials1.map(vial => vial.liquid.length));
        for (let level = 0; level < mostLiquid; level++) {
            let matchingEntires1 = getMatchingEntries(vials1, level);
            let matchingEntires2 = getMatchingEntries(vials2, level);
            if (!arraysEqual(matchingEntires1, matchingEntires2)) {
                return false;
            }
        }
        return true;
    }

    function getMatchingEntries(vials: Vial[], level: number): number[] {
        let vialsLiquid: Liquid[] = vials
            .map(vial => vial.liquid[level] === undefined ? undefined : vial.liquid[level])
            .filter(liquid => liquid !== undefined) as Liquid[];
        return countMatchingEntries(vialsLiquid).sort((a, b) => b - a);
    }

    function countMatchingEntries(array: number[]): number[] {
        let counts: number[] = [];
        let counted: number[] = [];
        for (let i = 0; i < array.length; i++) {
            if (counted.includes(array[i])) {
                continue;
            }
            let count = 0;
            for (let j = 0; j < array.length; j++) {
                if (array[i] === array[j]) {
                    count++;
                }
            }
            counts.push(count);
            counted.push(array[i]);
        }
        return counts;
    }

    function arraysEqual(array1: number[], array2: number[]): boolean {
        if (array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    function areVialPatternsEquivalent(vials1: Vial[], vials2: Vial[]): boolean {
        return getVialsPattern(vials1) === getVialsPattern(vials2);
    }

    function getVialsPattern(vials: Vial[]): number {
        let patterns: number[] = vials.map(vial => getVialPattern(vial)).sort((a, b) => b - a);
        let maxPattern = Math.max(...patterns);
        let base = maxPattern;
        let hash = 0;
        for (let i = 0; i < patterns.length; i++) {
            hash += patterns[i] * Math.pow(base, i);
        }
        return hash;
    }

    function getVialPattern(vial: Vial): number {
        let patternMap: Map<Liquid, number> = new Map();
        let base = vial.liquid.length;
        let hash = 0;
        for (let i = 0; i < vial.liquid.length; i++) {
            let liquid = vial.liquid[i];
            if (!patternMap.has(liquid)) {
                patternMap.set(liquid, patternMap.size);
            }
            hash += patternMap.get(liquid) as number * Math.pow(base, i);
        }
        return hash;
    }
}
