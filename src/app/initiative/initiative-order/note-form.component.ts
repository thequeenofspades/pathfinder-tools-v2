import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-note-form',
  template: `
    <form (ngSubmit)="onSubmit()" #noteForm="ngForm">
      <div class="form-group">
        <label for="note">Note</label>
        <input type="text" class="form-control" id="note"
                required [(ngModel)]="note" name="note"
                #name="ngModel">
      </div>
      <button type="button" class="btn btn-default"
              (click)="onCancel()">Cancel</button>
      <button type="submit" class="btn btn-success"
              [disabled]="!noteForm.form.valid">Submit</button>
    </form>
  `,
  styles: []
})
export class NoteFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() onSubmitted = new EventEmitter<string>();
  @Output() onCanceled = new EventEmitter();

  note: string;

  onSubmit(): void {
    this.onSubmitted.emit(this.note);
  }

  onCancel(): void {
    this.onCanceled.emit();
  }

}
