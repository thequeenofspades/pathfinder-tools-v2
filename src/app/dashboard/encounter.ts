import { Monster } from './monster';

export class Encounter {
	constructor(
		public name: string,
		public monsters: Monster[] = [],
		public id: string = ''
	) {}
}
