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
		public notes: string[] = []) { }
}
