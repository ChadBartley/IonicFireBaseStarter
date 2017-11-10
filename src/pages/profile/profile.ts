import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

// Auth Stuff
import { AuthService } from '../../providers/auth/auth.service'
import firebase from 'firebase';

import {IUser} from '../../models/user';
import { IPreferences } from '../../models/preferences';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private currentUser: IUser;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: AuthService) {

      this.currentUser = <IUser>{};
      this.currentUser.preferences = <IPreferences>{};
      this.authService.user.subscribe(res => {
        this.currentUser = res;
      })

      // console.log(JSON.stringify(this.currentUser));

      // if(!this.currentUser.preferences) this.currentUser.preferences = <IPreferences>{};
    
  }

  ionViewDidLoad() {

  }

  updateProfile(){
    //console.log(this.currentUser.preferences.phoneNumber);
    //console.log(JSON.stringify(this.currentUser));
    this.authService.updateUserData(this.currentUser).then(res => {
      console.log("Updated User");
    }).catch(er => {
      console.log("Error when updating user : " + er)
    });
  }

}
