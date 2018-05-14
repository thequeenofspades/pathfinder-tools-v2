import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {  MatInputModule,
          MatCheckboxModule,
          MatButtonModule,
          MatListModule,
          MatToolbarModule,
          MatTabsModule,
          MatExpansionModule,
          MatCardModule,
          MatDialogModule,
          MatBadgeModule,
          MatSnackBarModule,
          MatFormFieldModule,
          MatTableModule,
          MatIconModule,
          MatDividerModule,
          MatChipsModule,
          MatTooltipModule,
          MatProgressBarModule } from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
  	FlexLayoutModule,
    MatAutocompleteModule,
    MatInputModule,
	MatCheckboxModule,
	MatButtonModule,
	MatListModule,
	MatToolbarModule,
	MatTabsModule,
	MatExpansionModule,
	MatCardModule,
	MatDialogModule,
	MatBadgeModule,
	MatSnackBarModule,
	MatFormFieldModule,
	MatTableModule,
	MatIconModule,
	MatDividerModule,
	MatChipsModule,
	MatTooltipModule,
	MatProgressBarModule
  ],
  exports: [
  	FlexLayoutModule,
    MatAutocompleteModule,
    MatInputModule,
	MatCheckboxModule,
	MatButtonModule,
	MatListModule,
	MatToolbarModule,
	MatTabsModule,
	MatExpansionModule,
	MatCardModule,
	MatDialogModule,
	MatBadgeModule,
	MatSnackBarModule,
	MatFormFieldModule,
	MatTableModule,
	MatIconModule,
	MatDividerModule,
	MatChipsModule,
	MatTooltipModule,
	MatProgressBarModule
  ]
})
export class MaterialModule { }
