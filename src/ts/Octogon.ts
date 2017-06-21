import {Body, Box, Shape, vec2} from 'p2';
import {Graphics, Rectangle} from 'pixi.js';
import {Piece} from './Piece';
import Wall from './Wall';
import Color from './Color';
import GameEngine from './GameEngine';

export default class Octogon {

  walls: Wall[];
  color: Color

  public static RADIUS: number = 235;

  constructor(x: number, y: number, color: Color) {
    this.color = color;
    this.walls = []
    const r = Octogon.RADIUS;
    for (let i: number = 0; i < 8; i++) {
      let xPos: number = r * Math.cos(2 * Math.PI * i / 8) + x;
      let yPos: number = r * Math.sin(2 * Math.PI * i / 8) + y;
      let angle: number = (i * Math.PI / 4) + Math.PI / 2;
      let wall: Wall = new Wall(xPos, yPos, this.color, angle);
      this.walls.push(wall);
    }
  }
}