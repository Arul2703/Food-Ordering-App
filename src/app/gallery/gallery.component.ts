import { Component } from '@angular/core';
import { FoodItem } from '../models/food-item';
import { Subscription } from 'rxjs';
import { MenuService } from '../services/menu.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  galleryItems: FoodItem[] = [];
  private gallerySubscription: Subscription | undefined;

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.fetchGalleryItems();
  }

  fetchGalleryItems(): void {
    this.gallerySubscription = this.menuService.getGalleryItems().subscribe(
      (items: FoodItem[]) => {
        this.galleryItems = items;
      },
      (error: any) => {
        // Handle error here (e.g., show error message)
      }
    );
  }

  getBase64Image(base64String: string): string {
    console.log(environment.userProfileFields.base64Prefix + base64String);
    return environment.userProfileFields.base64Prefix + base64String;
  }

  ngOnDestroy(): void {
    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }
  }
}
