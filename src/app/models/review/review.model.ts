export interface ReviewDto {
    id: string;
    rating: number;
    comment?: string;
    transactionId: string;
    farmerId: string;
    dealerId: string;
    createdAt: string;
}

export interface CreateReviewDto {
    rating: number;
    comment?: string;
    transactionId: string;
    farmerId: string;
}

export interface UpdateReviewDto {
    rating: number;
    comment?: string;
}