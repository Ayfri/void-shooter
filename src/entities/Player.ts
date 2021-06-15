import {isPressed} from 'pixi-extended';
import {PowerUp, PowerUpType, PowerUpValueType} from '../data/PowerUp';
import {game, keys} from '../index';
import {isOnScreen} from '../utils';
import {BulletMovementType, BulletTarget} from './Bullet';
import {ShooterSprite} from './ShooterSprite';


export class Player extends ShooterSprite {
	public powerUps: PowerUp[] = [];

	public constructor() {
		super('player');

		this._health = 10;
		this.anchor.set(0.5, 0.5);
		this.position.xy = [window.innerWidth / 2, window.innerHeight - window.innerHeight / 5];
	}

	private _health: number;

	public get health(): number {
		return this._health + this.getValueForPowerUp(PowerUpType.HEALTH);
	}

	public set health(value: number) {
		const health: number = value + this.getValueForPowerUp(PowerUpType.HEALTH);
		this._health = health >= 0 ? health : 0;
	}

	public getValueForPowerUp(type: PowerUpType) {
		const powerUps = this.powerUps.filter(p => p.type === type);
		return powerUps.reduce((previous, current) => {
			return current.valueType === PowerUpValueType.ADD ? previous + current.value : previous * current.value;
		}, 0);
	}

	public update() {
		if (this.destroyed) return;

		const speed: number = this.speed + this.getValueForPowerUp(PowerUpType.SPEED);
		if (isPressed(keys.up)) this.velocity.y = -speed;
		if (isPressed(keys.down)) this.velocity.y = speed;
		if (isPressed(keys.left)) this.velocity.x = -speed;
		if (isPressed(keys.right)) this.velocity.x = speed;

		if (isPressed(keys.space) && this.bulletCooldownTimer <= 0) {

			this.shoot({
				damage: 1 + this.getValueForPowerUp(PowerUpType.BULLET_DAMAGE),
				initialSpeed: 12 + this.getValueForPowerUp(PowerUpType.BULLET_SPEED),
				movementType: BulletMovementType.BASIC,
				number: 1 + this.getValueForPowerUp(PowerUpType.BULLET_NUMBER),
				target: BulletTarget.ENEMY,
			});
			this.bulletCooldownTimer = this.bulletCooldown;
		}
		this.bulletCooldownTimer--;

		this.checkMovement();

		this.position.add(this.velocity);
		this.velocity.reset();

		this.bullets.forEach((b) => {
			if (!isOnScreen(b)) {
				this.removeBullet(b);
				return;
			}

			const hitBox = b.hitBox;

			game.enemies.forEach(e => {
				if (b.destroyed || e.destroyed) return;
				if (hitBox.collidesWith(e.hitBox)) {
					this.removeBullet(b);
					e.hit(b.damage);
				}
			});

			b.update();
		});
	}

	public hit() {
		this.health--;
		console.log('player hit');
	}

	private checkMovement(): void {
		const position = this.position.deepClone();
		position.add(this.velocity);
		if (position.x + this.width / 2 > window.innerWidth || position.x - this.width / 2 < 0) this.velocity.x = 0;
		if (position.y + this.height / 2 > window.innerHeight || position.y - this.height / 2 < 0) this.velocity.y = 0;
	}
}
