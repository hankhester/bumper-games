import {WebGLRenderer, CanvasRenderer, Point, Text, Container, Application} from 'pixi.js';
import {World, Body, EventEmitter} from 'p2';
import GameEngine from './GameEngine';
import Ship from './Ship';
import Puck from './Puck';
import Wall from './Wall';
import Color from './Color';
import Octogon from './Octogon';

export default class Game {
  gameEngine: GameEngine
  home: Ship;
  away: Ship;
  homeTimeMS: number;
  awayTimeMS: number;
  homeScore: Text;
  awayScore: Text;
  possession: Ship;
  puck: Puck;

  static MAX_SECONDS: number = 30;

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    this.home = new Ship(425, 300, Ship.HOME_COLOR);
    this.away = new Ship(165, 300, Ship.AWAY_COLOR);
    this.puck = new Puck(300, 300, new Color('white'));

    this.gameEngine.addPiece(new Octogon(300, 300, new Color('#999999')));
    this.gameEngine.addPiece(this.home);
    this.gameEngine.addPiece(this.away);
    this.gameEngine.addPiece(this.puck);

    this.homeScore = new Text('0.0', {
      fontFamily: ['Avenir', 'Helvetica', 'sans-serif'],
      fontSize: 40,
      fill: this.home.color.toNumber()
    })
    this.awayScore = new Text('0.0', {
      fontFamily: ['Avenir', 'Helvetica', 'sans-serif'],
      fontSize: 40,
      fill: this.away.color.toNumber()
    })
    this.homeScore.position = new Point(510, 30)
    this.awayScore.position = new Point(30, 30)
    this.gameEngine.addDisplayObject(this.homeScore);
    this.gameEngine.addDisplayObject(this.awayScore);

    this.homeTimeMS = 0;
    this.awayTimeMS = 0;

    this.gameEngine.onTick = this.handleTick.bind(this);
    this.gameEngine.onCollision = this.handleCollision.bind(this);

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  handleCollision(event) {
    let a: Body = event.bodyA;
    let b: Body = event.bodyB;
    let home: Body = this.home.body;
    let away: Body = this.away.body;
    let puck: Body = this.puck.body;
    if (a === puck) {
      if (b === home) {
        this.possession = this.home;
        this.puck.color = this.possession.color;
      } else if (b === away) {
        this.possession = this.away;
        this.puck.color = this.possession.color;
      }
    } else if (b === puck) {
      if (a === home) {
        this.possession = this.home;
        this.puck.color = this.possession.color;
      } else if (a === away) {
        this.possession = this.away;
        this.puck.color = this.possession.color;
      }
    }
  }

  handleTick(tickTime: number) {
    if (this.possession === this.home) {
      this.homeTime += tickTime;
    } else if (this.possession === this.away) {
      this.awayTime += tickTime;
    }

    let maxMS = Game.MAX_SECONDS * 1000;
    if (this.awayTime >= maxMS || this.homeTime >= maxMS) {
      let message: Text;
      if (this.possession === this.home) {
        message = new Text('Game Over\nRight team wins!', {
          align: 'center',
          fontFamily: ['Avenir', 'Helvetica', 'sans-serif'],
          fontSize: 40,
          fill: this.home.color.toNumber(),
          stroke: 'black',
          strokeThickness: 3
        })
      } else if (this.possession === this.away) {
        message = new Text('Game Over\nLeft team wins!', {
          align: 'center',
          fontFamily: ['Avenir', 'Helvetica', 'sans-serif'],
          fontSize: 40,
          fill: this.away.color.toNumber(),
          stroke: 'black',
          strokeThickness: 3
        })
      }
      message.position = new Point(300 - message.width / 2, 300 - message.height / 2);
      this.gameEngine.addDisplayObject(message);
      this.gameEngine.stop();
    }
  }

  set homeTime(time: number) {
    this.homeTimeMS = time;
    this.homeScore.text = this.formatTime(time);
  }

  set awayTime(time: number) {
    this.awayTimeMS = time;
    this.awayScore.text = this.formatTime(time);
  }

  get homeTime(): number {
    return this.homeTimeMS;
  }

  get awayTime(): number {
    return this.awayTimeMS;
  }

  formatTime(num: number): string {
    num = Math.round(num / 100) / 10; // convert ms to s and round to one decimal place
    let s: string = num.toString();
    if (s.indexOf('.') === -1) return s + '.0';
    return s;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
    if (event.key === 'ArrowUp') {
      this.home.thrust = 1;
    } else if (event.key === 'w') {
      this.away.thrust = 1;
    } else if (event.key === 's') {
      this.away.thrust = -1;
    } else if (event.key === 'ArrowDown') {
      this.home.thrust = -1;
    } else if (event.key === 'ArrowLeft') {
      this.home.torque = -1;
    } else if (event.key === 'a') {
      this.away.torque = -1;
    } else if (event.key === 'd') {
      this.away.torque = 1;
    } else if (event.key === 'ArrowRight') {
      this.home.torque = 1;
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.home.thrust = 0;
    } else if (event.key === 'w') {
      this.away.thrust = 0;
    } else if (event.key === 's') {
      this.away.thrust = 0;
    } else if (event.key === 'ArrowDown') {
      this.home.thrust = 0;
    } else if (event.key === 'ArrowLeft') {
      this.home.torque = 0;
    } else if (event.key === 'a') {
      this.away.torque = 0;
    } else if (event.key === 'd') {
      this.away.torque = 0;
    } else if (event.key === 'ArrowRight') {
      this.home.torque = 0;
    }
  }
}