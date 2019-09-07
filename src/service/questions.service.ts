import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { JsonService } from '../service/json.service';

import { Config } from '../config/config';

@Injectable()
export class QuestionsService {
  public _questionURL: string;
  constructor(private http: Http, private jsonservice: JsonService) { }

  get(quiz_id): Observable<any[]> {
    this._questionURL = Config.URL + "mobile/questions/get?quiz_id=" + quiz_id;

    return this.http.get(this._questionURL).map((response: Response) => {
      return <any[]>response.json();
    }).catch(this.handleError);
  } //fetch the questions/answers details from live

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

  public insert(param, quiz_id) {
    let questions = [];

    if (localStorage.getItem('questions') != null) {
      questions = JSON.parse(localStorage.getItem('questions'));

      for (let i = 0; i < param.length; i++) {
        questions.push({
          "question_id": param[i].question_id,
          "quiz_id": quiz_id,
          "parent_id": param[i].parent_id,
          "language_id": param[i].language_id,
          "languages": param[i].languages,
          "user_id": param[i].user_id,
          "question_desc": param[i].question_desc.replace(new RegExp('/uploads/fckeditor/', 'g'), 'assets/uploads/fckeditor/'),
          "question_type": param[i].question_type,
          "level": param[i].level,
          "mark": param[i].mark,
          "question_hints": param[i].question_hints,
          "is_active": param[i].is_active,
        });
      }

      questions = this.jsonservice.arrayUnique(questions);
    } else {
      for (let i = 0; i < param.length; i++) {
        questions[i] = {
          "question_id": param[i].question_id,
          "quiz_id": quiz_id,
          "parent_id": param[i].parent_id,
          "language_id": param[i].language_id,
          "languages": param[i].languages,
          "user_id": param[i].user_id,
          "question_desc": param[i].question_desc.replace(new RegExp('/uploads/fckeditor/', 'g'), 'assets/uploads/fckeditor/'),
          "question_type": param[i].question_type,
          "level": param[i].level,
          "mark": param[i].mark,
          "question_hints": param[i].question_hints,
          "is_active": param[i].is_active,
        };
      }
    }

    localStorage.setItem('questions', JSON.stringify(questions)); //save the questions json in local storage
  }
}
