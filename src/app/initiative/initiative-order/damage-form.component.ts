import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-damage-form',
  template: `
    <form (ngSubmit)="onSubmit()" #damageForm="ngForm">
      <div class="form-group">
        <label for="damage">Damage</label>
        <input type="number" class="form-control" id="damage"
                required [(ngModel)]="damage" name="damage"
                #name="ngModel">
      </div>
      <button type="button" class="btn btn-default"
              (click)="onCancel()">Cancel</button>
      <button type="submit" class="btn btn-success"
              [disabled]="!damageForm.form.valid">Submit</button>
    </form>
  `,
  styles: []
})
export class DamageFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() onSubmitted = new EventEmitter<number>();
  @Output() onCanceled = new EventEmitter();

  damage: number;

  onSubmit(): void {
    this.onSubmitted.emit(this.damage);
  }

  onCancel(): void {
    this.onCanceled.emit();
  }

}
