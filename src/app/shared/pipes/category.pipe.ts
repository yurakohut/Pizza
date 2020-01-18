import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(arr: any, searchCategory: string): any {
    return arr.filter(products => products.category === searchCategory);
  }

}
