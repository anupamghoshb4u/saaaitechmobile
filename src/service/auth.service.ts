import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() { }

  setSession(data) {
    localStorage.setItem("child_id", data.child_id);
    localStorage.setItem("child_name", data.child_name);
  }

  getChildID() {
    return localStorage.getItem("child_id");
  }

  getChildName() {
    return localStorage.getItem("child_name");
  }

  isLoggednIn() {
    return this.getChildID() !== null;
  }
}
