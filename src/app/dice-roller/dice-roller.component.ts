import { Component, OnInit } from '@angular/core';

const groupMatcher = /([0-9]+d[0-9]+(?:[+][0-9]+)*(?!d))/gi
const partMatcher = /([0-9]+)d([0-9]+)((?:[+][0-9]+)*)?(?!d)/i
const bonusMatcher = /[+]([0-9])(?!d)/gi

@Component({
  selector: 'app-dice-roller',
  templateUrl: './dice-roller.component.html',
  styleUrls: ['./dice-roller.component.css']
})
export class DiceRollerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	this.model = {command: '', result: 0};
  }

  model: {command: string, result: number};

  rollCustom(): number {
  	let dieGroups = [];
  	while (true) {
  		let matched = groupMatcher.exec(this.model.command);
  		if (matched == null) break;
  		dieGroups.push(matched);
  	}
  	dieGroups = dieGroups.map(dieGroup => partMatcher.exec(dieGroup));
  	let result = 0;
  	dieGroups.forEach(dieGroup => {
  		let numDice = parseInt(dieGroup[1]);
  		let dieType = parseInt(dieGroup[2]);
  		let bonusesRaw = dieGroup[3];
  		let bonuses = [];
  		while (true) {
  			let bonus = bonusMatcher.exec(bonusesRaw);
  			if (bonus == null) break;
  			bonuses.push(parseInt(bonus[1]));
  		}
  		console.log(numDice, dieType, bonuses);
  		for (var i = 0; i < numDice; i++) {
  			result += this.getRandomInt(1, dieType);
  		}
  		for (let bonus of bonuses) {
  			result += bonus;
  		}
  		console.log(result);
  	});
  	return result;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
