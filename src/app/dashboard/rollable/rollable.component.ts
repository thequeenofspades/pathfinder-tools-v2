import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rollable',
  templateUrl: './rollable.component.html',
  styleUrls: ['./rollable.component.css']
})
export class RollableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() bonus: number;

  public result: number;

  roll() {
  	this.result = this.getRandomInt(1, 20) + this.bonus;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
