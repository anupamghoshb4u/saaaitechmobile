import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { Config } from '../config/config';

@Injectable()
export class SyncQuizService {
  private _syncquizURL = Config.URL+"mobile/quizresult/syncquizresult";

  constructor(private http: Http) { }
  syncquizresult(): Observable<any[]> {
    return this.http.post(this._syncquizURL, {
      quizresults: JSON.parse(localStorage.getItem('quizresults')),
      quizresultdetails: JSON.parse(localStorage.getItem('quizresultdetails')),
    }).map((response: Response) => {
      return <any[]>response.json();
    }).catch(this.handleError);
  } //sync the quiz results with live

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
