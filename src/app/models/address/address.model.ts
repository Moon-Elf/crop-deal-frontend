export interface AddressDto {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface CreateAddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface UpdateAddressDto extends CreateAddressDto {
    id: string;
  }
  