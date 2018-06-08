import { MonsterI } from './monster';

export class Encounter {
	constructor(
		public name: string,
		public monsters: MonsterI[] = [],
		public id: string = ''
	) {}
}
