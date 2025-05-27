import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  user$: Observable<User | null> = authState(this.auth);

  constructor() {
    this.user$.pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestore, 'users', user.uid);
          return getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              this.userRoleSubject.next(data['role'] || null);
            } else {
              this.userRoleSubject.next(null);
            }
          });
        } else {
          this.userRoleSubject.next(null);
          return of(null);
        }
      })
    ).subscribe();
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }
}
