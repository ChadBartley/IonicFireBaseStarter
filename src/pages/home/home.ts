import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, Loading, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';

// Auth Stuff
import { AuthService } from '../../providers/auth/auth.service'
// import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public currentUser: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public authService: AuthService) {

      this.currentUser = firebase.auth().currentUser;
  }

  logOut(){
    this.authService.signOut()
      .then(res => {
        console.log("Logged out in home page");
        this.navCtrl.setRoot(LoginPage);
      })
  }

}
