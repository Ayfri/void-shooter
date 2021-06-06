import {Sprite} from 'pixi-extended';

export enum BulletMovementType {
	BASIC,
	SEARCH,
	RANDOM
}

type BulletTarget = 'player' | 'enemy';

export interface BulletOptions {
	movementType: BulletMovementType,
	target: BulletTarget,
	initialSpeed: number
}

export class Bullet extends Sprite {
	private readonly movementType: BulletMovementType;
	public readonly target: BulletTarget;
	public speed: number;

	public constructor(options: BulletOptions) {
		super('bullet1');
		this.target = options.target;
		this.speed = options.initialSpeed;
		this.movementType = options.movementType;
		this.anchor.set(0.5, 0.5);
	}

	public update() {
		switch (this.movementType) {
			case BulletMovementType.BASIC:
				this.position.y += -this.speed;
		}
	}
}
