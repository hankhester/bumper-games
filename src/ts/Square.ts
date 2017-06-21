import {Body, Box} from 'p2';

export class Square {
  body: Body

  private static MASS: number = 1

  constructor(x: number, y: number) {
    this.initBody(x, y);
  }

  initBody(x: number, y: number) {
    let body: Body = new Body({
      mass: Square.MASS,
      position: [x, y]
    });
    body.addShape(new Box({
      width: 2,
      height: 1
    }));
    this.body = body;
  }
}