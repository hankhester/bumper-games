import {Graphics, Container, Circle as GCircle, Rectangle} from 'pixi.js';
import {Circle as Circle, Box, World, Shape, Body} from 'p2';

export class Renderer {

  readonly world: World;
  readonly stage: Container;
  
  constructor(world: World, stage: Container) {
    this.world = world;
    this.stage = stage;
    this.world.on('addBody', (event) => {
      let body: Body = event.body;
      body.shapes.forEach((shape: Shape) => {
        console.log(shape)
        if (shape instanceof Circle) this.drawCircle(shape);
      })
    }, null);
  }

  drawCircle(circle: Circle): void {
    console.log('drawing circle')
  }
}