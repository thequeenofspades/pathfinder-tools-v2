import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class SessionResolverService implements Resolve<string> {

  constructor(private router: Router,
  	private db: AngularFirestore,
    protected localStorage: LocalStorage) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
  	let id = route.paramMap.get('id');
  	return from(this.db.collection('sessions').doc(id).ref.get()).pipe(
  		take(1),
  		map(doc => {
  			if (doc.data()) {
          this.localStorage.getItem<string[]>('sessionCodes').subscribe(codes => {
            let sessionCodes: string[] = codes as string[] || [];
            sessionCodes[id] = Date.now();
            this.localStorage.setItemSubscribe('sessionCodes', sessionCodes);
          });
  				return id;
  			} else {
  				this.router.navigate(['/dashboard']);
  				return null;
  			}
  		}));
  }
}
