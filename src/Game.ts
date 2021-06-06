import {EventEmitter, isPressed, PIXI, randomInt, Vector2} from 'pixi-extended';
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

	public constructor(public readonly app: PIXI.Application) {
		super();
		this.player = new Player();
		this.on('update', this.update);
		this.on('init', this.init);

		this.emit('init');
	}

	public init() {
		this.player.addToApplication(this.app);
	}

	public update() {
		this.player.update();
		this.enemies.forEach((e) => e.update());

		if (isPressed(keys.spawnEnemy)) {
			const enemy = new Enemy({
				health: randomInt(5, 12),
				position: new Vector2(randomInt(0, window.innerWidth), window.innerHeight / 8),
			});

			this.enemies.push(enemy);
			enemy.addToApplication(this.app);
		}
	}
}
