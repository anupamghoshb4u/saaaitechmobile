import { Component } from '@angular/core';
import { LoadingController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import * as $ from 'jquery';

import { AttemptsPage } from '../attempts/attempts';

import { QuestionsService } from '../../service/questions.service';
import { QuestionAnswersService } from '../../service/questionanswers.service';
import { QuizResultsService } from '../../service/quizresults.service';
import { QuizResultDetailsService } from '../../service/quizresultdetails.service';
import { SyncQuizService } from '../../service/syncquiz.service';

import { JsonService } from '../../service/json.service';

@Component({
  selector: 'page-takeassessment',
  templateUrl: 'takeassessment.html',
})

export class TakeAssessmentPage {
  course_id: number;
  quiz_id: number;
  quiz_name: string;
  quiz_time: number;
  is_allow_submit: string;
  is_review_later: boolean;
  language_id: number;
  question_no: number;
  question_count: number;
  question: any;
  currentquestions: any;
  questionanswers: any;
  question_answer_id: number;
  answer: string;
  question_start_date: number;
  total_attempt: number;
  not_attempted: number;
  is_correct: string;
  languages: any;
  childquestion: any;
  childquestionanswers: any;

  issubmit: boolean = false;

  geo_latitude: number = 0;
  geo_longitude: number = 0;

  interval;
  timediff: any;
  timer: any;


  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public network: Network,
    private geolocation: Geolocation,
    public questionsservice: QuestionsService,
    public questionanswersservice: QuestionAnswersService,
    public quizresultsservice: QuizResultsService,
    public quizresultdetailsservice: QuizResultDetailsService,
    public jsonservice: JsonService,
    public syncquizservice: SyncQuizService,
  ) {
    if (navParams.get("quiz_id") != '') {
      this.quiz_id = navParams.get("quiz_id");
    }

    if (navParams.get("question_no") != '') {
      this.question_no = navParams.get("question_no");
    }

    this.initializeQuiz();
    this.startTimer();
  }

  initializeQuiz() {
    this.question_start_date = (Math.floor(Date.now() / 1000)); //get question start time

    this.geolocation.getCurrentPosition().then((resp) => {
      this.geo_latitude = resp.coords.latitude;
      this.geo_longitude = resp.coords.longitude
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        title: 'Take Assessment',
        subTitle: 'Error getting location',
        buttons: ['OK']
      });
      alert.present(); //show message
    });

    let quizes = JSON.parse(localStorage.getItem('quizes'));

    for (let i = 0; i < quizes.length; i++) {
      if (quizes[i].quiz_id == this.quiz_id) {
        this.course_id = quizes[i].course_id;
        this.quiz_name = quizes[i].quiz_name;
        this.quiz_time = quizes[i].quiz_time;
        this.is_allow_submit = quizes[i].is_allow_submit;
      }
    } //get quiz name and time

    this.currentquestions = JSON.parse(localStorage.getItem('currentquestions'));
    this.question = this.currentquestions[this.question_no - 1]; //set the current question

    let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));

    this.question_count = 0;
    for (let i = 0; i < this.currentquestions.length; i++) {
      let param = {
        "quiz_result_id": localStorage.getItem('quiz_result_id'),
        "quiz_id": this.quiz_id,
        "question_id": this.currentquestions[i].question_id,
      };

      let count = this.quizresultdetailsservice.count(param); //check question_id is exist or not

      this.currentquestions[i] = {
        "question_id": this.currentquestions[i].question_id,
        "answered": (count != -1 ? ((quizresultdetails[count]['answer'] != '') ? '1' : '0') : '0'),
        "is_review_later": (count != -1 ? ((quizresultdetails[count]['is_review_later'] != '' && quizresultdetails[count]['is_review_later'] == 1) ? '1' : '0') : '0'),
        "language_id": this.currentquestions[i].language_id,
        "languages": this.currentquestions[i].languages,
        "childs": this.currentquestions[i].childs,
        "user_id": this.currentquestions[i].user_id,
        "subject_id": this.currentquestions[i].subject_id,
        "topic_id": this.currentquestions[i].topic_id,
        "question_desc": this.currentquestions[i].question_desc,
        "question_type": this.currentquestions[i].question_type,
        "level": this.currentquestions[i].level,
        "mark": this.currentquestions[i].mark,
        "question_hints": this.currentquestions[i].question_hints,
        "is_active": this.currentquestions[i].is_active
      }; //re-create currentquestions for the below question panel

      this.question_count++;
    } //get question count

    let questionanswers = JSON.parse(localStorage.getItem('questionanswers'));
    this.questionanswers = [];

    for (let i = 0; i < questionanswers.length; i++) {
      if (questionanswers[i].question_id == this.question.question_id) {
        this.questionanswers.push({
          "question_answer_id": questionanswers[i].question_answer_id,
          "question_id": questionanswers[i].question_id,
          "answer": questionanswers[i].answer,
          "is_correct": questionanswers[i].is_correct,
          "is_active": questionanswers[i].is_active,
        });
      }
    } //create questionanswers object

    let param1 = {
      "quiz_result_id": localStorage.getItem('quiz_result_id'),
    };

    let count1 = this.quizresultsservice.count(param1); //check quiz_result_id is exist or not


    if (localStorage.getItem('quiz_result_id') != '' && count1 == -1) {
      let param2 = {
        "quiz_result_id": localStorage.getItem('quiz_result_id'),
        "course_id": this.course_id,
        "quiz_id": this.quiz_id,
        "child_id": localStorage.getItem('child_id'),
        "quiz_start_date": (Math.floor(Date.now() / 1000)),
        "quiz_end_date": "",
        "geo_latitude": this.geo_latitude,
        "geo_longitude": this.geo_longitude,
        "capture_1": "",
        "capture_2": "",
        "capture_3": "",
        "is_completed": 0,
        "is_active": 1,
      };

      this.quizresultsservice.insert(param2);
    } //create quizresults json

    let param3 = {
      "quiz_result_id": localStorage.getItem('quiz_result_id'),
      "quiz_id": this.quiz_id,
      "question_id": this.question.question_id,
    };

    let count2 = this.quizresultdetailsservice.count(param3); //check quiz_result_id, quiz_id, question_id is exist or not

    if (count2 != -1) {
      this.question_answer_id = quizresultdetails[count2].question_answer_id;
      this.is_review_later = (quizresultdetails[count2].is_review_later != undefined &&  quizresultdetails[count2].is_review_later == '1'? true : false); //set the review later if it was otherwise to false everytime
    } //set the answer for the current question

    this.languages = this.question.languages; //get all the languages related with this question
  }

  nextQuestion() {
    this.prepareInsertUpdateQuestion();
    this.question_no = this.question_no + 1;
    this.initializeQuiz();

    if (this.language_id !== undefined && this.language_id !== null) {
      setTimeout(() => {
        this.changeLanguage(this.language_id);
      }, 1000);
    }
  }

  backQuestion() {
    this.prepareInsertUpdateQuestion();
    this.question_no = this.question_no - 1;
    this.initializeQuiz();

    if (this.language_id !== undefined && this.language_id !== null) {
      setTimeout(() => {
        this.changeLanguage(this.language_id);
      }, 1000);
    }
  }

  prepareInsertUpdateQuestion() {
    let questionanswers: any = JSON.parse(localStorage.getItem('questionanswers'));

    if (this.issubmit == true && this.question_answer_id != null) {
      let param1 = {
        "question_answer_id": this.question_answer_id,
      };
      let count1 = this.questionanswersservice.count(param1);

      this.answer = questionanswers[count1].answer;
      this.is_correct = questionanswers[count1].is_correct;
      this.insertUpdateQuestion();
    } else if (this.issubmit == false && this.question_answer_id != null) {
      let param1 = {
        "question_answer_id": this.question_answer_id,
      };
      let count1 = this.questionanswersservice.count(param1);

      this.answer = questionanswers[count1].answer;
      this.is_correct = questionanswers[count1].is_correct;
      this.insertUpdateQuestion();
    } else if (this.issubmit == false && this.question_answer_id == null) {
      this.answer = '';
      this.is_correct = '0';
      this.insertUpdateQuestion();
    }
  }

  insertUpdateQuestion() {
    let param2 = {
      "quiz_result_id": localStorage.getItem('quiz_result_id'),
      "quiz_id": this.quiz_id,
      "question_id": this.question.question_id,
    };

    let count2 = this.quizresultdetailsservice.count(param2); //check quiz_result_id, quiz_id, question_id is exist or not

    if (count2 == -1) {
      let param3 = {
        "quiz_result_id": localStorage.getItem('quiz_result_id'),
        "quiz_id": this.quiz_id,
        "question_id": this.question.question_id,
        "question_answer_id": this.question_answer_id,
        "answer": this.answer,
        "question_start_date": this.question_start_date,
        "question_end_date": (Math.floor(Date.now() / 1000)),
        "is_review_later": (this.is_review_later == false ? 0 : 1),
        "is_hint": 0,
        "is_correct": this.is_correct,
        "is_active": 1,
      };

      this.quizresultdetailsservice.insert(param3); //insert into quizresultdetails json
    } else {
      let param3 = {
        "quiz_result_id": localStorage.getItem('quiz_result_id'),
        "quiz_id": this.quiz_id,
        "question_id": this.question.question_id,
        "question_answer_id": this.question_answer_id,
        "answer": this.answer,
        "is_review_later": (this.is_review_later == false ? 0 : 1),
        "is_hint": 0,
        "is_correct": this.is_correct,
        "is_active": 1,
      };

      this.quizresultdetailsservice.update(param3, count2); //insert into quizresultdetails json
    }

    this.question_answer_id = null;
  }

  submitQuiz() {
    this.issubmit = true;
    this.prepareInsertUpdateQuestion();
    this.getCount();

    if (this.is_allow_submit == '1') {
      if (this.question_count == this.total_attempt) {
        const confirm = this.alertCtrl.create({
          title: 'Take Assessment',
          message: 'You have attempted ' + this.total_attempt + ' questions and not attempted ' + this.not_attempted + ' questions yet. Are you sure you want to submit this exam?',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.doSubmit();
              }
            },
            {
              text: 'Cancel',
            }
          ]
        });
        confirm.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Take Assessment',
          subTitle: 'You can not submit the quiz unless you will attempt all questions',
          buttons: ['OK']
        });
        alert.present(); //show message
      }
    } else {
      const confirm = this.alertCtrl.create({
        title: 'Take Assessment',
        message: 'You have attempted ' + this.total_attempt + ' questions and not attempted ' + this.not_attempted + ' questions yet. Are you sure you want to submit this exam?',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.doSubmit();
            }
          },
          {
            text: 'Cancel',
          }
        ]
      });
      confirm.present();
    }
  }

  getCount() {
    let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));
    this.total_attempt = 0;

    if (quizresultdetails !== null) {
      for (let i = 0; i < quizresultdetails.length; i++) {
        if (quizresultdetails[i].quiz_result_id == localStorage.getItem('quiz_result_id') && quizresultdetails[i].answer != '')
          this.total_attempt++;
      }
      this.not_attempted = (this.question_count - this.total_attempt);
    }
  }

  doSubmit() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Assessment is saving...'
    });
    loading.present();

    setTimeout(() => {
      loading.dismiss();

      let param = {
        "quiz_result_id": localStorage.getItem('quiz_result_id'),
      };

      let count = this.quizresultsservice.count(param); //check quiz_result_id is exist or not

      if (count != -1) {
        let quizresults: any = JSON.parse(localStorage.getItem('quizresults'));

        let param = {
          "quiz_result_id": localStorage.getItem('quiz_result_id'),
          "course_id": this.course_id,
          "quiz_id": this.quiz_id,
          "child_id": localStorage.getItem('child_id'),
          "quiz_start_date": quizresults[count].quiz_start_date,
          "quiz_end_date": (Math.floor(Date.now() / 1000)),
          "geo_latitude": this.geo_latitude,
          "geo_longitude": this.geo_longitude,
          "capture_1": "",
          "capture_2": "",
          "capture_3": "",
          "is_completed": (this.not_attempted > 0 ? '0' : '1'),
          "is_active": 1,
        };

        this.quizresultsservice.update(param, count);
      }

      this.syncQuiz();
    }, 4000);
    this.issubmit = false;
  }

  startTimer() {
    let start_time = new Date().getTime() + (this.quiz_time * 60 * 1000); // Get start time

    this.interval = setInterval(() => {
      let end_time = new Date().getTime(); // Get end time

      this.timediff = start_time - end_time;

      let hours = Math.floor((this.timediff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((this.timediff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((this.timediff % (1000 * 60)) / 1000); // Time calculations for days, hours, minutes and seconds

      this.timer = hours + "h " + minutes + "m " + seconds + "s ";

      if (this.timediff > 0) {
        this.timediff--;
      } else {
        const alert = this.alertCtrl.create({
          title: 'Take Assessment',
          subTitle: 'Time is up!',
          buttons: ['OK']
        });
        alert.present(); //show message

        this.doSubmit();
        clearInterval(this.interval);
      }
    }, 1000);
  }

  syncQuiz() {
    if (navigator.onLine == true) { //when the network is online
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

          this.navCtrl.setRoot(AttemptsPage);
        } //sync the quiz when the user is online
      });
    } else {
      localStorage.setItem('currentquestions', '');
      localStorage.removeItem('currentquestions');
      localStorage.setItem('quiz_result_id', '');
      localStorage.removeItem('quiz_result_id');

      this.navCtrl.setRoot(AttemptsPage); //save the quiz when the user is in offline
    }
  }

  changeLanguage($event) {
    if ($event !== undefined && $event !== null) {
      if ($event == '1') {
        $('#question_desc').html(this.question.question_desc);
        $('#answer_0').html(this.questionanswers[0].answer);
        $('#answer_1').html(this.questionanswers[1].answer);
        $('#answer_2').html(this.questionanswers[2].answer);
        $('#answer_3').html(this.questionanswers[3].answer);
      } else {
        let currentchildquestions = JSON.parse(localStorage.getItem('currentchildquestions'));
        let questionanswers = JSON.parse(localStorage.getItem('questionanswers'));

        for (let i = 0; i < currentchildquestions.length; i++) {
          if (currentchildquestions[i].parent_id == this.question.question_id && currentchildquestions[i].parent_id != '0' && currentchildquestions[i].language_id == $event) {
            this.childquestion = currentchildquestions[i];
          }
        }

        this.childquestionanswers = [];

        for (let i = 0; i < questionanswers.length; i++) {
          if (questionanswers[i].question_id == this.childquestion.question_id) {
            this.childquestionanswers.push({
              "question_answer_id": questionanswers[i].question_answer_id,
              "question_id": questionanswers[i].question_id,
              "answer": questionanswers[i].answer,
              "is_correct": questionanswers[i].is_correct,
              "is_active": questionanswers[i].is_active,
            });
          }
        } //create questionanswers object

        $('#question_desc').html(this.childquestion.question_desc);
        $('#answer_0').html(this.childquestionanswers[0].answer);
        $('#answer_1').html(this.childquestionanswers[1].answer);
        $('#answer_2').html(this.childquestionanswers[2].answer);
        $('#answer_3').html(this.childquestionanswers[3].answer);
      }
    }
  }

  goToQuestion(index) {
    this.question_no = index;
    this.nextQuestion();
  }
}

