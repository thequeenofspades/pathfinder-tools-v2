import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-initiative-form',
  template: `
    <form (ngSubmit)="onSubmit()" #initiativeForm="ngForm">
      <div class="form-group">
        <label for="initiative">Initiative (with bonuses)</label>
        <input type="number" class="form-control" id="initiative"
                required [(ngModel)]="initiative" name="initiative"
                #name="ngModel">
      </div>
      <button type="button" class="btn btn-default"
              (click)="onCancel()">Cancel</button>
      <button type="submit" class="btn btn-success"
              [disabled]="!initiativeForm.form.valid">Submit</button>
    </form>
  `,
  styles: []
})
export class InitiativeFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() onSubmitted = new EventEmitter<number>();
  @Output() onCanceled = new EventEmitter();

  initiative: number;

  onSubmit(): void {
    this.onSubmitted.emit(this.initiative);
  }

  onCancel(): void {
    this.onCanceled.emit();
  }

}
