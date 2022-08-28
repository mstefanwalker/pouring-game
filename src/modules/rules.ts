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

export type Liquid = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'white' | 'black';

export function applyMove(board: Board, move: Move): Board {
    let vials = board.vials;
    let from: Vial = vials[move.from];
    let to: Vial = vials[move.to];
    let movingLiquid: Liquid[] = popMatchingLiquid(from);
    to.liquid = to.liquid.concat(movingLiquid);
    return {vials: vials};
}

function popMatchingLiquid(vial: Vial): Liquid[] {
    let liquidToMatch = vial.liquid.pop() as Liquid;
    let poppedLiquid = [liquidToMatch];
    for (let i = vial.liquid.length - 1; i >= 0; i--) {
        if (vial.liquid[i] !== liquidToMatch) {
            return poppedLiquid;
        }
        poppedLiquid.push(vial.liquid.pop() as Liquid);
    }
    return poppedLiquid;
}

export function returnMoves(board: Board): Move[] {
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