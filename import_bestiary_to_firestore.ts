const admin = require("./node_modules/firebase-admin");

const serviceAccount = require("../firebase_service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pf-tools.firebaseio.com"
});

const data = require('./bestiary.json')

// data.forEach(monster => {
// 	admin.firestore()
// 		.collection('monsters')
// 		.add(monster).then((res) => {
// 			console.log(`Added ${monster['Name']} to db`);
// 		})
// 		.catch((error) => {
// 			console.error(`Error adding ${monster['Name']}`);
// 		});
// });

const classMatcher = /([A-Za-z]+(?:\s*[(][A-Za-z ]+[)])?)\s*([0-9]{1,2})/gi;
const sensesMatcher = /(?:([^;]+);\s)?Perception [+]?([-]?[0-9]+)/i;
const abilityScoreMatcher = /Str\s+([0-9]+),\s+Dex\s+([0-9]+),\s+Con\s+([0-9]+),\s+Int\s+([0-9]+),\s+Wis\s+([0-9]+),\s+Cha ([0-9]+)/i;
const acMatcher = /([0-9]+), touch ([0-9]+), flat-footed ([0-9]+)/i;
const specialAbilityMatcher = /((?:[-A-za-z]+ )+)\((Su|Ex|Sp)\)/gi;

function getClasses(cl) {
	let classes = [];
	while (true) {
		let nextClass = classMatcher.exec(cl);
		if (nextClass == null) return classes;
		classes.push({class: nextClass[1], level: parseInt(nextClass[2])});
	}
	return classes;
}

function getSenses(s) {
	let matchGroups = sensesMatcher.exec(s);
	return matchGroups[1] || '';
}

function getPerception(s) {
	let matchGroups = sensesMatcher.exec(s);
	return parseInt(matchGroups[2]);
}

function getAbilityScores(a) {
	a = /-/g[Symbol.replace](a, '0');
	let matchGroups = abilityScoreMatcher.exec(a);
	if (!matchGroups) return [0, 0, 0, 0, 0, 0];
	return matchGroups.slice(1).map(x => parseInt(x));
}

function getAc(a) {
	let matchGroups = acMatcher.exec(a);
	if (!matchGroups) return ['', '', ''];
	return matchGroups.slice(1);
}

function getAttacks(melee, ranged, special) {
	let attacks = [];
	if (melee.length) {
		attacks.push({attack: melee, type: 'melee'});
	}
	if (ranged.length) {
		attacks.push({attack: ranged, type: 'ranged'});
	}
	if (special.length) {
		attacks.push({attack: special, type: 'special'});
	}
	return attacks;
}

function getSLAs(sla) {
	const firstMatcher = /Spell-Like Abilities \(CL ([0-9]+)[a-z]{2}; concentration \+([0-9]+)\)/i;
	let matchGroups = firstMatcher.exec(sla);
	let slaObj = {
		slaCL: '',
		slaConcentration: '',
		slaLevels: []
	};
	if (matchGroups) {
		slaObj.slaCL = matchGroups[1];
		slaObj.slaConcentration = matchGroups[2];
	} else {
		return slaObj;
	}
	const secondMatcher = /(?:(At Will)-|(Constant)-|([0-9]+)\/(?:day|week|month|year)-)/gi;
	let lastIndex = 0;
	while (true) {
		let nextMatch = secondMatcher.exec(sla);
		if (nextMatch == null) {
			if (slaObj.slaLevels.length) {
				slaObj.slaLevels[slaObj.slaLevels.length - 1]['slas'] = sla.slice(lastIndex);
			}
			break;
		}
		if (slaObj.slaLevels.length) {
			slaObj.slaLevels[slaObj.slaLevels.length - 1]['slas'] = sla.slice(lastIndex, nextMatch.index);
		}
		lastIndex = nextMatch.index + nextMatch[0].length;
		let slaLevel = {
			uses: nextMatch[3] ? parseInt(nextMatch[3]) : 0,
			slas: '',
			limited: ''
		};
		if (nextMatch[1]) slaLevel.limited = 'At will';
		if (nextMatch[2]) slaLevel.limited = 'Constant';
		if (nextMatch[3]) slaLevel.limited = 'Limited';
		slaObj.slaLevels.push(slaLevel);
	}
	const thirdMatcher = /[A-Z][^,()]*\s?(?:\([^()]+\))?/gi;
	slaObj.slaLevels = slaObj.slaLevels.map(level => {
		let slas = [];
		while (true) {
			let nextMatch = thirdMatcher.exec(level.slas);
			if (!nextMatch) break;
			slas.push({name: nextMatch[0].trim(), uses: level.uses});
		}
		return {uses: level.uses, limited: level.limited, slas: slas};
	});
	return slaObj;
}

