import {isPressed, randomArray} from 'pixi-extended';
import {PowerUp, PowerUpType, PowerUpValueType} from '../data/PowerUp';
import {game, keys} from '../index';
import {isOnScreen} from '../utils';
import {BulletMovementType, BulletTarget} from './Bullet';
import {ShooterSprite} from './ShooterSprite';

export class Player extends ShooterSprite {
	public bulletCountMax: number;
	public bulletDamageMax: number = 10;
	public bulletSpeedMax: number;
	public powerUps: PowerUp[] = [];
	public speedMax: number;
	private _bulletDamage: number;
	private _bulletCount: number;
	private _bulletSpeed: number;
	private _health: number;
	private _speed: number;

	public constructor() {
		super('player');

		this.bulletSpeedMax = 20;
		this.bulletCountMax = 10;
		this.speedMax = 8;
		this._bulletCount = 1;
		this._bulletSpeed = 8;
		this._bulletDamage = 1;
		this._speed = 8;
		this._health = 10;
		this.anchor.set(0.5);
		this.position.xy = [window.innerWidth / 2, window.innerHeight - window.innerHeight / 5];
	}

	public get bulletCount(): number {
		return this._bulletCount;
	}

	public set bulletCount(value: number) {
		this._bulletCount = value + this.getValueForPowerUp(PowerUpType.BULLET_COUNT) > this.bulletCountMax
		                    ? this.bulletCountMax
		                    : value;
	}

	public get bulletDamage(): number {
		return this._bulletDamage;
	}

	public set bulletDamage(value: number) {
		this._bulletDamage = value + this.getValueForPowerUp(PowerUpType.BULLET_DAMAGE) > this.bulletDamageMax
		                     ? this.bulletDamageMax
		                     : value;
	}

	public get bulletSpeed(): number {
		return this._bulletSpeed;
	}

	public set bulletSpeed(value: number) {
		this._bulletSpeed = value + this.getValueForPowerUp(PowerUpType.BULLET_SPEED) > this.bulletSpeedMax
		                    ? this.bulletSpeedMax
		                    : value;
	}

	public get fullBulletCount(): number {
		return this._bulletCount + this.getValueForPowerUp(PowerUpType.BULLET_COUNT);
	}

	public get fullBulletDamage(): number {
		return this._bulletDamage + this.getValueForPowerUp(PowerUpType.BULLET_DAMAGE);
	}

	public get fullBulletSpeed(): number {
		return this._bulletSpeed + this.getValueForPowerUp(PowerUpType.BULLET_SPEED);
	}

	public get fullHealth(): number {
		return this._health + this.getValueForPowerUp(PowerUpType.HEALTH);
	}

	public get fullSpeed(): number {
		return this._speed + this.getValueForPowerUp(PowerUpType.SPEED);
	}

	public get health(): number {
		return this._health;
	}

	public set health(value: number) {
		this._health = value + this.getValueForPowerUp(PowerUpType.HEALTH) >= 0 ? value : 0;
	}

	public get speed(): number {
		return this._speed;
	}

	public set speed(value: number) {
		this._speed = value + this.getValueForPowerUp(PowerUpType.SPEED) > this.speedMax ? this.speedMax : value;
	}

	public update() {
		if (this.destroyed) return;

		const speed = this.fullSpeed;
		if (isPressed(keys.up)) this.velocity.y = -speed;
		if (isPressed(keys.down)) this.velocity.y = speed;
		if (isPressed(keys.left)) this.velocity.x = -speed;
		if (isPressed(keys.right)) this.velocity.x = speed;

		if (isPressed(keys.space) && this.bulletCooldownTimer <= 0) {

			this.shoot({
				damage: this.fullBulletDamage,
				initialSpeed: this.fullBulletSpeed,
				movementType: BulletMovementType.BASIC,
				number: this.fullBulletCount,
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

	public addPowerUp(value: number, type: PowerUpType ) {
		if (type === PowerUpType.BULLET_COUNT && this.fullBulletCount === this.bulletCountMax) return;
		if (type === PowerUpType.BULLET_SPEED && this.fullBulletSpeed === this.bulletSpeedMax) return;
		if (type === PowerUpType.BULLET_DAMAGE && this.fullBulletDamage === this.bulletDamageMax) return;
		if (type === PowerUpType.SPEED && this.fullSpeed === this.speedMax) return;

		this.powerUps.push(new PowerUp({
			value,
			type,
		}));

		console.log(`powerUp : ${PowerUpType[type]}`);
	}

	public getValueForPowerUp(type: PowerUpType) {
		const powerUps = this.powerUps.filter(p => p.type === type);
		return powerUps.reduce((previous, current) => {
			return current.valueType === PowerUpValueType.ADD ? previous + current.value : previous * current.value;
		}, 0);
	}

	private checkMovement(): void {
		const position = this.position.deepClone();
		position.add(this.velocity);
		if (position.x + this.width / 2 > window.innerWidth || position.x - this.width / 2 < 0) this.velocity.x = 0;
		if (position.y + this.height / 2 > window.innerHeight || position.y - this.height / 2 < 0) this.velocity.y = 0;
	}
}
