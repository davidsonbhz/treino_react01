import React from 'react';
import './game.css';

/*
class Square extends React.Component {

    render() {
      return (
          
        <button className="square" onClick={this.props.onClick}>
            {this.props.value}
        </button>
       
      );
    }
  }*/

//"Function components are less tedious to write than classes"... Excelente argumento técnico!!! 
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Board extends React.Component {

    //o estado é gerenciado pelo Game
    /*
        constructor(props) {
            super(props);
            this.state = {
                squares: Array(9).fill(null),
                xIsNext: true
            }
        }*/


    /**
     * Questão da imutabilidade dos objetos: podemos comparar facilmente pela referencia dos mesmos
     * e ver se houve mudança entre um novo e um antigo. Podemos também implementar coisas como 
     * "undo" e "redo" com cópias dos estados salvos.
     * Fica fácil também saber se um componente precisa ser renderizado novamente
     */

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = (this.state.xIsNext ? 'X' : 'O');
        //imutabilidade. Ao inves de alterar o estado diretamente, substituimos por uma cópia
        this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
    }

    renderSquare(i) {

        // return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }

    render_old() {
        /*
        let status = `Próximo: ${(this.state.xIsNext ? 'X' : 'O')}`;
        const winner = calculateWinner(this.state.squares);
        
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );*/
    }
}



export default class Game extends React.Component {

    constructor(props) {
        super(props);
        //mantem o estado das jogadas em um historico
        //aqui entra o conceito de controle dos componentes por um componente pai.
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i) {
        /*
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext
        });*/

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

    }

    jumpTo(step) {
        //faz a atualização do estado do componente, este estado afeta
        //todo o método render
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //o histórico foi remapeado para exibir em forma de movimentos
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={Math.random()}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    render_old() {

        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}


///////////////////////
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}