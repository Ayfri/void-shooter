import {EventEmitter, PIXI} from 'pixi-extended';
import {Player} from './entities/Player';

export type GameEvents = {
	init: [];
	update: [];
}

export class Game extends EventEmitter<GameEvents> {
	public player: Player;

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
	}
}
