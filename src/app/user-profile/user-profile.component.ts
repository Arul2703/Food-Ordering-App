import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { UserProfile } from '../models/user-profile';
import { AuthService } from '../services/auth.service';
import { UserProfileModel } from '../models/user-profile-model';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { LogService } from '../services/log.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate(500)),
    ])
  ]
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  userProfileModel!: UserProfileModel;
  profilePictureUrl!: string;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  name:string = environment.userProfileFields.name;
  email:string = environment.userProfileFields.email;
  mobileNumber:string = environment.userProfileFields.mobileNumber;
  address:string = environment.userProfileFields.address;
  pincode:string = environment.userProfileFields.pincode;
  profilePicture:string = environment.userProfileFields.profilePicture;
  userid:string = environment.userProfileFields.userid;
  profileId:string = environment.userProfileFields.profileId;
  base64:string = environment.userProfileFields.base64Prefix;
  profilePictureInput:string = environment.userProfileFields.profilePictureInput;

  private unsubscribe$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public authService: AuthService,
    private logService : LogService
  ) {
    // this.userProfileForm = this.fb.group({
    //   name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   mobileNumber: [''],
    //   address: [''],
    //   pincode: [''],
    //   profilePicture: [null]
    // });
    this.userProfileModel = new UserProfileModel();
    this.userProfileForm = this.fb.group(UserProfileModel.getValidationRules());
  }

  

  ngOnInit(): void {
    this.fetchUserProfile();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.userId;
    if (userId !== undefined) {
      this.accountService.getUserProfile(userId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (response: UserProfileModel) => {
            this.userProfileModel = response;
            this.userProfileForm.patchValue({
              name: this.userProfileModel.name,
              email: this.userProfileModel.email,
              mobileNumber: this.userProfileModel.mobileNumber,
              address: this.userProfileModel.address,
              pincode: this.userProfileModel.pincode
            });
            this.fetchProfilePicture();
          },
          (error) => {
            this.logService.logErrorWithDetails(environment.messages.userProfileFetchFailed, error);
          }
        );
    } else {
      this.logService.logErrorWithDetails(environment.messages.useridUndefined, null);
    }
  }

  fetchProfilePicture(): void {
    console.log(this.userProfileModel.profilePicture);
    if (this.userProfileModel.profilePicture) {
      this.profilePictureUrl = this.base64 + this.userProfileModel.profilePicture;
    }
  }

  selectProfilePicture(): void {
    const fileInput = document.getElementById(this.profilePictureInput) as HTMLInputElement;
    fileInput.click();
  }

  onProfilePictureChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePictureUrl = reader.result as string;
        this.userProfileForm.patchValue({ profilePicture: file }); 
      };
      reader.readAsDataURL(file);
    }
  }

  updateUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.userId;
    if (this.userProfileForm.valid) {
      const formData = new FormData();
      formData.append(this.profileId, this.userProfileModel.profileId.toString());
      if (userId) {
        formData.append(this.userid, userId.toString());
      }
      
      formData.append(this.name, this.userProfileForm.value.name);
      formData.append(this.email, this.userProfileForm.value.email);
      formData.append(this.mobileNumber, this.userProfileForm.value.mobileNumber);
      formData.append(this.address, this.userProfileForm.value.address);
      formData.append(this.pincode, this.userProfileForm.value.pincode.toString());
      if (this.userProfileForm.value.profilePicture) {
        formData.append(this.profilePicture, this.userProfileForm.value.profilePicture, this.userProfileForm.value.profilePicture.name);
      }

      this.accountService.updateUserProfile(formData).pipe(takeUntil(this.unsubscribe$)).subscribe(
        (response: any) => {
          if (response && response.ProfilePicture) {
            this.profilePictureUrl = this.base64+ response.ProfilePicture;
          }
          this.fetchUserProfile();
          this.successMessage = environment.messages.userProfileSuccess;
          setTimeout(() => {
            this.successMessage = null;
          }, 1000);
          this.errorMessage = null;
        },
        (error: any) => {
          this.errorMessage = environment.messages.updateUserProfileError;
          this.logService.logErrorWithDetails(environment.messages.updateUserProfileError, error);
          setTimeout(() => {
            this.errorMessage = null;
          }, 1000);
          this.successMessage = null;
        }
      );
    }
  }
}
