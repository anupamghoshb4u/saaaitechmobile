import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AssessmentsPage } from '../pages/assessments/assessments';
import { AttemptsPage } from '../pages/attempts/attempts';

import { AuthService } from '../service/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') navCtrl: NavController;

  rootPage: any = HomePage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public auth: AuthService, public alertCtrl: AlertController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page == 'home') {
      this.navCtrl.setRoot(HomePage);
    }
    else if (page == 'login') {
      this.navCtrl.setRoot(LoginPage);
    }
    else if (page == 'profile') {
      this.navCtrl.setRoot(ProfilePage);
    }
    else if (page == 'assessments') {
      this.navCtrl.setRoot(AssessmentsPage);
    }
    else if (page == 'attempts') {
      this.navCtrl.setRoot(AttemptsPage);
    }
  }

  logOut() {
    const confirm = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            localStorage.setItem("child_id", "");
            localStorage.setItem("child_name", "");
            localStorage.removeItem("child_id");
            localStorage.removeItem("child_name");
            this.navCtrl.setRoot(HomePage);
          }
        },
        {
          text: 'No',
        }
      ]
    });
    confirm.present();
  }
}
