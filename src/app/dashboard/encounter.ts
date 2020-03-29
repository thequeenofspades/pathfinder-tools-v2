import { MonsterI } from './monster';

export class Encounter {
	constructor(
		public name: string,
		public monsters: MonsterI[] = [],
		public id: string = ''
	) {}
};

export function crForEncounter(encounter: Encounter): number {
	let runningXPTotal = 0;
	encounter.monsters.forEach(monster => {
		if (monster.extras.xp) {
			runningXPTotal += Number(monster.extras.xp);
		} else if (monster.extras.cr) {
			runningXPTotal += xpFromCr(monster.extras.cr);
		}
	});
	return crFromXp(runningXPTotal);
}

export function crFromXp(xp: number): number {
	if (xp < 400) {
		return xp >= 200 ? 0.5 : xp >= 135 ? 0.33 : xp >= 100 ? 0.25 : xp >= 65 ? 0.167 : xp >= 50 ? 0.125 : 0;
	}
	let cr = Math.log2(xp / 300) * 2;
	if (cr % 1 == 0) {
		return Math.floor(cr);
	}
	return Math.floor(Math.log2(xp / 400) * 2 + 1);
}

export function xpFromCr(cr: number): number {
	if (cr < 1) {
		if (cr == 0.5) {
			return 200;
		}
		if (cr < 0.5 && cr > 0.25) {
			return 135;
		}
		if (cr == 0.25) {
			return 100;
		}
		if (cr <0.25 && cr > 0.125) {
			return 65;
		}
		if (cr == 0.125) {
			return 50;
		}
		return 0;
	}
	if (cr % 2 == 0) {
		// Even CR calculation
		return 300 * Math.pow(2, Math.floor(cr / 2));
	} else {
		// Odd CR calculation
		return 400 * Math.pow(2, Math.floor(cr / 2));
	}
};
