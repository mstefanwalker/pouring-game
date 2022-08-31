import type { Board } from './rules';
import { game, calculate } from './rules';

test('expect to pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 0 ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(game.getMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect to pour from a full vial into a matching partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ 0 ] },
        ],
    }
    expect(game.getMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect not to pour from a full vial into a mismatched partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ 1 ] },
        ],
    }
    expect(game.getMoves(board)).toEqual([]);
});

test('pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 0 ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(game.applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 1, liquid: [ ] },
            { size: 1, liquid: [ 0 ] },
        ],
    });
});

test('pour from a full vial with two liquid into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    expect(game.applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 2, liquid: [ ] },
            { size: 2, liquid: [ 0, 0 ] },
        ],
    });
});

test('pour from a full heterogeneous vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 3, liquid: [ 1, 0, 0 ] },
            { size: 3, liquid: [ ] },
        ],
    }
    expect(game.applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 3, liquid: [ 1 ] },
            { size: 3, liquid: [ 0, 0 ] },
        ],
    });
});

test('restore spilled liquid when overflowing a vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ 0 ] },
        ],
    }
    expect(game.applyMove(board, {from: 0, to: 1})).toEqual({
        vials: [
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ 0, 0 ] },
        ],
    });
});

test('win when no two liquids share a vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    expect(game.gameWon(board)).toBe(true);
});

test('don\'t win if one type of liquid is split between multiple vials', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ 0 ] },
        ],
    }
    expect(game.gameWon(board)).toBe(false);
});

test('ensure apply move is a pure function', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 1 ] },
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    let identicalBoard: Board = {
        vials: [
            { size: 2, liquid: [ 0, 1 ] },
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    game.applyMove(board, {from: 0, to: 2});
    expect(calculate.boardEqual(board, identicalBoard)).toEqual(true);
});

test('reordering vials is tree equivilant', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 1 ] },
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    let equivilantBoard: Board = {
        vials: [
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
            { size: 2, liquid: [ 0, 1 ] },
        ],
    }
    expect(calculate.boardTreeEquivalent(board, equivilantBoard)).toEqual(true);
});

test('recoloring liquid is tree equivalent', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 1 ] },
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    let equivalentBoard: Board = {
        vials: [
            { size: 2, liquid: [ 1, 0 ] },
            { size: 2, liquid: [ 1 ] },
            { size: 2, liquid: [ ] },
        ],
    }
    expect(calculate.boardTreeEquivalent(board, equivalentBoard)).toEqual(true);
});

test('recoloring liquid and reordering vials is tree equivalent', () => {
    let board: Board = {
        vials: [
            { size: 4, liquid: [ 0, 1, 2, 0 ] },
            { size: 4, liquid: [ 1, 3, 3, 4 ] },
            { size: 4, liquid: [ 1, 4, 4, 0 ] },
            { size: 4, liquid: [ 0, 1, 3, 2 ] },
            { size: 4, liquid: [ 3, 4, 2, 2 ] },
            { size: 4, liquid: [ ] },
            { size: 4, liquid: [ ] },
        ],
    }
    let equivalentBoard: Board = {
        vials: [
            { size: 4, liquid: [ 4, 2, 2, 0 ] },
            { size: 4, liquid: [ 3, 4, 2, 1 ] },
            { size: 4, liquid: [ ] },
            { size: 4, liquid: [ 3, 4, 1, 3 ] },
            { size: 4, liquid: [ 4, 0, 0, 3 ] },
            { size: 4, liquid: [ ] },
            { size: 4, liquid: [ 2, 0, 1, 1 ] },
        ],
    }
    expect(calculate.boardTreeEquivalent(board, equivalentBoard)).toEqual(true);
});