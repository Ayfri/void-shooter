import {PIXI, loadTexture, loadedTexturesNames, loadTextures} from 'pixi-extended';
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
	spawnEnemy: 'k'
};

async function setup() {
	await loadTextures({
		player: './assets/sprites/player.png',
		bullet1: './assets/sprites/bullet1.png',
	});

	game = new Game(app);

	document.body.appendChild(app.view);
}

setup().then(() => {
	console.log('Game launched !');
	PIXI.Ticker.shared.add(() => game.emit('update'), undefined, PIXI.UPDATE_PRIORITY.LOW);
});
