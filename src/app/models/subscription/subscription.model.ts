export interface SubscriptionDto {
    id: string,
    cropId: string,
    cropName: string,
    createdAt: Date
}

export interface CreateSubsriptionDto {
    cropId: string
}