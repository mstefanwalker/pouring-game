import type { Board, Liquid, Vial } from './rules';

export type VisualBoard = {
    vials: VisualVial[];
}

export type VisualVial = {
    size: number,
    contents: Content[],
};

export type Content = VisualLiquid | VisualAir;

export type VisualLiquid = {
    type: 'liquid',
    liquid: Liquid,
}

export type VisualAir = {
    type: 'air',
}

export function visualizeBoard(board: Board): VisualBoard {
    for (let vial of board.vials) {
        if (vial.liquid.length > vial.size) {
            throw new Error('Vial has more liquid than it can hold');
        }
    }
    let vials: VisualVial[] = [];
    for (let vial of board.vials) {
        vials.push({
            size: vial.size,
            contents: fillVialWithAir(vial),
        });
    }
    return {
        vials: vials,
    };
}

function fillVialWithAir(vial: Vial): Content[] {
    let contents: Content[] = [];
    for (let i = 0; i < vial.size; i++) {
        if (i < vial.liquid.length) {
            contents.push({
                type: 'liquid',
                liquid: vial.liquid[i]
            });
        } else {
            contents.push({
                type: 'air',
            });
        }
    }
    return flipArray(contents);
}

function flipArray(array: any[]): any[] {
    return array.reverse();
}