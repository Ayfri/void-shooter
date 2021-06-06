import {Sprite, Vector2} from 'pixi-extended';
import {app} from '../index';
import {Bullet, BulletOptions} from './Bullet';

export abstract class ShooterSprite extends Sprite {
	public speed = 8;
	public velocity = Vector2.zero;
	public bullets: Bullet[] = [];
	public bulletCooldown = 10;
	protected bulletCooldownTimer = this.bulletCooldown;

	public get destroyed(): boolean {
		return this._destroyed;
	}

	public abstract update(): void;

	public shoot(options: BulletOptions) {
		const bullet: Bullet = new Bullet(options);
		bullet.position.copyFrom(this);
		bullet.addToApplication(app);

		this.bullets.push(bullet);
	};

	public removeBullet(bullet: Bullet) {
		bullet.destroy();
		this.bullets.splice(this.bullets.indexOf(bullet), 1);
	}
}
