import { Condition } from './initiative/condition';

export class Monster {
	initiative: number;

	constructor(public name: string,
		public hp: number,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public id: number = 1,
		public quantity: number = 1,
		public currentHp: number = hp,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notes: string[] = [],
		public conScore: number = 1) { }

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
}
