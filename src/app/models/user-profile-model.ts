// export class UserProfileModel {
//   profileId!: number;
//   userid: number | undefined;
//   name!: string;
//   email!: string;
//   mobileNumber!: string;
//   address!: string;
//   pincode!: number;
//   profilePicture!: string;
// }
import { Validators } from '@angular/forms';

export class UserProfileModel {
  profileId!: number;
  userid: number | undefined;
  name!: string;
  email!: string;
  mobileNumber!: string;
  address!: string;
  pincode!: number;
  profilePicture!: string;

  static getValidationRules(): { [key: string]: any } {
    return {
      name: ['', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]{2,}\\s[A-Z][a-zA-Z\\s]*$'),
        Validators.minLength(5),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\\.[a-zA-Z]{2,}$')
      ]],
      mobileNumber: ['', [
        Validators.pattern('^\\+[0-9]{12}$')
      ]],
      address: [''],
      pincode: ['', [
        Validators.required
      ]]
      // Add validation rules for other fields as needed
    };
  }
}
