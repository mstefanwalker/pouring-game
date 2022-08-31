import type { Board, Move } from './rules';
import { game, calculate } from './rules';

export type BoardEvaluation = {
    stateGraph: StateGraph,
    statistics: Statistics,
}

export type StateGraph = {
    start: Node,
}

export type Node = {
    board: Board,
    moves: Moves,
}

export type Moves = Map<Move, Node>

export type Statistics = {
    shortestSolves: Sequence[],
    deadEnds: number,
}

export type Sequence = Move[];

export function evaluateBoard(board: Board): BoardEvaluation {
    return { 
        stateGraph: {
            start: buildTreeBFS(board),
        },
        statistics: {
            shortestSolves: [],
            deadEnds: 0,
        },
    };
}

export function buildTreeBFS(board: Board): Node {
    let currentNodes: Queue<Node> = new Queue();
    let startingNode: Node = { board: board, moves: new Map() };
    currentNodes.enqueue(startingNode);
    let nextNodes: Queue<Node> = new Queue();
    let visited: Board[] = [];
    let depth = 0;
    while(!currentNodes.isEmpty()) {
        nextNodes = new Queue();
        if (depth >= 4) {
            break;
        }
        while (!currentNodes.isEmpty()) {
            let node = currentNodes.dequeue() as Node;
            let moves = game.getMoves(node.board);
            for (let move of moves) {
                let nextBoard = game.applyMove(node.board, move);
                if (visited.some(b => calculate.boardTreeEquivalent(b, nextBoard))) {
                    continue;
                } else {
                    visited.push(nextBoard);
                }
                let nextNode = {
                    board: nextBoard,
                    moves: new Map(),
                };
                node.moves.set(move, nextNode);
                let won = game.gameWon(nextBoard);
                if (!won) {
                    nextNodes.enqueue(nextNode);
                }
            }
        }
        currentNodes = nextNodes;
        depth++;
    }
    return startingNode;
}

class Queue<E> {
    private items: E[] = [];
    public enqueue(item: E): void {
        this.items.push(item);
    }
    public dequeue(): E | undefined {
        return this.items.shift();
    }
    public isEmpty(): boolean {
        return this.items.length === 0;
    }
}
