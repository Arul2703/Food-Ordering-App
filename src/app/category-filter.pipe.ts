import { Pipe, PipeTransform } from '@angular/core';
import { FoodItem } from './models/food-item';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {
  transform(items: FoodItem[], selectedCategory: string): FoodItem[] {
    if (!items) {
      return [];
    }
    
    if (!selectedCategory || selectedCategory === 'All') {
      return items;
    }
    
    return items.filter(item => item.category === selectedCategory);
  }
}
