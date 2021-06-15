import {Color, EventEmitter, FPSCounter, isPressed, PIXI, randomFloat, randomInt, Text, Vector2} from 'pixi-extended';
import {PowerUpType} from './data/PowerUp';
import {Enemy} from './entities/Enemy';
import {Player} from './entities/Player';
import {keys} from './index';

export type GameEvents = {
	init: [];
	update: [];
}

export class Game extends EventEmitter<GameEvents> {
	public player: Player;
	public enemies: Enemy[] = [];
	public debug: Text;

	public constructor(public readonly app: PIXI.Application) {
		super();
		this.player = new Player();
		const fpsCounter = new FPSCounter();
		fpsCounter.position.set(window.innerWidth / 20, window.innerHeight / 10);
		fpsCounter.color = Color.WHITE;
		fpsCounter.addToApplication(app);
		fpsCounter.zIndex = 10000;

		this.debug = new Text({
			text: ''
		});
		this.debug.color = Color.WHITE;
		this.debug.position.set(window.innerWidth / 20, window.innerHeight / 10 + 50)
		this.debug.addToApplication(app);
		this.debug.zIndex = 10000;

		this.on('update', this.update);
		this.on('init', this.init);

		this.emit('init');
	}

	public init() {
		this.player.addToApplication(this.app);
	}

	public update() {
		this.player.update();
		this.app.stage.sortChildren();
		this.debug.text =
			`
${this.app.stage.children.length.toString()}
Health : ${this.player.health}
Speed : ${this.player.speed + this.player.getValueForPowerUp(PowerUpType.SPEED)}
Bullet damage : ${this.player.bulletDamage}
Bullet count : ${1 + this.player.getValueForPowerUp(PowerUpType.BULLET_NUMBER)}
Bullet speed : ${8 + this.player.getValueForPowerUp(PowerUpType.BULLET_SPEED)}
`;
		this.enemies.forEach(e => e.update());

		if (isPressed(keys.spawnEnemy)) {
			const enemy = new Enemy({
				health: randomInt(5, 12),
				position: new Vector2(randomInt(0, window.innerWidth), randomFloat(10, window.innerWidth / 5)),
			});

			this.enemies.push(enemy);
			enemy.addToApplication(this.app);
		}
	}
}
