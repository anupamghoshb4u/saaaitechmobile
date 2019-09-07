import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { IntroPage } from '../../pages/intro/intro';

import { CoursesService } from '../../service/courses.service';
import { QuizesService } from '../../service/quizes.service';
import { QuestionsService } from '../../service/questions.service';
import { QuestionAnswersService } from '../../service/questionanswers.service';
import { SyncQuizService } from '../../service/syncquiz.service';

import { JsonService } from '../../service/json.service';

@Component({
  selector: 'page-assessments',
  templateUrl: 'assessments.html'
})
export class AssessmentsPage {
  assessments: any;

  geo_ip: string = '';
  geo_country: string = '';
  geo_region: string = '';
  geo_city: string = '';

  constructor(
    public cousesservice: CoursesService,
    public quizesservice: QuizesService,
    public questionsservice: QuestionsService,
    public questionanswersservice: QuestionAnswersService,
    public jsonservice: JsonService,
    public syncquizservice: SyncQuizService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public network: Network,
  ) {
    if (navigator.onLine == true) { //when the network is online
      this.downloadCourses();
    }
    else {
      this.getAssessmentList();
    }

    this.syncQuiz();
  }

  downloadCourses() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Courses are downloading...'
    });
    loading.present();

    setTimeout(() => {
      this.cousesservice.get(localStorage.getItem('child_id')).subscribe((ret: any) => {
        loading.dismiss();
        this.cousesservice.insert(ret.data.courses); //insert into courses json

        this.downloadQuizzes();
      });
    }, 3000);
  }

  downloadQuizzes() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Assessments are downloading...'
    });
    loading.present();

    setTimeout(() => {
      this.quizesservice.get(localStorage.getItem('child_id')).subscribe((ret: any) => {
        loading.dismiss();
        this.quizesservice.insert(ret.data.quizes); //insert into quizes json

        this.downloadQuestions();
      });
    }, 3000);
  }

  downloadQuestions() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Questions are downloading...'
    });
    loading.present();

    setTimeout(() => {
      loading.dismiss();
      let courses = JSON.parse(localStorage.getItem('courses'));
      let quizes = JSON.parse(localStorage.getItem('quizes'));

      for (let i = 0; i < courses.length; i++) {
        if (courses[i].child_id == localStorage.getItem('child_id')) {
          for (let j = 0; j < quizes.length; j++) {
            if (quizes[j].course_id == courses[i].course_id) {
              this.questionsservice.get(quizes[j].quiz_id).subscribe((ret: any) => {
                this.questionsservice.insert(ret.data.questions, quizes[j].quiz_id); //insert into questions json
                this.questionanswersservice.insert(ret.data.questionanswers); //insert into questionanswers json
              });
            }
          }
        }
      }

      this.getAssessmentList();
    }, 3000);
  }


  getAssessmentList() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Assessments are loading.....'
    });
    loading.present();

    setTimeout(() => {
      let courses = JSON.parse(localStorage.getItem('courses'));
      let quizes = JSON.parse(localStorage.getItem('quizes'));

      if (quizes.length > 0) {
        this.assessments = [];

        for (let i = 0; i < courses.length; i++) {
          if (courses[i].child_id == localStorage.getItem('child_id')) {
            for (let j = 0; j < quizes.length; j++) {
              if (quizes[j].course_id == courses[i].course_id) {
                this.assessments.push({
                  "quiz_id": quizes[j].quiz_id,
                  "quiz_name": quizes[j].quiz_name,
                  "quiz_desc": quizes[j].quiz_desc,
                  "quiz_time": quizes[j].quiz_time,
                });
              }
            }
          }
        }
      }

      loading.dismiss();
    }, 3000);
  }

  takeAssessment(quiz_id: number) {
    this.navCtrl.setRoot(IntroPage, { quiz_id: quiz_id });
  }

  syncQuiz() {
    if (navigator.onLine == true) {  //when the network is online
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
