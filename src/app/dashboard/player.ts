import { Condition } from './condition';

export class Player {
	constructor(public name: string,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notification: any = {},
		public notes: string[] = [],
		public id: string = '') {	}
}