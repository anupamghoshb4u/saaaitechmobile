import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { JsonService } from '../service/json.service';
import { Config } from '../config/config';

@Injectable()
export class QuizesService {
  private _quizURL: string;
  constructor(private http: Http, private jsonservice: JsonService) { }

  get(child_id): Observable<any[]> {
    this._quizURL = Config.URL + "mobile/quizzes/get?child_id=" + child_id;

    return this.http.get(this._quizURL).map((response: Response) => {
      return <any[]>response.json();
    }).catch(this.handleError);
  } //check the login details with live

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

  public insert(param) {
    let quizes = [];

    if (localStorage.getItem('quizes') != null) {
      quizes = JSON.parse(localStorage.getItem('quizes'));

      for (let i = 0; i < param.length; i++) {
        quizes.push({
          "quiz_id": param[i].quiz_id,
          "course_id": param[i].course_id,
          "quiz_name": param[i].quiz_name,
          "quiz_type": param[i].quiz_type,
          "quiz_desc": param[i].quiz_desc,
          "quiz_time": param[i].quiz_time,
          "is_allow_submit": param[i].is_allow_submit,
          "is_active": param[i].is_active,
        });
      }

      quizes = this.jsonservice.arrayUnique(quizes);
    } else {
      for (let i = 0; i < param.length; i++) {
        quizes[i] = {
          "quiz_id": param[i].quiz_id,
          "course_id": param[i].course_id,
          "quiz_name": param[i].quiz_name,
          "quiz_type": param[i].quiz_type,
          "quiz_desc": param[i].quiz_desc,
          "quiz_time": param[i].quiz_time,
          "is_allow_submit": param[i].is_allow_submit,
          "is_active": param[i].is_active,
        };
      }
    }

    localStorage.setItem('quizes', JSON.stringify(quizes)); //save the courses json in local storage
  }
}
