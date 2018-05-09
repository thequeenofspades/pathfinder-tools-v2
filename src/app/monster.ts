import { Condition } from './initiative/condition';

export class Monster {
	initiative: number;

	constructor(public name: string,
		public hp: number,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public id: number = 1,
		public quantity: number = 1,
		public currentHp: number = hp,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notes: string[] = [],
		public conScore: number = 10,
		public notification: any = {}) { }

	public isDead(damage: number = 0): boolean {
		return this.currentHp - damage <= -1 * this.conScore;
	}

	public isDying(damage: number = 0): boolean {
		return this.currentHp - damage < 0 && this.currentHp - damage > -1 * this.conScore;
	}

	public isDisabled(damage: number = 0): boolean {
		return this.currentHp - damage == 0;
	}

	public isBloodied(damage: number = 0): boolean {
		return this.currentHp - damage <= this.hp / 2;
	}

	public removeConditions(conditions: string[]): void {
		this.conditions = this.conditions.filter(c => !conditions.find(name => name == c.name));
		this.attributes = this.attributes.filter(a => !conditions.find(name => name == a));
	}

	public rollPerception(): void {
		let roll = getRandomInt(1, 20);
  		this.notification.perception = `${roll+this.perceptionBonus}`;
	}

	public rollSenseMotive(): void {
		let roll = getRandomInt(1, 20);
  		this.notification.senseMotive = `${roll+this.senseMotiveBonus}`;
	}
}

// Returns a random integer between min (included) and max (included)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}