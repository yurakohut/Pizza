import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private pageStream = new BehaviorSubject<number>(1);
  currentPage = this.pageStream.asObservable();
  constructor() { }
  changePage(page: number) {
    this.pageStream.next(page);
  }
}
