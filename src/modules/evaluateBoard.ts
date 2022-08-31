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
    depthLimit: DepthLimit | NoLimit,
    shortestSolve: number,
    winningNodes: number,
    losingNodes: number
}

export type DepthLimit = {
    type: 'depthLimit',
    depth: number,
}

export type NoLimit = {
    type: 'noLimit',
}

export function evaluateBoard(board: Board): BoardEvaluation {
    return evaluateBoardBFS(board, {type: 'depthLimit', depth: 4});
}

function evaluateBoardBFS(board: Board, depthLimit: DepthLimit | NoLimit): BoardEvaluation {
    let startingNode: Node = { board: board, moves: new Map() };
    let stateGraph = {
        start: startingNode,
    }
    let statistics = {
        depthLimit: depthLimit,
        shortestSolve: 0,
        winningNodes: 0,
        losingNodes: 0
    }
    let currentNodes: Queue<Node> = new Queue();
    currentNodes.enqueue(startingNode);
    let nextNodes: Queue<Node> = new Queue();
    let visited: Board[] = [];
    let depth = 0;
    let solves: number[] = [];
    while(!currentNodes.isEmpty()) {
        nextNodes = new Queue();
        if (depthLimit.type === 'depthLimit' && depth >= depthLimit.depth) {
            break;
        }
        while (!currentNodes.isEmpty()) {
            let node = currentNodes.dequeue() as Node;
            let moves = game.getMoves(node.board);
            if (moves.length == 0) {
                statistics.losingNodes++;
                continue;
            }
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
                if (won) {
                    statistics.winningNodes++;
                    solves.push(depth + 1);
                } else {
                    nextNodes.enqueue(nextNode);
                }
            }
        }
        currentNodes = nextNodes;
        depth++;
    }
    statistics.shortestSolve = Math.min(...solves);
    return {
        stateGraph: stateGraph,
        statistics: statistics,
    }
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
