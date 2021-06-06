import {isPressed, Vector2} from 'pixi-extended';
import {keys} from '../index';
import {isOnScreen} from '../utils';
import {BulletMovementType} from './Bullet';
import {ShooterSprite} from './ShooterSprite';


export class Player extends ShooterSprite {
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
		if (isPressed(keys.space) && this.bulletCooldownTimer <= 0) {
			this.shoot({
				target: 'enemy',
				movementType: BulletMovementType.BASIC,
				initialSpeed: 12
			});
			this.bulletCooldownTimer = this.bulletCooldown;
		}
		this.bulletCooldownTimer--;

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
