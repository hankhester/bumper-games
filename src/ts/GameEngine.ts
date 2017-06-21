import {World, Material, ContactMaterial, Body, vec2} from 'p2';
import {Graphics, DisplayObject, Container, WebGLRenderer, Application, CanvasRenderer} from 'pixi.js';
import {Piece} from './Piece';
import Ship from './Ship';
import Wall from './Wall';
import Puck from './Puck';
import Octogon from './Octogon';
import Color from './Color';
import * as tinycolor from 'tinycolor2';

export default class GameEngine {
  world: World;
  app: Application;
  pieces: Piece[];
  onTick: Function;
  lastTimestep: number;

  static WIDTH: 600;
  static HEIGHT: 600;
  static BACKGROUND_COLOR: Color = new Color('#222222');

  constructor() {
    this.app = new Application(600, 600, {
      backgroundColor: GameEngine.BACKGROUND_COLOR.toNumber(),
      antialias: true
    });
    document.body.style.backgroundColor = GameEngine.BACKGROUND_COLOR.toString();
    this.world = new World({ gravity: [0, 0] });
    this.pieces = [];

    this.world.defaultContactMaterial.restitution = 0.7;
    this.lastTimestep = 0;
    const timeStep = 1 / 60;
    const maxSubSteps = 10;

    this.app.ticker.add((delta: number) => {
      this.pieces.forEach((piece: Piece) => {
        if (piece instanceof Ship) {
          let ship: Ship = piece as Ship;
          if (ship.thrust !== 0) {
            let force: number[] = [0, -Ship.THRUST_FORCE];
            if (ship.thrust === -1) force[1] *= -1;
            vec2.rotate(force, force, ship.body.angle);
            ship.body.applyForce(force);
          }
          if (ship.torque !== 0) {
            if (ship.torque === 1) {
              ship.body.angularVelocity += Ship.TORQUE_FORCE;
            } else {
              ship.body.angularVelocity -= Ship.TORQUE_FORCE;
            }
          }
        }
      });
      this.world.step(timeStep, this.app.ticker.elapsedMS, maxSubSteps);
      if (this.onTick) this.onTick(this.app.ticker.elapsedMS);
      this.pieces.forEach((piece: Piece) => GameEngine.updateGraphics(piece));
    });
  }

  set onCollision(func: Function) {
    this.world.on('impact', func, null);
  }

  addPiece(piece: Piece | Octogon): void {
    if (piece instanceof Octogon) {
      piece.walls.forEach((wall: Wall) => this.addPiece(wall));
    } else {
      this.pieces.push(piece);
      this.world.addBody(piece.body);
      this.addDisplayObject(piece.graphics);      
    }
  }

  addDisplayObject(object: DisplayObject) {
    this.app.stage.addChild(object);
  }

  stop() {
    this.app.ticker.stop()
  }

  static updateGraphics(piece: Piece) {
    piece.graphics.x = piece.body.position[0];
    piece.graphics.y = piece.body.position[1];
    piece.graphics.rotation = piece.body.angle;
  }

}
