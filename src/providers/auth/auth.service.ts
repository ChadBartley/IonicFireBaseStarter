import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'

//User Class
import { IUser } from '../../models/user';
import { IPreferences } from '../../models/preferences';

@Injectable()
export class AuthService {
  
  //firebase.UserInfo is the interface used to maintain user
  //  info stored in the db
  user: Observable<IUser>;

  userDoc: any;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        });
  }

  signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        //User is Authenticated
        //Whatever we want to call after the user has been authenticated in
      })
  }

  public updateUserData(user: IUser) : Promise<any> {
    console.log("Revamp this function, It doesn't work properly");
    return new Promise<null>((resolve, reject) => {
      //Put logic here so we can throw erro if needed
      if(!user) throw new Error("Function Not Implemented");

      // export interface IUser {
      //   uid: string;
      //   email: string;
      //   photoURL?: string;
      //   providerId?: string;
      //   preferences?: IPreferences
      // }

      // export interface IPreferences {
      //   displayName?: string;
      //   favoriteColor?: string;
      //   phoneNumber?: string;
      // }

      // let data: IUser = {uid: user.uid, 
      //                     email: user.email, 
      //                     photoURL: user.photoURL,
      //                     providerId: user.providerId,
      //                     preferences: user.preferences
      //                   }

      //Get IUser Doc
      const userDocRef: AngularFirestoreDocument<IUser> = this.afs.doc(`users/${user.uid}`);
    
      let prefData : IPreferences = user.preferences;

      if(!prefData){
        prefData = <IPreferences>{ favoriteColor: "",
                                    displayName: user.email,
                                    phoneNumber: ""
                                  }
      }

      return userDocRef.set(
        {uid: user.uid, 
        email: user.email, 
        photoURL: user.photoURL,
        providerId: user.providerId,
        preferences: prefData
        } 
      );
    
    });
    // Sets user data to firestore on login
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    // const data: IUser = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL,
    //   phoneNumber: user.phoneNumber,
    //   providerId: user.providerId,
    //   favoriteColor: user.favoriteColor ? user.favoriteColor : ""
    // }

    //return userRef.set(data);
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signInEmailPassword(email: string, password: string) : Promise<any>{
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    // return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  //Publicly available Getters
  public getUserDoc(){

  }

}