import {Sprite} from 'pixi-extended';

export enum BulletMovementType {
	BASIC,
	SEARCH,
	RANDOM
}

export enum BulletTarget {
	PLAYER,
	ENEMY
}

export interface BulletOptions {
	damage?: number;
	initialSpeed: number;
	movementType: BulletMovementType;
	target: BulletTarget;
	sprite?: string;
}

export class Bullet extends Sprite {
	public readonly target: BulletTarget;
	public damage: number;
	public speed: number;
	private readonly movementType: BulletMovementType;

	public constructor(options: BulletOptions) {
		super(options.sprite ?? 'bullet1');

		this.movementType = options.movementType;
		this.damage = options.damage ?? 1;
		this.speed = options.initialSpeed;
		this.target = options.target;
		this.anchor.set(0.5, 0.5);
	}

	public update() {
		if (this.destroyed) return;

		switch (this.movementType) {
			case BulletMovementType.BASIC:
				switch (this.target) {
					case BulletTarget.ENEMY:
						this.position.y += -this.speed;
						break;

					case BulletTarget.PLAYER:
						this.position.y += this.speed;
						break;
				}
		}
	}
}
