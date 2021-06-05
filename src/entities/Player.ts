import {events, isPressed, Sprite} from 'pixi-extended';
import {keys} from '../index';


export class Player extends Sprite {
	public speed = 10;

	public constructor() {
		super('player');

		this.position.xy = [window.innerWidth / 2, window.innerHeight - window.innerHeight / 5];
		console.log(this.position);

		console.log(events);
	}

	public update() {
		if (isPressed(keys.up)) this.y += -this.speed;
		if (isPressed(keys.down)) this.y += this.speed;
		if (isPressed(keys.left)) this.x += -this.speed;
		if (isPressed(keys.right)) this.x += this.speed;
	}
}
