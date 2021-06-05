import {events, isPressed, Rectangle, Sprite, Vector2} from 'pixi-extended';
import {Game} from '../Game';
import {app, keys} from '../index';
import {isOnScreen} from '../utils';
import {Bullet, BulletMovementType} from './Bullet';


export class Player extends Sprite {
	public speed = 10;
	public velocity = Vector2.zero;
	public bullets: Bullet[] = [];

	public constructor() {
		super('player');

		this.anchor.set(0.5, 0.5);
		this.position.xy = [window.innerWidth / 2, window.innerHeight - window.innerHeight / 5];
	}

	public update() {
		if (isPressed(keys.up)) this.velocity.y = -this.speed;
		if (isPressed(keys.down)) this.velocity.y = this.speed;
		if (isPressed(keys.left)) this.velocity.x = -this.speed;
		if (isPressed(keys.right)) this.velocity.x = this.speed;
		if (isPressed(keys.space)) {
			const bullet: Bullet = new Bullet({
				initialSpeed: 20,
				movementType: BulletMovementType.BASIC,
				from: 'enemy',
			});
			bullet.position.copyFrom(this);
			bullet.addToApplication(app);

			this.bullets.push(bullet);
		}

		const position = new Vector2(...this.position.xy.slice() as [number, number]);
		position.add(this.velocity);
		if (position.x + this.width / 2 > window.innerWidth || position.x - this.width / 2 < 0) this.velocity.x = 0;
		if (position.y + this.height / 2 > window.innerHeight || position.y - this.height / 2 < 0) this.velocity.y = 0;

		this.position.add(this.velocity);
		this.velocity.reset();

		this.bullets.forEach((b) => {
			if (!isOnScreen(b)) {
				b.destroy();
				this.bullets.splice(this.bullets.indexOf(b), 1);
				return;
			}

			b.update();
		});
	}
}