import {Body, Material} from 'p2';
import {Graphics} from 'pixi.js';
import Color from './Color';

export interface Piece {
  body: Body;
  graphics: Graphics;
  color: Color;
  initPhysics(x: number, y: number, angle?: number): void
  initGraphics(): void
}