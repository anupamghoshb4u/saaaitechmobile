import { Injectable } from '@angular/core';

import { JsonService } from '../service/json.service';

@Injectable()
export class QuestionAnswersService {
  constructor(private jsonservice: JsonService) { }

  public count(param) {
    let count: number = -1;
    let questionanswers: any = JSON.parse(localStorage.getItem('questionanswers'));

    for (let i = 0; i < questionanswers.length; i++) {
      if (param.question_answer_id != undefined) {
        if (questionanswers[i].question_answer_id == param.question_answer_id) {
          count = i;
        }
      }
    }
    return count;
  }

  public insert(param) {
    let questionanswers = [];

    if (localStorage.getItem('questionanswers') != null) {
      questionanswers = JSON.parse(localStorage.getItem('questionanswers'));

      for (let i = 0; i < param.length; i++) {
        questionanswers.push({
          "question_answer_id": param[i].question_answer_id,
          "question_id": param[i].question_id,
          "answer": param[i].answer,
          "is_correct": param[i].is_correct,
          "is_active": param[i].is_active,
        });
      }

      questionanswers = this.jsonservice.arrayUnique(questionanswers);
    } else {
      for (let i = 0; i < param.length; i++) {
        questionanswers[i] = {
          "question_answer_id": param[i].question_answer_id,
          "question_id": param[i].question_id,
          "answer": param[i].answer,
          "is_correct": param[i].is_correct,
          "is_active": param[i].is_active,
        };
      }
    }

    localStorage.setItem('questionanswers', JSON.stringify(questionanswers)); //save the questionanswers json in local storage
  }
}
