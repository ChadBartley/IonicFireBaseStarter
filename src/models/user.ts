import {IPreferences} from './preferences'

export interface IUser {
  uid: string;
  email: string;
  photoURL?: string;
  providerId?: string;
  preferences?: IPreferences
}

// export class User implements IUser{
//   constructor(uid: string, 
//               email: string, 
//               photoURL?: string, 
//               displayName?: string, 
//               favoriteColor?: string,
//               phoneNumber?: string,
//               providerId?: string){
//       this.uid = uid;
//       this.email = email;
//       this.photoURL = photoURL;
//       this.displayName = displayName;
//       this.favoriteColor = favoriteColor;
//       this.phoneNumber = phoneNumber;
//       this.providerId = providerId;
//   }
//   uid: string;
//   email: string;
//   photoURL?: string;
//   displayName?: string;
//   favoriteColor?: string;
//   phoneNumber?: string;
//   providerId?: string;
// }