function getSpells(prepared, known) {
	let spells = prepared.length ? prepared : known;
	let spellsObj = {
		spontaneous: known.length ? true : false,
		cl: '',
		concentration: '',
		spellLevels: []
	}
	const firstMatcher = /Spells (?:Known|Prepared) \(CL ([0-9]+)[a-z]{2}(?:; concentration \+([0-9]+))?\)/i;
	let matchGroups = firstMatcher.exec(spells);
	if (matchGroups) {
		spellsObj.cl = matchGroups[1];
		spellsObj.concentration = matchGroups[2] ? matchGroups[2] : '';
	} else {
		return spellsObj;
	}
	const secondMatcher = /(?:(0) \(at will\)|([0-9])[a-z]{2}(?: \(([0-9]+)\/day\))?)-/gi;
	let lastIndex = 0;
	while (true) {
		let nextMatch = secondMatcher.exec(spells);
		if (nextMatch == null) {
			if (spellsObj.spellLevels.length) {
				spellsObj.spellLevels[spellsObj.spellLevels.length - 1]['spells'] = spells.slice(lastIndex);
			}
			break;
		}
		if (spellsObj.spellLevels.length) {
			spellsObj.spellLevels[spellsObj.spellLevels.length - 1]['spells'] = spells.slice(lastIndex, nextMatch.index);
		}
		lastIndex = nextMatch.index + nextMatch[0].length;
		let spellLevel = {
			level: nextMatch[2] ? parseInt(nextMatch[2]) : 0,
			uses: nextMatch[3] ? parseInt(nextMatch[3]) : 0,
			spells: ''
		};
		spellsObj.spellLevels.push(spellLevel);
	}
	const thirdMatcher = /[A-Z][^,()]*\s?(?:\([^()]+\))?/gi;
	spellsObj.spellLevels = spellsObj.spellLevels.map(level => {
		let sp = [];
		while (true) {
			let nextMatch = thirdMatcher.exec(level.spells);
			if (!nextMatch) break;
			sp.push({name: nextMatch[0].trim(), cast: false});
		}
		return {uses: level.uses, level: level.level, spells: sp};
	});
	return spellsObj;
}

function getSpecialAbilities(s) {
	let specials = [];
	let lastIndex = 0;
	while (true) {
		let nextMatch = specialAbilityMatcher.exec(s);
		if (nextMatch == null) {
			if (specials.length) {
				specials[specials.length - 1]['description'] = s.slice(lastIndex);
			}
			return specials;
		}
		if (specials.length) {
			specials[specials.length - 1]['description'] = s.slice(lastIndex, nextMatch.index);
		}
		lastIndex = nextMatch.index + nextMatch[0].length;
		specials.push({
			name: nextMatch[1].trim(),
			type: nextMatch[2]
		});
	}
}

function getTactics(beforeCombat, duringCombat, morale) {
	let tactics = [];
	if (beforeCombat.length && beforeCombat != "NULL") {
		tactics.push({
			name: 'Before Combat',
			tactic: beforeCombat
		});
	}
	if (duringCombat.length && duringCombat != 'NULL') {
		tactics.push({
			name: 'During Combat',
			tactic: duringCombat
		});
	}
	if (morale.length && morale != 'NULL') {
		tactics.push({
			name: 'Morale',
			tactic: morale
		});
	}
	return tactics;
}

