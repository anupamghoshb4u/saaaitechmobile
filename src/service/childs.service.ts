import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import 'rxjs/add/operator/catch';

import { Config } from '../config/config';

@Injectable()
export class ChildsService {
  private _childURL = Config.URL + "mobile/childs/login";
  constructor(private http: Http) { }

  public checkLogin(param): Observable<any[]> {
    return this.http.post(this._childURL, {
      user_name: param.user_name,
      password: param.password,
    }).map((response: Response) => {
      return <any[]>response.json();
    }).catch(this.handleError);
  } //check the login details with live

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }

  public count(param) {
    let count: number = -1;
    let data: any = JSON.parse(localStorage.getItem('childs'));

    for (let i = 0; i < data.childs.length; i++) {
      if (param.user_name != undefined && param.password != undefined) {
        if (data.childs[i].user_name == param.user_name && data.childs[i].password == param.password) {
          count = i;
        }
      } else if (param.child_id != undefined) {
        if (data.childs[i].child_id == param.child_id) {
          count = i;
        }
      }
    }
    return count;
  }

  public insert(param) {
    let data: any = JSON.parse(localStorage.getItem('childs'));

    for (let i = 0; i < param.length; i++) {
      data.childs.push({
        "child_id": param[i].child_id,
        "parent_id": param[i].parent_id,
        "parent_name": param[i].parent_name,
        "child_name": param[i].child_name,
        "email_address": param[i].email_address,
        "user_name": param[i].user_name,
        "password": param[i].password,
        "pass_start_time": param[i].pass_start_time,
        "pass_end_time": param[i].pass_end_time,
        "last_login_time": param[i].last_login_time,
        "signup_time": param[i].signup_time,
        "is_active": param[i].is_active,
      });
    }

    localStorage.setItem('childs', JSON.stringify(data)); //save the childs json in local storage
  }
}
