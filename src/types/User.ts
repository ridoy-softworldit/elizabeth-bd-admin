// export interface User {
//   _id?: string;
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
//   gender?: string;
//   contactNo?: string;
//   bio?: string;
//   status?: string;
//   orders?: number;
//   walletPoint?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: "admin" | "seller" | "customer"; // matches userRoles enum
  image?: string;
  gender?: "male" | "female" | "other"; // matches possibleGenders
  contactNo?: string;
  bio?: string;
  status?: "active" | "inactive"; // matches userStatus
  walletPoint?: number;
  socials?: string[];
  cardInfo?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}
