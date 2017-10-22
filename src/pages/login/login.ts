import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, Loading, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
// import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

// Auth Stuff
import { AuthService } from '../../providers/auth/auth.service'

import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public authService: AuthService,
              private googlePlus: GooglePlus,
              formBuilder: FormBuilder) {

      this.loginForm = formBuilder.group({
        email: [
          '',
          Validators.compose([Validators.required, EmailValidator.isValid])
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)])
        ]
      });
  }

  loginUser(): void {
    if(!this.loginForm.valid){
      console.log('Form is not valid yet, current value: ${this.loginForm.value}');
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.signInEmailPassword(email, password).then(
        authData => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage);
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{text: 'OK', role: 'cancel'}]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  loginWithGoogle(): void{
    this.authService.signInGoogle()
      .then(res => {
        console.log("Signed In with Google");
        this.navCtrl.setRoot(HomePage);
      })
      .catch(err => {console.error(err)});
    // this.googlePlus.login({
    //   'webClientId': 'com.googleusercontent.apps.247083115164-3an7hmcvvh6lbbk9avfnl5mmguqm8q36',
    //   'offline': true
    // }).then( res => {
    //   this.authService.signInGoogle
    // })
    //   .catch(err => console.error(err));
  }

  goToSignup():void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword():void {
    this.navCtrl.push('ResetPasswordPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
