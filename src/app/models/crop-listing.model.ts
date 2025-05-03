export interface CropListing {
    id: string;
    cropId: string;
    cropName: string;
    pricePerKg: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
