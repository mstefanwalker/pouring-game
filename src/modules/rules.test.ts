import type { Board } from './rules';
import { returnMoves } from './rules';

test('pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 'red' ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(returnMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('pour from a full vial into a matching partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 'red', 'red' ] },
            { size: 2, liquid: [ 'red' ] },
        ],
    }
    expect(returnMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('pour from a full vial into a mismatched partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 'red', 'red' ] },
            { size: 2, liquid: [ 'blue' ] },
        ],
    }
    expect(returnMoves(board)).toEqual([]);
});