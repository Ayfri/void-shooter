import {Sprite, Vector2} from 'pixi-extended';
import {app} from '../index';
import {Bullet, BulletOptions} from './Bullet';

export interface ShootOptions extends BulletOptions {
	number?: number;
}

export abstract class ShooterSprite extends Sprite {
	public abstract speed: number;
	public velocity = Vector2.zero;
	public bullets: Bullet[] = [];
	public bulletCooldown = 10;
	protected bulletCooldownTimer = this.bulletCooldown;

	public abstract update(): void;
	public abstract hit(): void;

	public shoot(options: ShootOptions) {
		const count = options.number ?? 1;
		for (let i = 0; i < count; i++) {
			const bullet = new Bullet(options);
			const width = bullet.width + 2;
			bullet.position.copyFrom(this);
			bullet.position.x += i * width;
			bullet.position.x -= ((count - 1) * width) / 2;
			
			bullet.addToApplication(app);

			this.bullets.push(bullet);
		}
	};

	public removeBullet(bullet: Bullet) {
		bullet.destroy();
		this.bullets.splice(this.bullets.indexOf(bullet), 1);
	}
}
