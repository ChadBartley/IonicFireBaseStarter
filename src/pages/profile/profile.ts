import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Auth Stuff
import { AuthService } from '../../providers/auth/auth.service'
import firebase from 'firebase';

import {IUser, User} from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private currentUser: IUser = <IUser>{};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: AuthService) {

      this.currentUser = firebase.auth().currentUser;
    
  }

  ionViewDidLoad() {

  }

  updateProfile(){
    console.log(this.currentUser.phoneNumber);
    this.authService.updateUserData(this.currentUser).then(res => {
      console.log("Updated User");
    }).catch(er => {
      console.log("Error when updating user : " + er)
    });
  }

}
