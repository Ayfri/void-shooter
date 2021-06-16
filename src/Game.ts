import {Color, EventEmitter, FPSCounter, isPressed, PIXI, randomFloat, randomInt, Text, Vector2} from 'pixi-extended';
import {PowerUpType} from './data/PowerUp';
import {Enemy} from './entities/Enemy';
import {Player} from './entities/Player';
import {PowerUpSprite} from './entities/PowerUpSprite';
import {keys} from './index';

export type GameEvents = {
	init: [];
	update: [];
}

export class Game extends EventEmitter<GameEvents> {
	public player: Player;
	public enemies: Enemy[] = [];
	public debug: Text;
	public powerUps: PowerUpSprite[] = [];

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
		this.powerUps.forEach(p => p.update());
		this.app.stage.sortChildren();
		this.debug.text =
			`
${this.app.stage.children.length.toString()}
Health : ${this.player.fullHealth}
Speed : ${this.player.fullSpeed}
Bullet damage : ${this.player.fullBulletDamage}
Bullet count : ${this.player.fullBulletCount}
Bullet speed : ${this.player.fullBulletSpeed}

Max Enemy Health : ${Math.max(...this.enemies.map(e => e.health), 0)}
`;
		this.enemies.forEach(e => e.update());

		if (isPressed(keys.spawnEnemy)) {
			const enemy = new Enemy({
				health: randomInt(-10, 10) + this.player.fullBulletDamage * 3 + this.player.fullBulletCount * 5 + this.player.fullHealth,
				position: new Vector2(randomInt(0, window.innerWidth), randomFloat(10, window.innerWidth / 5)),
			});

			this.enemies.push(enemy);
			enemy.addToApplication(this.app);
		}
	}
}
