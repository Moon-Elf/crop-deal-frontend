// src/app/models/transaction/transaction.model.ts
import { TransactionStatus } from '../../enums/transaction-status.enum';

export interface TransactionDto {
  id: string;
  dealerId: string;
  listingId: string;
  quantity: number;
  finalPricePerKg: number;
  totalPrice: number;
  status: TransactionStatus;
  createdAt: string;
  reviewId?: string;
}
