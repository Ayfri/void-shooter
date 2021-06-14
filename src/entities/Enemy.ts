import {Color, getColoredTexture, randomInt, Vector2} from 'pixi-extended';
import {game} from '../index';
import {isOnScreen} from '../utils';
import {BulletMovementType} from './Bullet';
import {ShooterSprite} from './ShooterSprite';

export interface EnemyOptions {
	health: number;
	position: Vector2;
}

export class Enemy extends ShooterSprite {
	public health: number = 0;

	public constructor(options: EnemyOptions) {
		super(getColoredTexture(game.app, {
			color: new Color(Math.random() * 256, Math.random() * 256, Math.random() * 256),
			height: 75,
			width: 50,
		}));
		this.anchor.set(0.5, 0.5);

		this.health = options.health;
		this.position.copyFrom(options.position);
		this.bulletCooldown = randomInt(150, 400);
	}

	public hit() {
		this.health--;

		if (this.health <= 0) {
			this.destroy();
			this.bullets.forEach(b => b.destroy());
			this.bullets = [];
			game.enemies.splice(game.enemies.indexOf(this), 1);
		}
	}

	public update() {
		if (this.destroyed) return;

		if (this.bulletCooldownTimer <= 0) {
			this.bulletCooldownTimer = this.bulletCooldown;
			this.shoot({
				initialSpeed: 9,
				movementType: BulletMovementType.BASIC,
				target: 'player',
			});
		}

		this.bulletCooldownTimer--;

		this.bullets.forEach((b) => {
			if (!isOnScreen(b)) {
				this.removeBullet(b);
				return;
			}

			if (b.hitBox.collidesWith(game.player.hitBox)) {
				this.removeBullet(b);
				console.log('player hit');
				return;
			}
			b.update();
		});

		this.position.add(this.velocity);
		this.velocity.reset();
	}
}
