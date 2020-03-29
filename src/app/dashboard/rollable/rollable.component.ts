import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rollable',
  templateUrl: './rollable.component.html',
  styleUrls: ['./rollable.component.css']
})
export class RollableComponent implements OnInit {

  constructor() { }

  @Input() base: number = 20;
  @Input() bonus: number = 0;
  @Input() iconColor: string = "primary";
  @Input() badgeColor: string = "accent";

  ngOnInit() {
    this.result = undefined;
  }

  public result: number;

  roll() {
    this.result = this.getRandomInt(1, Number(this.base)) + Number(this.bonus);
    setTimeout(_ => {
      this.result = undefined;
    }, 1000);
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
