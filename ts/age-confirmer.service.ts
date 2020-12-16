import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgeConfirmerService {

  STORAGE_KEY = 'po-age-confirm';
  STORAGE_VALUE = 'true';

  constructor() {
    //
  }

  confirm(): void {
    localStorage.setItem(this.STORAGE_KEY, this.STORAGE_VALUE);
  }

  isConfirmed(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === this.STORAGE_VALUE;
  }

}
