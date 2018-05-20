import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private db: AngularFirestore,
  	private router: Router) { }

  newSession(): void {
  	let id: string = this.generateId(4);
  	this.db.collection('sessions').doc(id).ref.get().then(doc => {
  		if (doc.data()) {
  			this.newSession();
  		} else {
  			this.db.collection('sessions').doc(id).set({timestamp: Date.now()}).then(_ => {
  				this.router.navigate(['/dashboard', id]);
  			});
  		}
  	});
  }

  checkSession(id: string): Observable<boolean> {
  	return Observable.fromPromise(this.db.collection('sessions').doc(id).ref.get()).pipe(
  		take(1),
  		map(doc => {
  			if (doc.data()) {
  				return true;
  			} else {
  				return false;
  			}
  		})
  	);
  }

  filterValidSessions(codes: string[]): Observable<string[]> {
    return Observable.fromPromise(this.db.collection('sessions').ref.get()).pipe(
      take(1),
      map(qs => {
        let validCodes = {};
        qs.docs.forEach(doc => validCodes[doc.id] = 1);
        return codes.filter(c => validCodes[c]);
      }));
  }

  goToSessionDM(id: string): void {
  	this.router.navigate(['/dashboard', id]);
  }

  goToSessionPlayer(id: string): void {
    this.router.navigate(['/player', id]);
  }

  generateId(length: number): string {
  	return Math.random().toString(36).substring(2, length) + Math.random().toString(36).substring(2, length);
  }
}
