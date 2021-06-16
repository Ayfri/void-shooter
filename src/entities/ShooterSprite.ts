import {Color, Sprite, Vector2} from 'pixi-extended';
import {app} from '../index';
import {Bullet, BulletOptions} from './Bullet';

export interface ShootOptions extends BulletOptions {
	number?: number;
	size?: number;
}

export abstract class ShooterSprite extends Sprite {
	public bulletCooldown = 10;
	public bullets: Bullet[] = [];
	public abstract speed: number;
	public velocity = Vector2.zero;
	protected bulletCooldownTimer = this.bulletCooldown;

	public abstract hit(): void;

	public removeBullet(bullet: Bullet) {
		bullet.destroy();
		this.bullets.splice(this.bullets.indexOf(bullet), 1);
	}

	public shoot(options: ShootOptions) {
		const count = options.number ?? 1;
		for (let i = 0; i < count; i++) {
			const bullet = new Bullet(options);
			const width = bullet.width + 2;
			bullet.position.copyFrom(this);
			bullet.position.x += i * width;
			bullet.position.x -= ((count - 1) * width) / 2;
			bullet.scale.set(options.size ?? 1, options.size ?? 1);

			bullet.addToApplication(app);

			this.bullets.push(bullet);
		}
	};

	public abstract update(): void;
}
