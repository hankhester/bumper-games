import {Body, Material, Shape, Box} from 'p2';
import {Graphics, Rectangle} from 'pixi.js';
import {Piece} from './Piece';
import Octogon from './Octogon';
import Color from './Color';
import GameEngine from './GameEngine';

export default class Wall implements Piece {
  body: Body;
  graphics: Graphics;
  color: Color;
  readonly width: number;
  readonly height: number

  constructor(x: number, y: number, color: Color, angle: number) {
    this.color = color;
    this.width = Math.abs(2 * Octogon.RADIUS * Math.sin(180/8) * 0.85);
    this.height = 10;
    this.initPhysics(x, y, angle);
    this.initGraphics();
  }

  initPhysics(x: number, y: number, angle: number) {
    this.body = new Body({
      position: [x, y],
      angle: angle
    });
    let box: Box = new Box({
      width: this.width,
      height: this.height
    });
    this.body.addShape(box);
  }

  initGraphics() {
    let g: Graphics = new Graphics();
    g.beginFill(this.color.toNumber())
    g.drawRect(-this.width / 2, 0, this.width, this.height);
    g.rotation = this.body.angle;
    this.graphics = g;
  }
}