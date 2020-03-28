import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(public snackbar: MatSnackBar) {}


  add(message: string) {
    let snackBarRef = this.snackbar.open(message, 'Dismiss', {
    	duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => snackBarRef.dismiss());
  }
}