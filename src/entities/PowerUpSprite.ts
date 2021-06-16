import {Sprite} from 'pixi-extended';
import {PowerUp, PowerUpType} from '../data/PowerUp';
import {game} from '../index';

export class PowerUpSprite extends Sprite {
	public constructor(public powerUp: PowerUp) {
		let texture;
		switch (powerUp.type) {
			case PowerUpType.BULLET_COUNT:
				texture = 'bullet_add_powerup';
				break;
			case PowerUpType.BULLET_SPEED:
				texture = 'bullet_speed_powerup';
				break;
			case PowerUpType.BULLET_DAMAGE:
				texture = 'attack_powerup';
				break;
			case PowerUpType.HEALTH:
				texture = 'health_powerup';
				break;
			case PowerUpType.SPEED:
				texture = 'speed_powerup';
				break;

		}

		super(texture);
		this.anchor.set(0.5);

		this.addToApplication(game.app);
	}

	public update() {
		if (this.destroyed) return;
		this.y++;

		if (this.hitBox.collidesWith(game.player.hitBox)) {
			game.player.addPowerUp(this.powerUp.value, this.powerUp.type);
			game.powerUps.slice(game.powerUps.indexOf(this), 1);
			this.destroy();
		}
	}
}
