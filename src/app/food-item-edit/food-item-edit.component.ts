import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { FoodItem } from '../models/food-item';
import { allowedImageExtensions, FoodItemModel } from '../models/food-item-model';
import { Subject, takeUntil } from 'rxjs';
import { LogService } from '../services/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-food-item-edit',
  templateUrl: './food-item-edit.component.html',
  styleUrls: ['./food-item-edit.component.css']
})
export class FoodItemEditComponent implements OnInit {
  foodItemForm: FormGroup;
  foodItem!: FoodItem;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private logService:LogService
  ) {
    this.foodItemForm = this.formBuilder.group(FoodItemModel.validationRules);
  }

  ngOnInit(): void {
    const foodItemId = +this.route.snapshot.paramMap.get('id')!;
    this.menuService.getFoodItem(foodItemId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (foodItem: FoodItem) => {
          this.foodItem = foodItem;
          this.foodItemForm.patchValue(foodItem);
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.getFoodItemError, error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    if (this.foodItemForm.invalid) {
      return;
    }

    const updatedFoodItem: FoodItem = { ...this.foodItem, ...this.foodItemForm.value };

    this.menuService.updateFoodItem(updatedFoodItem)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          this.logService.logErrorWithDetails(environment.messages.editFoodItemError, error);
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
