import type { Board } from './rules';
import { getMoves, applyMove, gameWon } from './rules';

test('expect to pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 0 ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(getMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect to pour from a full vial into a matching partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ 0 ] },
        ],
    }
    expect(getMoves(board)).toEqual([{from: 0, to: 1}]);
});

test('expect not to pour from a full vial into a mismatched partially empty vial', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0, 0 ] },
            { size: 2, liquid: [ 1 ] },
        ],
    }
    expect(getMoves(board)).toEqual([]);
});

test('pour from a full vial into an empty vial', () => {
    let board: Board = {
        vials: [
            { size: 1, liquid: [ 0 ] },
            { size: 1, liquid: [ ] },
        ],
    }
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
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
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
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
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
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
    expect(applyMove(board, {from: 0, to: 1})).toEqual({
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
    expect(gameWon(board)).toBe(true);
});

test('don\'t win if one type of liquid is split between multiple vials', () => {
    let board: Board = {
        vials: [
            { size: 2, liquid: [ 0 ] },
            { size: 2, liquid: [ 0 ] },
        ],
    }
    expect(gameWon(board)).toBe(false);
})