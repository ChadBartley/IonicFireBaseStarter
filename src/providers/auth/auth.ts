import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

//Firebase Stuff
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  authState: any = null;

  constructor(public http: Http, 
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase) {
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  loginUser(email: string, password: string) : Promise<any>{
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string) : Promise<any>{
    return firebase
            .auth()
            .createUserWithEmailAndPassword(email,password)
            .then(newUser => {
              firebase
              .database()
              .ref('/userProfile/${newUser.uid}/email')
              .set(email);
              this.updateUserData();
            })
          .catch(error => console.log("Error in AuthProvider.signUpUser : " + error));
  }

  resetPassword(email: string) : Promise<void>{
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser() : Promise<void>{

    //Close any DB Connections
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('/userProfile/${userId}')
      .off();

    this.afAuth.auth.signOut();
    return firebase.auth().signOut();
  }

  googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    this.socialSignIn(provider);
  }

  private socialSignIn(provider){
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      })
  }

  
  private updateUserData(): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUser.userId}`; // Endpoint on firebase
    let data = {
                  email: this.authState.email,
                  name: this.authState.displayName
                }

    this.db.object(path).update(data)
    .catch(error => console.log(error));

  }

}
