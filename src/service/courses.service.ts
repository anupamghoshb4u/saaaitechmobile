import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { JsonService } from '../service/json.service';
import { Config } from '../config/config';

@Injectable()
export class CoursesService {
  private _courseURL: string;
  constructor(private http: Http, private jsonservice: JsonService) { }

  get(child_id): Observable<any[]> {
    this._courseURL = Config.URL + "mobile/courses/get?child_id=" + child_id;

    return this.http.get(this._courseURL).map((response: Response) => {
      return <any[]>response.json();
    }).catch(this.handleError);
  } //check the login details with live

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

  public insert(param) {
    let courses = [];

    if (localStorage.getItem('courses') !== null) {
      courses = JSON.parse(localStorage.getItem('courses'));

      for (let i = 0; i < param.length; i++) {
        courses.push({
          "course_id": param[i].course_id,
          "child_id": param[i].child_id,
          "course_name": param[i].course_name,
          "course_short_desc": param[i].course_short_desc,
          "course_long_desc": param[i].course_long_desc,
          "course_price": param[i].course_price,
          "start_date": param[i].start_date,
          "end_date": param[i].end_date,
          "is_published": param[i].is_published,
          "is_active": param[i].is_active,
        });
      }

      courses = this.jsonservice.arrayUnique(courses);
    } else {
      for (let i = 0; i < param.length; i++) {
        courses[i] = {
          "course_id": param[i].course_id,
          "child_id": param[i].child_id,
          "course_name": param[i].course_name,
          "course_short_desc": param[i].course_short_desc,
          "course_long_desc": param[i].course_long_desc,
          "course_price": param[i].course_price,
          "start_date": param[i].start_date,
          "end_date": param[i].end_date,
          "is_published": param[i].is_published,
          "is_active": param[i].is_active,
        };
      }
    }

    localStorage.setItem('courses', JSON.stringify(courses)); //save the courses json in local storage
  }
}
