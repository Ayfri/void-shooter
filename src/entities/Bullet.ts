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
	public readonly target: BulletTarget;
	public speed: number;
	private readonly movementType: BulletMovementType;

	public constructor(options: BulletOptions) {
		super('bullet1');

		this.target = options.target;
		this.speed = options.initialSpeed;
		this.movementType = options.movementType;
		this.anchor.set(0.5, 0.5);
	}

	public get destroyed(): boolean {
		return this._destroyed;
	}

	public update() {
		if (this.destroyed) return;

		switch (this.movementType) {
			case BulletMovementType.BASIC:
				switch (this.target) {
					case 'enemy':
						this.position.y += -this.speed;
						break;

					case 'player':
						this.position.y += this.speed;
						break;
				}
		}
	}
}
