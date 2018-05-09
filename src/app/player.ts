import { Condition } from './initiative/condition';

export class Player {
	initiative: number;
	constructor(public name: string,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notification: any = {},
		public notes: string[] = []) {	}

	public isDead(): boolean { return false; };

	public isDying(): boolean { return false; };

	public isDisabled(): boolean { return false; };

	public isBloodied(): boolean { return false; };

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