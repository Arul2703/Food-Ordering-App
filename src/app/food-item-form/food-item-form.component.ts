import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FoodItemModel } from '../models/food-item-model';
import { MenuService } from '../services/menu.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogService } from '../services/log.service';
@Component({
  selector: 'app-food-item-form',
  templateUrl: './food-item-form.component.html',
  styleUrls: ['./food-item-form.component.css']
})
export class FoodItemFormComponent implements OnInit {
  foodItemForm: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,private menuService: MenuService,private logService:LogService) {
    this.foodItemForm = this.formBuilder.group(FoodItemModel.validationRules);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    if (this.foodItemForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.foodItemForm.get('name')?.value);
    formData.append('price', this.foodItemForm.get('price')?.value);
    formData.append('description', this.foodItemForm.get('description')?.value);
    formData.append('image', this.foodItemForm.get('image')?.value);
    formData.append('category', this.foodItemForm.get('category')?.value);
    formData.append('isVegan', this.foodItemForm.get('isVegan')?.value);
    formData.append('calories', this.foodItemForm.get('calories')?.value);

    this.menuService
      .addFoodItem(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.addFoodItemError, error);
        }
      );
  }

  handleImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    this.foodItemForm.patchValue({ image: file });
    this.foodItemForm.get('image')?.updateValueAndValidity();
  }
  
}
