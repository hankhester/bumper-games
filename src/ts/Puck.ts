import {Body, Material, Circle, Shape} from 'p2';
import {Graphics} from 'pixi.js';
import {Piece} from './Piece';
import Color from './Color';
import GameEngine from './GameEngine';

export default class Puck implements Piece {
  body: Body;
  graphics: Graphics;
  colorVal: Color;

  static MASS: number = 0.1;
  static RADIUS: number = 15;

  constructor(x: number, y: number, color: Color) {
    this.colorVal = color;
    this.initPhysics(x, y);
    this.initGraphics();
  }

  set color(color: Color) {
    this.colorVal = color;
    this.redraw();
  }

  get color(): Color {
    return this.colorVal;
  }

  initPhysics(x: number, y: number) {
    this.body = new Body({
      mass: Puck.MASS,
      position: [x, y]
    })
    let circle: Circle = new Circle({ radius: Puck.RADIUS });
    this.body.addShape(circle);
  }

  initGraphics() {
    let g: Graphics = new Graphics();
    let lineWidth = 2;
    let fillColor: number = this.color.toNumber();
    let lineColor: number = this.color.darken(25).toNumber();
    g.beginFill(fillColor);
    g.lineStyle(lineWidth, lineColor);
    g.drawCircle(this.body.interpolatedPosition[0], this.body.interpolatedPosition[1], Puck.RADIUS - lineWidth / 2);
    this.graphics = g;
  }

  redraw() {
    this.graphics.clear()
    let lineWidth = 2;
    let fillColor: number = this.color.toNumber();
    let lineColor: number = this.color.darken(25).toNumber();
    this.graphics.beginFill(fillColor);
    this.graphics.lineStyle(lineWidth, lineColor);
    this.graphics.drawCircle(0, 0, Puck.RADIUS - lineWidth / 2);
  }
}