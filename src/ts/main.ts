import {World, Body, Box, Plane, Circle} from 'p2';
import Game from './Game';
import GameEngine from './GameEngine';
import {Container, WebGLRenderer, CanvasRenderer} from 'pixi.js';

document.addEventListener('DOMContentLoaded', () => {

  let gameEngine = new GameEngine();
  let game: Game = new Game(gameEngine);

  document.body.appendChild(gameEngine.app.view);

})