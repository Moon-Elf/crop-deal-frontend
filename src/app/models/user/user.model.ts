export interface UserDto {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    averageRating?: number;
    role: string;
    status: UserStatus
  }

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}