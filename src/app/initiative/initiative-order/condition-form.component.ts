import { Component, OnInit, EventEmitter, Output } from '@angular/core';

class Condition {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-condition-form',
  template: `
    <form (ngSubmit)="onSubmit()" #conditionForm="ngForm">
      <div class="form-group">
        <label for="name">Condition</label>
        <input type="text" class="form-control" id="name"
                required [(ngModel)]="condition.name" name="name"
                #name="ngModel">
      </div>
      <div class="form-group">
        <label for="duration">Duration</label>
        <input type="number" class="form-control" id="duration"
                required [(ngModel)]="condition.duration" name="duration"
                #name="ngModel">
      </div>
      <button type="button" class="btn btn-default"
              (click)="onCancel()">Cancel</button>
      <button type="submit" class="btn btn-success"
              [disabled]="!conditionForm.form.valid">Submit</button>
    </form>
  `,
  styles: []
})
export class ConditionFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() onSubmitted = new EventEmitter<Condition>();
  @Output() onCanceled = new EventEmitter();

  condition: Condition = new Condition();

  onSubmit(): void {
    this.onSubmitted.emit(this.condition);
  }

  onCancel(): void {
    this.onCanceled.emit();
  }

}
