import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, map, Observable, filter, switchMap, of } from 'rxjs';
import IUser from '../models/user.mddel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided');
    }
    const userCreds = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData?.password
    );
    if (!userCreds.user) {
      throw new Error('User not found');
    }
    await this.usersCollection.doc(userCreds.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCreds.user.updateProfile({
      displayName: userData.name,
    });
  }
  public async logout($event: Event) {
    $event.preventDefault();
    await this.auth.signOut();
    if (this.redirect) await this.router.navigateByUrl('/');
  }
}
