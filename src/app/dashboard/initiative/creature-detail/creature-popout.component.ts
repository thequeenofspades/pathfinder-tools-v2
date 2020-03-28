import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Creature } from '../../monster';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-creature-popout',
  templateUrl: './creature-popout.component.html',
  styleUrls: ['./creature-popout.component.css']
})
export class CreaturePopoutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreaturePopoutComponent>,
    private storage : AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public creature: Creature) { }

  public previewImageUrl: string;

  ngOnInit() {
    if (this.creature.imageUrl) {
      if (this.creature.imageUrl.startsWith('http')) {
        this.previewImageUrl = this.creature.imageUrl;
      } else {
        const storageRef = this.storage.ref(this.creature.imageUrl);
        storageRef.getDownloadURL().subscribe(url => {
          this.previewImageUrl = url;
        });
      }
    }
  }

  close(): void {
  	this.dialogRef.close();
  }

}
