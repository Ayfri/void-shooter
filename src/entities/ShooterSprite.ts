import {Sprite, Vector2} from 'pixi-extended';
import {Bullet} from './Bullet';

export abstract class ShooterSprite extends Sprite {
	public speed = 8;
	public velocity = Vector2.zero;
	public bullets: Bullet[] = [];
	public bulletCooldown = 10;
	protected bulletCooldownTimer = this.bulletCooldown;

	public abstract update(): void;
	public abstract shoot(): void;
}
