import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./App.css";
import io from "socket.io-client";

const background_color = "#231f20";
const snake_color = "#c2c2c2";
const food_color = "#e66916";
const gameState = {
  player: {
    pos: {
      x: 3,
      y: 10,
    },
    vel: {
      x: 1,
      y: 0,
    },
    snake: [
      { x: 1, y: 10 },
      { x: 2, y: 10 },
      { x: 3, y: 10 },
    ],
  },
  food: {
    x: 7,
    y: 7,
  },
  gridSize: 20,
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: 0,
    };
  }
  handleGameOver = () => {
    console.log("ayipaaye");
  };
  componentDidMount() {
    //socket connection
    const connOpt = {
      transports: ["websocket"],
    };
    this.socket = io("http://localhost:3001", connOpt);
    this.socket.on("init", this.handleInit);
    this.socket.on("gameState", this.handleGameState);
    this.socket.on("gameOver", this.handleGameOver);
    this.socket.on("increaseScore", () => {
      this.setState({ score: this.state.score + 1 });
    });
    //
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 600;

    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", (e) => {
      this.socket.emit("keycode", e.keyCode);
    });
    //this.paintgame(gameState, ctx, canvas);
  }
  paintgame(state, ctx, canvas) {
    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = food_color;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    this.paintPlayer(state.player, size, ctx, canvas);
  }
  paintPlayer(playerState, size, ctx, canvas) {
    const snake = playerState.snake;
    ctx.fillStyle = snake_color;
    for (let cell of snake) {
      ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
  }
  handleInit = () => {};
  handleGameState = (gameState) => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 600;
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => this.paintgame(gameState, ctx, canvas));
  };
  render() {
    return (
      <Container>
        <div id="gameScreen">
          <p id="score">Score:{this.state.score}</p>
          <div>
            <canvas id="canvas"></canvas>
          </div>
        </div>
      </Container>
    );
  }
}
export default App;
