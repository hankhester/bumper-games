import {Body, Material, Circle, Shape, Box, Capsule} from 'p2';
import {Graphics} from 'pixi.js';
import {Piece} from './Piece';
import Game from './Game';
import Color from './Color';
import GameEngine from './GameEngine';

export default class Ship implements Piece {

  static HOME_COLOR: Color = new Color('lightblue');
  static AWAY_COLOR: Color = new Color('#85AF85');
  static FLAME_COLOR: Color = new Color('orangered');
  static RADIUS: number = 24;
  static THRUST_FORCE: number = 30;
  static TORQUE_FORCE: number = 0.012;

  private static MASS: number = 0.5;
  private static BOUNCINESS: number = 0.95;
  private static FRICTION: number = 0.15;

  body: Body;
  graphics: Graphics;
  color: Color;
  thrustVal: number;
  torqueVal: number;
  flameFL: Graphics;
  flameFR: Graphics;
  flameRL: Graphics;
  flameRR: Graphics;

  private hull: Circle;
  private engineLeft: Box;
  private engineRight: Box;  

  constructor(x: number, y: number, color: Color) {
    this.color = color;
    this.thrustVal = 0;
    this.torqueVal = 0;
    this.initPhysics(x, y);
    this.initGraphics();
  }

  get thrust(): number {
    return this.thrustVal;
  }

  set thrust(thrust: number) {
    this.thrustVal = thrust;
    this.updateFlames();
  }

  get torque(): number {
    return this.torqueVal;
  }

  set torque(torque: number) {
    this.torqueVal = torque;
    this.updateFlames();
  }

  updateFlames() {
    if (this.isGoingForward() || this.isTurningLeft()) {
      this.flameRR.alpha = 1;
    } else {
      this.flameRR.alpha = 0;
    }
    if (this.isGoingForward() || this.isTurningRight()) {
      this.flameRL.alpha = 1;
    } else {
      this.flameRL.alpha = 0;
    }
    if (this.isGoingBackward() || this.isTurningLeft()) {
      this.flameFL.alpha = 1;
    } else {
      this.flameFL.alpha = 0;
    }
    if (this.isGoingBackward() || this.isTurningRight()) {
      this.flameFR.alpha = 1;
    } else {
      this.flameFR.alpha = 0;
    }
  }

  private isGoingBackward() {
    return this.thrust === -1;
  }

  private isGoingForward() {
    return this.thrust === 1;
  }

  private isTurningLeft() {
    return this.torque === -1;
  }
  
  private isTurningRight() {
    return this.torque === 1;
  }

  initPhysics(x: number, y: number): void {
    this.body = new Body({
      mass: Ship.MASS,
      position: [x, y]
    });
    this.hull = new Circle({ radius: Ship.RADIUS, });
    this.engineLeft = new Box({ height: Ship.RADIUS * 1.5, width: 9.5 });
    this.engineRight = new Box({ height: Ship.RADIUS * 1.5, width: 9.5 });
    this.body.addShape(this.hull)
    this.body.addShape(this.engineLeft, [-Ship.RADIUS + 3, 0])
    this.body.addShape(this.engineRight, [Ship.RADIUS - 3, 0])
  }

  initGraphics(): void {
    let x: number = this.body.interpolatedPosition[0];
    let y: number = this.body.interpolatedPosition[1];
    let g: Graphics = new Graphics();
    let fillColor: number = this.color.toNumber();
    let lineColor: number = this.color.darken(25).toNumber();
    let lineWidth: number = 2;
    g.beginFill(fillColor);
    g.lineStyle(lineWidth, lineColor);
    g.drawCircle(x, y, Ship.RADIUS - lineWidth / 2);
    g.beginFill(lineColor)
    let engineWidth = this.engineLeft.width - lineWidth;
    let engineHeight = this.engineLeft.height - lineWidth;
    g.drawRoundedRect(x - (engineWidth / 2) - Ship.RADIUS + 4, y - (engineHeight / 2), engineWidth, engineHeight, engineWidth / 2 - 0.00001);
    g.drawRoundedRect(x - (engineWidth / 2) + Ship.RADIUS - 4, y - (engineHeight / 2), engineWidth, engineHeight, engineWidth / 2 - 0.00001);
    lineWidth = 5;
    g.lineStyle(5, lineColor);
    g.endFill();
    g.arc(x, y, Ship.RADIUS - 7, 5 * Math.PI / 4 + 0.1, 7 * Math.PI / 4 - 0.1)

    let flameX = Ship.RADIUS - 4;
    let flameY = Ship.RADIUS + 3;
    this.flameFL = this.flame(-flameX, -flameY)
    this.flameFR = this.flame(flameX, -flameY)
    this.flameRL = this.flame(-flameX, flameY)
    this.flameRR = this.flame(flameX, flameY)
    g.addChild(this.flameFL);
    g.addChild(this.flameFR);
    g.addChild(this.flameRL);
    g.addChild(this.flameRR);

    this.graphics = g;
  }

  private flame(x: number, y: number): Graphics {
    let g: Graphics = new Graphics();
    g.beginFill(Ship.FLAME_COLOR.toNumber());
    g.drawEllipse(x, y, 3, 8);
    g.alpha = 0;
    return g;
  }

}