import * as PIXI_Extended from 'pixi-extended';
import {Game} from './Game';

declare global {
	interface Window {
		app: PIXI_Extended.PIXI.Application;
		game: Game;
		PIXI: typeof PIXI_Extended.PIXI;
		PIXI_Extended: typeof PIXI_Extended;
	}
}
