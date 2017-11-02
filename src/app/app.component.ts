import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Environment Stuff
import { environment } from '../environments/environment';

//Firebase Stuff
import firebase from 'firebase';

// Auth Stuff
import { AuthService } from '../providers/auth/auth.service'

import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  currentUser: any = {};

  rootPage:any;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public menu: MenuController) {

    this
    //Done Inside App Module
    firebase.initializeApp(environment.firebase);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage }
    ];

    console.log("Pages : " + this.pages);

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if(!user){
        //No User
        this.rootPage = 'LoginPage'
        unsubscribe();
      } else {
        this.rootPage = HomePage;
        this.currentUser = user;
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

  openPage(page){
    this.nav.setRoot(page.component);
  }

  logOut(){
      this.menu.close().then(res => {
         firebase.auth().signOut().then(res => {
            console.log("Logout Callback inside App Component");
            this.nav.setRoot('LoginPage');
         })
       });
  }
}

