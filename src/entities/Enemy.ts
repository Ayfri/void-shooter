import {Color, getColoredTexture, Vector2} from 'pixi-extended';
import {game} from '../index';
import {BulletMovementType} from './Bullet';
import {ShooterSprite} from './ShooterSprite';

export interface EnemyOptions {
	health: number;
	position: Vector2;
}

export class Enemy extends ShooterSprite {
	public health: number = 0;

	public constructor(options: EnemyOptions) {
		super(getColoredTexture({
			color: Color.random(),
			height: 500,
			width: 200,
		}));
		this.anchor.set(0.5, 0.5);

		this.health = options.health;
		this.position.copyFrom(options.position);
		this.bulletCooldown = 100;
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
				initialSpeed: 10,
				movementType: BulletMovementType.BASIC,
				target: 'player',
			});
		}

		this.bulletCooldownTimer--;

		this.bullets.forEach((b) => {
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
