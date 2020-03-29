export class Player {
	constructor(public name: string,
		public initiativeBonus: number = 0,
		public perceptionBonus: number = 0,
		public senseMotiveBonus: number = 0,
		public notification: any = {},
		public id: string = '') {	}
}