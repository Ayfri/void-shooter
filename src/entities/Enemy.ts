import {Color, getColoredTexture, randomArray, randomInt, Vector2} from 'pixi-extended';
import {PowerUp, PowerUpType} from '../data/PowerUp';
import {game} from '../index';
import {isOnScreen} from '../utils';
import {BulletMovementType, BulletTarget} from './Bullet';
import {ShooterSprite} from './ShooterSprite';

export interface EnemyOptions {
	health: number;
	position: Vector2;
}

export class Enemy extends ShooterSprite {
	public health: number = 0;

	public constructor(options: EnemyOptions) {
		super(getColoredTexture(game.app, {
			color: Color.random(),
			height: 75,
			width: 50,
		}));
		this.anchor.set(0.5, 0.5);

		this.health = options.health;
		this.position.copyFrom(options.position);
		this.bulletCooldown = randomInt(150, 400);
	}

	public update() {
		if (this.destroyed) return;

		if (this.bulletCooldownTimer <= 0) {
			this.bulletCooldownTimer = this.bulletCooldown;
			this.shoot({
				initialSpeed: 9,
				movementType: BulletMovementType.BASIC,
				target: BulletTarget.PLAYER,
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
				game.player.hit();
				return;
			}
			b.update();
		});

		this.position.add(this.velocity);
		this.velocity.reset();
	}

	public hit(damage: number = 1) {
		this.health -= damage;

		if (this.health <= 0) {
			this.destroy();
			this.bullets.forEach(b => b.destroy());
			this.bullets = [];
			game.enemies.splice(game.enemies.indexOf(this), 1);

			if (Math.random() < 1 / 20) {
				game.player.powerUps.push(new PowerUp({
					value: 1,
					type: randomArray(Object.keys(PowerUpType).map(n => parseInt(n)).filter(n => !isNaN(n)))
				}))
			}
		}
	}
}
