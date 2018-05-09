import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(public snackbar: MatSnackBar) {}

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
    let snackBarRef = this.snackbar.open(message, 'Dismiss', {
    	duration: 2000,
    });
    snackBarRef.onAction().subscribe(() => snackBarRef.dismiss());
  }

  clear() {
    this.messages = [];
  }
}