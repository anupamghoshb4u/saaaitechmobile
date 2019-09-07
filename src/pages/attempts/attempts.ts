import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { SyncQuizService } from '../../service/syncquiz.service';

import { JsonService } from '../../service/json.service';

@Component({
  selector: 'page-attempts',
  templateUrl: 'attempts.html',
})
export class AttemptsPage {
  quizresults: any;
  quiz_name: string;
  child_name: string;
  question_count: number;
  question_attempt: number;

  geo_ip: string = '';
  geo_country: string = '';
  geo_region: string = '';
  geo_city: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public network: Network,
    public jsonservice: JsonService,
    public syncquizservice: SyncQuizService,
  ) {
    if (localStorage.getItem('quizresults') != null) {
      this.quizresults = JSON.parse(localStorage.getItem('quizresults'));
      let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));
      let data: any = JSON.parse(localStorage.getItem('childs'));
      let quizes: any = JSON.parse(localStorage.getItem('quizes'));
      let questions = JSON.parse(localStorage.getItem('questions'));

      for (let i = 0; i < this.quizresults.length; i++) {
        for (let j = 0; j < quizes.length; j++) {
          if (this.quizresults[i].quiz_id == quizes[j].quiz_id) {
            this.quiz_name = quizes[j].quiz_name;
          }
        }

        for (let k = 0; k < data.childs.length; k++) {
          if (this.quizresults[i].child_id == data.childs[k].child_id) {
            this.child_name = data.childs[k].child_name;
          }
        }

        this.question_count = 0;
        for (let l = 0; l < questions.length; l++) {
          if (questions[l].quiz_id == this.quizresults[i].quiz_id && questions[l].parent_id == '0') {
            this.question_count++;
          }
        }

        this.question_attempt = 0;
        for (let m = 0; m < quizresultdetails.length; m++) {
          if (quizresultdetails[m].quiz_id == this.quizresults[i].quiz_id && quizresultdetails[m].quiz_result_id == this.quizresults[i].quiz_result_id && quizresultdetails[m].answer != '') {
            this.question_attempt++;
          }
        }

        this.quizresults[i] = {
          "quiz_result_id": this.quizresults[i].quiz_result_id,
          "quiz_id": this.quizresults[i].quiz_id,
          "quiz_name": this.quiz_name,
          "question_count": this.question_count,
          "question_attempt": this.question_attempt,
          "child_id": this.quizresults[i].child_id,
          "child_name": this.child_name,
          "quiz_start_date": this.quizresults[i].quiz_start_date,
          "quiz_end_date": this.quizresults[i].quiz_end_date,
          "geo_ip": this.quizresults[i].geo_ip,
          "geo_country": this.quizresults[i].geo_country,
          "geo_region": this.quizresults[i].geo_region,
          "geo_city": this.quizresults[i].geo_city,
          "capture_1": this.quizresults[i].capture_1,
          "capture_2": this.quizresults[i].capture_2,
          "capture_3": this.quizresults[i].capture_3,
          "is_completed": this.quizresults[i].is_completed,
          "is_active": this.quizresults[i].is_active,
        };
      }
    }

    this.syncQuiz();
  }

  syncQuiz() {
    if (navigator.onLine == true) { //when the network is online
      //if(this.network.type !== 'none'){  //when the network is online
      this.syncquizservice.syncquizresult().subscribe((result: any) => {
        if (result.status == 'success') {
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
