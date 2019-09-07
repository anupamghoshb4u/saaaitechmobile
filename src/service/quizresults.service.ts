import { Injectable } from '@angular/core';

import { JsonService } from '../service/json.service';

@Injectable()
export class QuizResultsService {
  constructor(private jsonservice: JsonService) { }

  public count(param) {
    let count: number = -1;
    let quizresults: any = JSON.parse(localStorage.getItem('quizresults'));

    if (quizresults !== null) {
      for (let i = 0; i < quizresults.length; i++) {
        if (param.quiz_result_id != undefined) {
          if (quizresults[i].quiz_result_id == param.quiz_result_id) {
            count = i;
          }
        }
      }
    }
    return count;
  }

  public insert(param) {
    let count;
    let quizresults: any = JSON.parse(localStorage.getItem('quizresults'));

    if (quizresults != null) {
      count = quizresults.length;
    } else {
      count = 0;
      quizresults = [];
    }

    quizresults[count] = {
      "quiz_result_id": param.quiz_result_id,
      "course_id": param.course_id,
      "quiz_id": param.quiz_id,
      "child_id": param.child_id,
      "quiz_start_date": param.quiz_start_date,
      "quiz_end_date": param.quiz_end_date,
      "geo_latitude": param.geo_latitude,
      "geo_longitude": param.geo_longitude,
      "capture_1": param.capture_1,
      "capture_2": param.capture_2,
      "capture_3": param.capture_3,
      "is_completed": param.is_completed,
      "is_active": param.is_active,
    };

    quizresults = this.jsonservice.arrayUnique(quizresults);
    localStorage.setItem('quizresults', JSON.stringify(quizresults)); //save the quizresults json in local storage
  }

  public update(param, index) {
    let quizresults: any = JSON.parse(localStorage.getItem('quizresults'));

    quizresults[index] = {
      "quiz_result_id": param.quiz_result_id,
      "course_id": param.course_id,
      "quiz_id": param.quiz_id,
      "child_id": param.child_id,
      "quiz_start_date": param.quiz_start_date,
      "quiz_end_date": param.quiz_end_date,
      "geo_latitude": param.geo_latitude,
      "geo_longitude": param.geo_longitude,
      "capture_1": param.capture_1,
      "capture_2": param.capture_2,
      "capture_3": param.capture_3,
      "is_completed": param.is_completed,
      "is_active": param.is_active,
    };

    quizresults = this.jsonservice.arrayUnique(quizresults);
    localStorage.setItem('quizresults', JSON.stringify(quizresults)); //save the quizresults json in local storage
  }
}
