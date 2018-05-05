import { Condition } from './initiative/condition';

export class Player {
	initiative: number;
	constructor(public name: string,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notification: string = '',
		public notes: string[] = []) {	}
}