import { Injectable } from '@angular/core';

@Injectable()
export class JsonService {
  constructor() { }

  public arrayUnique(arr) {
    let uniques = [];
    let itemsFound = {};

    for (let i = 0; i < arr.length; i++) {
      let stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) {
        continue;
      }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  public currentTimestamp() {
    return (String)(Math.floor(Date.now() / 1000));
  }
}
