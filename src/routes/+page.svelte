<script lang='ts'>
    import type { Board, Move } from '../modules/rules';
    import { getMoves, applyMove, gameWon } from '../modules/rules';
    import type { VisualBoard } from '../modules/boardVisualizer';
    import { visualizeBoard } from '../modules/boardVisualizer';

    let colors = [
        'darkmagenta',
        'darkorchid',
        'slateblue',
        'indigo',
        'mediumvioletred'
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
    $: console.log(getMoves(board));
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
            let moves: Move[] = getMoves(board);
            if (moves.some(m => m.from === move.from && m.to === move.to)) {
                board = applyMove(board, move);
                if (gameWon(board)) {
                    alert('you win!!!');
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
        <span class='vial'>
            {#each vial.contents as content}
                {#if content.type == 'liquid'}
                    <div class='liquid' style="--color: {colors[content.liquid]}">
                        
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
        height: 200px;
        background-color: lightgrey;
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