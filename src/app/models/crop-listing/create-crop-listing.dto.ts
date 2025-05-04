export interface CreateCropListingDto {
    cropId: string;
    pricePerKg: number;
    quantity: number;
    description?: string;
    image?: File;
  }
  