import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { SyncQuizService } from '../../service/syncquiz.service';
import { JsonService } from '../../service/json.service';

import { AssessmentsPage } from '../assessments/assessments';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  child:any;

  geo_ip:string = '';
  geo_country:string = '';
  geo_region:string = '';
  geo_city:string = '';

  constructor(
    public navCtrl: NavController,
    public network: Network,
    public jsonservice:JsonService,
    public syncquizservice:SyncQuizService,
    ) {
    this.getChild();
    this.syncQuiz();
  }

  getChild(){
    let data :any = JSON.parse(localStorage.getItem('childs'));

    this.child = [];

    for(let i = 0; i < data.childs.length; i++) {
      if(data.childs[i].child_id == localStorage.getItem('child_id')){
        this.child = data.childs[i];
      }
    }
  }

  goToAssessments(){
    this.navCtrl.setRoot(AssessmentsPage); //redirect to Assessments page
  }

  syncQuiz(){
    if(navigator.onLine ==true){ //when the network is online
      this.syncquizservice.syncquizresult().subscribe((result:any) => {
        if(result.status=='success'){
          localStorage.setItem('currentquestions', '');
          localStorage.removeItem('currentquestions');
          localStorage.setItem('quiz_result_id', '');
          localStorage.removeItem('quiz_result_id');

          localStorage.setItem('quizresults', '');
          localStorage.removeItem('quizresults');
          localStorage.setItem('quizresultdetails', '');
          localStorage.removeItem('quizresultdetails');
        } //sync the quiz when the user is online
      });
    }
  }
}