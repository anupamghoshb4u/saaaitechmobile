import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../service/auth.service';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  childs: any;
  constructor(public navCtrl: NavController, public auth: AuthService) { }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage); //redirect to login page
  }
}
