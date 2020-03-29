import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BuffFormComponent } from '../buff-form/buff-form.component';
import { InitiativeService } from '../../dashboard/initiative.service';
import { Creature } from '../../dashboard/monster';
import { Condition } from '../../dashboard/condition';

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
  @Input() buffs: Condition[];
  @Input() order: Creature[];
  @Input() active: number;
  @Input() showNames: string;

  public focusedBuffId : string;

  openBuffFormDialog(buff?: Condition): void {
    let dialogRef = this.dialog.open(BuffFormComponent, {
      width: '500px',
      data: {buff: buff, order: this.order, active: this.active, showNames: this.showNames}
    });
    dialogRef.afterClosed().subscribe(newBuff => {
      if (newBuff !== undefined && buff == undefined) {
        newBuff.playerVisible = 2;
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

  removeBuff(buff: Condition): void {
  	this.initiativeService.removeBuff(buff);
  }

  rerollColor(buff: Condition): void {
  	this.initiativeService.changeBuffColor(buff);
  }

  buffTrackByFn(index, buff) {
    return buff.color;
  }

  sortedBuffs(buffs: Condition[]): Condition[] {
    return buffs.sort((a, b) => {
      return a.permanent ? 1 : b.permanent ? -1 : a.duration - b.duration;
    }).filter(buff => {
      return buff.playerVisible == undefined || buff.playerVisible > 0;
    });
  }

  mouseoverBuff(buff: Condition) {
    this.focusedBuffId = buff.id;
  }

  mouseoutBuff() {
    this.focusedBuffId = undefined;
  }

}
