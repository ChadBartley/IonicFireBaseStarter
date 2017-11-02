import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'

//User Class
import { IUser, User } from '../../models/user';

@Injectable()
export class AuthService {
  
  //firebase.UserInfo is the interface used to maintain user
  //  info stored in the db
  user: Observable<firebase.UserInfo>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<firebase.UserInfo>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })
  }

  signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }

  public updateUserData(user: IUser) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      providerId: user.providerId,
      favoriteColor: user.favoriteColor ? user.favoriteColor : ""
    }

    return userRef.set(data);
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signInEmailPassword(email: string, password: string) : Promise<any>{
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    // return firebase.auth().signInWithEmailAndPassword(email, password);
  }

}