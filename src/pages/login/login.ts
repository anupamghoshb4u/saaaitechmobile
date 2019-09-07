import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { ProfilePage } from '../profile/profile';

import { ChildsService } from '../../service/childs.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'page-list',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(
    public childsservice: ChildsService,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public network: Network,
  ) {
  }

  user_name: string;
  password: string;
  param = {
    child_id: '',
    user_name: '',
    password: '',
  };

  checkLogin() {
    if (this.user_name == undefined) {
      const alert = this.alertCtrl.create({
        title: 'Login',
        subTitle: 'Please enter user name',
        buttons: ['OK']
      });
      alert.present(); //show failure message
    }
    else if (this.password == undefined) {
      const alert = this.alertCtrl.create({
        title: 'Login',
        subTitle: 'Please enter password',
        buttons: ['OK']
      });
      alert.present(); //show failure message
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Please Wait.....'
      });
      loading.present();

      this.param.user_name = this.user_name;
      this.param.password = this.password;


      if (navigator.onLine == false) { //when the network is offline
        loading.dismiss();

        if (localStorage.getItem('childs') != null) {
          let count = this.childsservice.count(this.param);

          if (count != -1) {
            let data: any = JSON.parse(localStorage.getItem('childs'));
            this.auth.setSession(data.childs[count]); //set the data into local storage
            this.navCtrl.setRoot(ProfilePage); //redirect to home page
          } else {
            const alert = this.alertCtrl.create({
              title: 'Login',
              subTitle: 'Invalid User Name/Password',
              buttons: ['OK']
            });
            alert.present(); //show failure message
          }
        } else {
          const alert = this.alertCtrl.create({
            title: 'Login',
            subTitle: 'Please be online first and login with user name/password',
            buttons: ['OK']
          });
          alert.present(); //show failure message
        }
      } else { //when the network is online
        this.childsservice.checkLogin(this.param).subscribe((ret: any) => {
          if (ret.status == 'failure') {
            loading.dismiss();

            const alert = this.alertCtrl.create({
              title: 'Login',
              subTitle: ret.msg,
              buttons: ['OK']
            });
            alert.present(); //show failure message
          } else {
            loading.dismiss();

            if (localStorage.getItem('childs') != null) {
              this.param.child_id = ret.data.childs[0].child_id;
              let count = this.childsservice.count(this.param); //check the child is exist or not

              if (count == -1) {
                this.childsservice.insert(ret.data.childs); //insert into childs json
              }
            } else {
              localStorage.setItem('childs', JSON.stringify(ret.data)); //save the childs json in local storage
            }
            this.auth.setSession(ret.data.childs[0]); //set the data into local storage
            this.navCtrl.setRoot(ProfilePage); //redirect to home page
          }
        });
      }
    }
  }
}
