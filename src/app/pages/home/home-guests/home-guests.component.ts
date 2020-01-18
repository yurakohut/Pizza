import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IGuest } from 'src/app/shared/interfaces/guest.interface';
import { GuestService } from 'src/app/shared/services/guest.service';
import Swiper from 'swiper';
import { IType } from 'src/app/shared/interfaces/type.interface';
// declare const Swiper: any;

@Component({
  selector: 'app-home-guests',
  templateUrl: './home-guests.component.html',
  styleUrls: ['./home-guests.component.css']
})
export class HomeGuestsComponent implements OnInit, AfterViewInit {
  mySwiper: any;
  guests: Array<IGuest> = [];
  mainType: IType;
  mainTypeHTML: string;
  constructor(private guestService: GuestService) { }

  ngOnInit() {
    this.guestService.getData().subscribe(actionArray => {
      this.guests = actionArray.map(guests => {
        return {
          id: guests.payload.doc.id,
          ...guests.payload.doc.data()
        };
      });
    });
    this.guestService.getType().subscribe(actionArray => {
      this.mainType = actionArray.map(type => {
        return {
          id: type.payload.doc.id,
          ...type.payload.doc.data()
        };
      });
      this.mainTypeHTML = this.mainType[0].name;
    });
  };
  ngAfterViewInit(): void {
    this.mySwiper = new Swiper('.swiper-container', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      updateOnWindowResize: true,
      initialSlide: 2,
      observer: true,
      observeParents: true,
      coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
    });
  };
}
