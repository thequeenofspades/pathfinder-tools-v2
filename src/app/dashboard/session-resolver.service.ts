import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class SessionResolverService implements Resolve<string> {

  constructor(private router: Router,
  	private db: AngularFirestore) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
  	let id = route.paramMap.get('id');
  	return Observable.fromPromise(this.db.collection('sessions').doc(id).ref.get()).pipe(
  		take(1),
  		map(doc => {
  			if (doc.data()) {
  				return id;
  			} else {
  				this.router.navigate(['/dashboard']);
  				return null;
  			}
  		}));
  }
}
