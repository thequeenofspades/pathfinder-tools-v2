import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { BuffFormComponent } from '../buff-form/buff-form.component';
import { InitiativeService } from '../../dashboard/initiative.service';
import { Creature } from '../../dashboard/monster';

interface Buff {
	id: string,
	color: string,
	name: string,
	duration: number,
	initiative: number,
	affected: Creature[],
	effect: string
};

@Component({
  selector: 'app-buff-view',
  templateUrl: './buff-view.component.html',
  styleUrls: ['./buff-view.component.scss']
})
export class BuffViewComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  @Input() initiativeService: InitiativeService;
  @Input() buffs: Buff[];
  @Input() order: Creature[];
  @Input() active: number;
  @Input() showNames: string;

  public focusedBuffId : string;

  openBuffFormDialog(buff?: Buff): void {
    let dialogRef = this.dialog.open(BuffFormComponent, {
      width: '500px',
      data: {buff: buff, order: this.order, active: this.active, showNames: this.showNames}
    });
    dialogRef.afterClosed().subscribe(newBuff => {
      if (newBuff !== undefined && buff == undefined) {
        this.initiativeService.addBuff(newBuff);
      } else if (newBuff != undefined) {
      	console.log('updating buff');
      	this.initiativeService.updateBuff({...newBuff, id: buff.id, color: buff.color});
      }
    });
  }

  clearBuffs(): void {
    this.initiativeService.clearBuffs();
  }

  removeBuff(buff: Buff): void {
  	this.initiativeService.removeBuff(buff);
  }

  rerollColor(buff: Buff): void {
  	this.initiativeService.changeBuffColor(buff);
  }

  buffTrackByFn(index, buff) {
    return buff.color;
  }

  sortedBuffs(buffs: Buff[]): Buff[] {
    return buffs.sort((a, b) => {
      return a.duration - b.duration;
    });
  }

  mouseoverBuff(buff: Buff) {
    this.focusedBuffId = buff.id;
  }

  mouseoutBuff() {
    this.focusedBuffId = undefined;
  }

}
