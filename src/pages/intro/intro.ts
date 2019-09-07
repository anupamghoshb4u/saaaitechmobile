import { Component } from '@angular/core';
import { LoadingController, NavParams, NavController } from 'ionic-angular';

import { AssessmentsPage } from '../../pages/assessments/assessments';
import { TakeAssessmentPage } from '../../pages/takeassessment/takeassessment';

import { JsonService } from '../../service/json.service';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})

export class IntroPage {
  quiz_id: number;
  quiz_time: number;

  question_id: number;
  question_count: number;
  currentquestions: any;
  currentchildquestions: any;

  constructor(
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public jsonservice: JsonService,
  ) {

    this.quiz_id = navParams.get("quiz_id");
    let quizes = JSON.parse(localStorage.getItem('quizes'));

    for (let i = 0; i < quizes.length; i++) {
      if (quizes[i].quiz_id == this.quiz_id) {
        this.quiz_time = quizes[i].quiz_time;
      }
    }

    let questions = JSON.parse(localStorage.getItem('questions'));

    this.question_count = 0;
    this.currentquestions = [];
    this.currentchildquestions = [];

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].quiz_id == this.quiz_id && questions[i].parent_id == '0') {
        this.currentquestions.push({
          "question_id": questions[i].question_id,
          "parent_id": questions[i].parent_id,
          "language_id": questions[i].language_id,
          "languages": questions[i].languages,
          "user_id": questions[i].user_id,
          "subject_id": questions[i].subject_id,
          "topic_id": questions[i].topic_id,
          "question_desc": questions[i].question_desc,
          "question_type": questions[i].question_type,
          "level": questions[i].level,
          "mark": questions[i].mark,
          "question_hints": questions[i].question_hints,
          "is_active": questions[i].is_active
        });

        this.question_count++;
      }
    }

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].quiz_id == this.quiz_id && questions[i].parent_id > 0) {
        this.currentchildquestions.push({
          "question_id": questions[i].question_id,
          "parent_id": questions[i].parent_id,
          "language_id": questions[i].language_id,
          "languages": questions[i].languages,
          "user_id": questions[i].user_id,
          "subject_id": questions[i].subject_id,
          "topic_id": questions[i].topic_id,
          "question_desc": questions[i].question_desc,
          "question_type": questions[i].question_type,
          "level": questions[i].level,
          "mark": questions[i].mark,
          "question_hints": questions[i].question_hints,
          "is_active": questions[i].is_active
        });
      }
    }

    this.currentquestions = this.shuffle(this.currentquestions); //randomize the current question
    localStorage.setItem('currentquestions', JSON.stringify(this.currentquestions));
    localStorage.setItem('currentchildquestions', JSON.stringify(this.currentchildquestions));
    localStorage.setItem('quiz_result_id', this.jsonservice.currentTimestamp());
  }

  back() {
    this.navCtrl.setRoot(AssessmentsPage); //back to assesment page
  }

  takeAssessment() {
    this.navCtrl.push(TakeAssessmentPage, { question_no: 1, quiz_id: this.quiz_id }); //back to take assesment page
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
