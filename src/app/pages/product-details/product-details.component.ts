import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductDetailsService } from 'src/app/shared/services/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  products: Array<IProduct>;
  productName: string;
  productCategory: string;
  products1: Array<IProduct>;
  test: IProduct;
  oneProduct: Array<IProduct>;
  constructor(private productService: ProductDetailsService, private route: ActivatedRoute, private location: Location) {
    this.getProduct()
  }

  ngOnInit() {
  }
  private getProduct(): void {
    this.productName = this.route.snapshot.paramMap.get('name');
    this.productCategory = this.route.snapshot.paramMap.get('category');
    this.productService.getData().subscribe(actionArray => {
      this.products = actionArray.map(products => {
        return {
          id: products.payload.doc.id,
          ...products.payload.doc.data()
        };
      });
      this.oneProduct = this.products.filter(product => product.category === this.productCategory && product.name === this.productName);

    });
  };
  
  goBack(): void {
    this.location.back();
  };
}
