export interface Creature {
	name: string,
	initiativeBonus: number,
	perceptionBonus: number,
	id: string,
    initiative?: number,
    hp?: number,
    imageUrl?: string,
    delayed?: boolean,
    visible?: boolean
}

export interface Monster {
	name: string,
	initiativeBonus: number,
	hp: number,
	currentHp: number,
	perceptionBonus: number,
	conScore: number,
	quantity: number,
	idx: number,
	id: string,
}

export interface MonsterI {
	id: string,
	basics: {
        name: string,
        quantity: number,
        idx: number,
        gender: string,
        race: string,
        classes: {
            class: string,
            level: number
        }[],
        alignment: string,
        size: string,
        type: string,
        initiativeBonus: number,
        senses: string,
        perceptionBonus: number,
        aura: string
    },
    statistics: {
        strScore: string | number,
        dexScore: string | number,
        conScore: number,
        intScore: string | number,
        wisScore: string | number,
        chaScore: string | number,
        bab: string | number,
        cmb: string | number,
        cmd: string | number,
        feats: string,
        skills: string,
        languages: string,
        sq: string
      },
      defense: {
        ac: string,
        acff: string,
        actouch: string,
        acnotes: string,
        hp: number,
        hpnotes: string,
        fort: string | number,
        ref: string | number,
        will: string | number,
        savenotes: string,
        defensiveAbilities: string,
        resistances: string,
        immunities: string,
        dr: string,
        sr: string,
        weaknesses: string
      },
      offense: {
        speed: string,
        attacks: {
            attack: string,
            type: string
        }[],
        space: string,
        reach: string
      },
      spells: {
        slaLevels: {
            limited: string,
            uses: number,
            slas: {
                name: string,
                uses: number
            }[]
        }[],
        slaCL: string | number,
        slaConcentration: string | number,
        spontaneous: boolean,
        spellLevels: {
            level: number,
            uses: number,
            spells: {
                name: string,
                cast: boolean
            }[]
        }[],
        cl: string | number,
        concentration: string | number
      },
      extras: {
        specials: {
            name: string,
            type: string,
            description: string
        }[],
        gear: string,
        description: string,
        cr: number,
        xp: string | number,
        tactics: {
            name: string,
            tactic: string
        }[],
        imageUrl: string
      }
}