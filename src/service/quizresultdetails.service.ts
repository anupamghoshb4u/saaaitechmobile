import { Injectable } from '@angular/core';
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { JsonService } from '../service/json.service';

@Injectable()
export class QuizResultDetailsService {
  constructor(private jsonservice: JsonService) { }

  public count(param) {
    let count: number = -1;
    let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));

    if (quizresultdetails !== null) {
      for (let i = 0; i < quizresultdetails.length; i++) {
        if (param.quiz_result_id != undefined && param.quiz_id != undefined && param.question_id != undefined) {
          if (quizresultdetails[i].quiz_result_id == param.quiz_result_id && quizresultdetails[i].quiz_id == param.quiz_id && quizresultdetails[i].question_id == param.question_id) {
            count = i;
          }
        }
      }
    }
    return count;
  }

  public insert(param) {
    let count;
    let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));

    if (quizresultdetails != null) {
      count = quizresultdetails.length;
    } else {
      count = 0;
      quizresultdetails = [];
    }

    quizresultdetails[count] = {
      "quiz_result_id": param.quiz_result_id,
      "quiz_id": param.quiz_id,
      "question_id": param.question_id,
      "question_answer_id": param.question_answer_id,
      "answer": param.answer,
      "question_start_date": param.question_start_date,
      "question_end_date": param.question_end_date,
      "is_review_later": param.is_review_later,
      "is_hint": param.is_hint,
      "is_correct": param.is_correct,
      "is_active": param.is_active,
    };

    quizresultdetails = this.jsonservice.arrayUnique(quizresultdetails);
    localStorage.setItem('quizresultdetails', JSON.stringify(quizresultdetails)); //save the quizresultdetails json in local storage
  }

  public update(param, index) {
    let quizresultdetails: any = JSON.parse(localStorage.getItem('quizresultdetails'));

    quizresultdetails[index] = {
      "quiz_result_id": param.quiz_result_id,
      "quiz_id": param.quiz_id,
      "question_id": param.question_id,
      "question_answer_id": param.question_answer_id,
      "answer": param.answer,
      "question_start_date": quizresultdetails[index].question_start_date,
      "question_end_date": quizresultdetails[index].question_end_date,
      "is_review_later": param.is_review_later,
      "is_hint": param.is_hint,
      "is_correct": param.is_correct,
      "is_active": param.is_active,
    };

    quizresultdetails = this.jsonservice.arrayUnique(quizresultdetails);
    localStorage.setItem('quizresultdetails', JSON.stringify(quizresultdetails)); //save the quizresultdetails json in local storage
  }
}
