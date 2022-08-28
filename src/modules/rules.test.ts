import type { Board } from './rules';
import { returnMoves, applyMove } from './rules';

test('expect to pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 'red' ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(returnMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect to pour from a full vial into a matching partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 'red', 'red' ] },
            { size: 2, liquid: [ 'red' ] },
        ],
    }
    expect(returnMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect not to pour from a full vial into a mismatched partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 'red', 'red' ] },
            { size: 2, liquid: [ 'blue' ] },
        ],
    }
    expect(returnMoves(board)).toEqual([]);
});

test('pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 'red' ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 1, liquid: [ ] },
            { size: 1, liquid: [ 'red' ] },
        ],
    });
});

test('pour from a full vial of size 2 into an empty vial of size 2', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 'red', 'red' ] },
            { size: 2, liquid: [ ] },
        ],
    }
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 2, liquid: [ ] },
            { size: 2, liquid: [ 'red', 'red' ] },
        ],
    });
});

test('pour from a full heterogeneous vial of size 3 into an empty vial of size 3', () => {
    let board: Board = {
        vials: [
            { size: 3, liquid: [ 'blue', 'red', 'red' ] },
            { size: 3, liquid: [ ] },
        ],
    }
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 3, liquid: [ 'blue' ] },
            { size: 3, liquid: [ 'red', 'red' ] },
        ],
    });
});