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

export function returnMoves(board: Board): Move[] {
    let moves: Move[] = [];
    moves = [...movesToEmptyVials(board), ...moves];
    moves = [...movesToPartialEmptyVials(board), ...moves];
    return moves;
}

// moves to partial empty vials ================================================
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

// moves to empty vials ========================================================
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