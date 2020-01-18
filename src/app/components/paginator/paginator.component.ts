import { Component, OnInit } from '@angular/core';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  page: number;
  constructor(private paginatorService: PaginatorService, private route: Router) { }

  ngOnInit() {
    this.paginatorService.currentPage.subscribe(page => this.page = page);
  }
  changePage(event): void {
    this.paginatorService.changePage(event);
  }

}
