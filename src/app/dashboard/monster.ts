import { Condition } from './condition';

export class Monster {
	constructor(public name: string,
		public hp: number,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public idx: number = 1,
		public id: string = '',
		public quantity: number = 1,
		public currentHp: number = hp,
		public conditions: Condition[] = [],
		public attributes: string[] = [],
		public notes: string[] = [],
		public conScore: number = 10,
		public notification: any = {},
		) { }
}