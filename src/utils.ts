import {Rectangle, Sprite} from 'pixi-extended';

export function isOnScreen(sprite: Sprite) {
	return new Rectangle(0, 0, window.innerWidth, window.innerHeight).contains(sprite.x, sprite.y);
}
