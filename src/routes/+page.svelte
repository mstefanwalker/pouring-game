<script lang='ts'>
    import type { Board, Move } from '../modules/rules';
    import { game, calculate } from '../modules/rules';
    import type { VisualBoard } from '../modules/visualizeBoard';
    import { visualizeBoard } from '../modules/visualizeBoard';
    import { evaluateBoard } from '../modules/evaluateBoard';

    let colors = [
        '#7440f3',
        '#a799ff',
        '#00538f',
        '#00cab2',
        '#0390b0',
    ];

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

    $: console.log(evaluateBoard(board));
    let input: number[] = [];
    
    let visualBoard: VisualBoard = { vials: [] };
    $: visualBoard = visualizeBoard(board);

    function handleClick(index: number) {
        input = [...input, index];
        if (input.length > 1) {
            let move: Move = {
                from: input[0],
                to: input[1],
            };
            let moves: Move[] = game.getMoves(board);
            if (moves.some(m => calculate.moveEqual(m, move))) {
                board = game.applyMove(board, move);
                if (game.gameWon(board)) {
                    setTimeout(() => alert('you win!!!'), 10);
                }
                if (game.getMoves(board).length === 0) {
                    setTimeout(() => alert('no more moves :('), 10);
                }
            } else {
                alert(`can't move from ${move.from} to ${move.to}`);
            }
            input = [];
        }
    }
</script>

<h1>Pouring Vials or Something</h1>

<div class='game'>
    {#each visualBoard.vials as vial, index}
        <span class='vial' style='--size: {vial.size}'>
            {#each vial.contents as content}
                {#if content.type == 'liquid'}
                    <div class='liquid' style='--color: {colors[content.liquid]}'>
                        
                    </div>
                {:else if content.type == 'air'}
                    <div class='air'>
                        
                    </div>
                {/if}
            {/each}
            <div>
                <button on:click={() => handleClick(index)}>
                    {index}
                </button>
            </div>
        </span>
    {/each}
    clicked {input.length >= 1 ? 'button ' + input : 'nothing yet'}
</div>

<style>
    .game {
        background-color: lightgrey;
    }
    .vial {
        margin-bottom: 75px;
        display: inline-block;
        width: 50px;
        height: var(--size) * 50px;
        background-color: rgb(229, 229, 229);
    }
    .liquid, .air {
        width: 50px;
        height: 50px;
    }
    .liquid {
        background-color: var(--color);
    }
    button {
        width: 50px;
        height: 50px;;
    }
    h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
</style>