var index = [];

data.forEach(m => {
	if (m['CR'] == '-') m['CR'] = 0;
	index.push({
		name: m['Name'],
		cr: m['CR']
	});
	let slaObj = getSLAs(m['SpellLikeAbilities']);
	let spellObj = getSpells(m['SpellsPrepared'], m['SpellsKnown']);
	let monster = {
		id: '',
		basics: {
			name: m['Name'],
			quantity: 1,
			idx: 1,
			gender: m['Gender'] != 'NULL' ? m['Gender'] : '',
			race: m['Race'],
			classes: getClasses(m['Class']),
			alignment: m['Alignment'],
			size: m['Size'],
			type: (m['Type'] + ' ' + m['SubType']).trim(),
			initiativeBonus: parseInt(m['Init']),
			senses: getSenses(m['Senses']),
			perceptionBonus: getPerception(m['Senses']),
			aura: m['Aura']
		},
		statistics: {
			strScore: getAbilityScores(m['AbilityScores'])[0],
			dexScore: getAbilityScores(m['AbilityScores'])[1],
			conScore: getAbilityScores(m['AbilityScores'])[2],
			intScore: getAbilityScores(m['AbilityScores'])[3],
			wisScore: getAbilityScores(m['AbilityScores'])[4],
			chaScore: getAbilityScores(m['AbilityScores'])[5],
			bab: parseInt(m['BaseAtk']),
			cmb: m['CMB'],
			cmd: m['CMD'],
			feats: m['Feats'],
			skills: m['Skills'] + (m['RacialMods'].length ? '; Racial Mods: ' + m['RacialMods'] : ''),
			languages: m['Languages'],
			sq: m['SQ']
		},
		defense: {
			ac: getAc(m['AC'])[0],
			actouch: getAc(m['AC'])[1],
			acff: getAc(m['AC'])[2],
			acnotes: m['AC_Mods'],
			hp: parseInt(m['HP']),
			hpnotes: (m['HD'] + ' ' + m['HP_Mods']).trim(),
			fort: m['Fort'],
			ref: m['Ref'],
			will: m['Will'],
			savenotes: m['Save_Mods'],
			defensiveAbilities: m['DefensiveAbilities'],
			resistances: m['Resist'],
			immunities: m['Immune'],
			dr: m['DR'],
			sr: m['SR'],
			weaknesses: m['Weaknesses']
		},
		offense: {
			speed: m['Speed'] + (m['Speed_Mod'].length ? '; ' + m['Speed_Mod'] : ''),
			space: m['Space'],
			reach: m['Reach'],
			attacks: getAttacks(m['Melee'], m['Ranged'], m['SpecialAttacks'])
		},
		spells: {
			slaLevels: slaObj.slaLevels,
			slaCL: slaObj.slaCL,
			slaConcentration: slaObj.slaConcentration,
			spontaneous: spellObj.spontaneous,
			spellLevels: spellObj.spellLevels,
			cl: spellObj.cl,
			concentration: spellObj.concentration
		},
		extras: {
			specials: getSpecialAbilities(m['SpecialAbilities']),
			gear: m['Gear'] + (m['OtherGear'].length ? '; ' + m['OtherGear'] : ''),
			description: m['Description_Visual'],
			cr: eval(m['CR']),
			xp: m['XP'],
			tactics: getTactics(m['BeforeCombat'], m['DuringCombat'], m['Morale'])
		}
	};
	admin.firestore()
		.collection('monsters_converted')
		.doc(monster.basics.name)
		.set(monster).then((res) => {
			console.log(`Added ${monster.basics.name} to db`);
		})
		.catch((error) => {
			console.error(`Error adding ${monster.basics.name}`);
		});
});

admin.firestore().collection('monsters_converted').doc('index').set({
	index: index
});