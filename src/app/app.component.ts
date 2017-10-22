import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Environment Stuff
import { environment } from '../environments/environment';

//Firebase Stuff
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    //Done Inside App Module
    firebase.initializeApp(environment.firebase);

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if(!user){
        //No User
        console.log("no user");
        this.rootPage = 'LoginPage'
        unsubscribe();
      } else {
        console.log("User");
        this.rootPage = HomePage;
        unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

