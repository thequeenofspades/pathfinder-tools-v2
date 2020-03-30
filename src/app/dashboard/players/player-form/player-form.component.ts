import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Player } from '../../player';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {

  constructor(private playerService: PlayerService,
    private fb: FormBuilder,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.createForm();
  }

  @Input() player: Player;
  @Output() onSubmitted = new EventEmitter<Player>();
  @Output() onCanceled = new EventEmitter();

  playerForm: FormGroup;
  uploadingMsg: string;

  createForm(): void {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      id: [''],
      initiativeBonus: [undefined, Validators.required],
      perceptionBonus: [undefined, Validators.required],
      senseMotiveBonus: [undefined, Validators.required],
      imageUrl: ['']
    });
    if (this.player) {
      this.playerForm.patchValue(this.player);
    }
  }

  uploadImage(event) {
    this.uploadingMsg = 'Uploading...';
    let fileList: FileList = event.target.files;
    if (fileList.length == 0) {
      return;
    }
    let file: File = fileList[0];
    let storageRef: AngularFireStorageReference = this.storage.ref('sessions').child(this.playerService.sessionId).child(file.name);
    storageRef.put(file).then(snapshot => {
      this.uploadingMsg = 'Done!';
      snapshot.ref.getDownloadURL().then(url => {
        this.playerForm.get('imageUrl').setValue(url);
      });
    }, error => {
      this.uploadingMsg = 'Error: ' + error.message;
    });
  }

  onCancel() {
    this.createForm();
  	this.onCanceled.emit();
  }

  onSubmit() {
  	this.onSubmitted.emit(this.playerForm.value);
  }
}
