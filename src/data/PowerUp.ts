export enum PowerUpType {
	BULLET_COUNT,
	BULLET_SPEED,
	BULLET_DAMAGE,
	HEALTH,
	SPEED
}

export enum PowerUpValueType {
	ADD,
	MULTIPLY
}

export interface PowerUpBuilder {
	type: PowerUpType;
	value: number;
	valueType?: PowerUpValueType;
}

export class PowerUp {
	public readonly type: PowerUpType;
	public readonly value: number;
	public readonly valueType: PowerUpValueType;

	public constructor(options: PowerUpBuilder) {
		this.type = options.type;
		this.value = options.value;
		this.valueType = options.valueType ?? PowerUpValueType.ADD;
	}
}
