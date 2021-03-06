import * as PIXI_Extended from 'pixi-extended';
import {loadTextures, PIXI} from 'pixi-extended';
import {Game} from './Game';

export const app = new PIXI.Application({
	antialias: true,
	resizeTo: window,
	resolution: window.devicePixelRatio,
});

export let game: Game;

const locale = navigator.languages[0] ?? navigator.language;
export const keys = {
	up: locale.includes('fr') ? 'z' : 'w',
	down: 's',
	left: locale.includes('fr') ? 'q' : 'a',
	right: 'd',
	space: ' ',
	spawnEnemy: 'k',
};

async function setup() {
	await loadTextures({
		player: './assets/sprites/player.png',
		bullet1: './assets/sprites/bullet1.png',
		bullet2: './assets/sprites/bullet2.png',
		attack_powerup: './assets/sprites/attack_powerup.png',
		bullet_add_powerup: './assets/sprites/bullet_add_powerup.png',
		bullet_speed_powerup: './assets/sprites/bullet_speed_powerup.png',
		health_powerup: './assets/sprites/health_powerup.png',
		speed_powerup: './assets/sprites/speed_powerup.png',
	});

	game = new Game(app);
	window.app = app;
	window.game = game;
	window.PIXI = PIXI;
	window.PIXI_Extended = PIXI_Extended;

	document.body.appendChild(app.view);
}

setup().then(() => {
	PIXI.Ticker.shared.add(() => game.emit('update'), undefined, PIXI.UPDATE_PRIORITY.LOW);
	console.log('Game launched !');
});
