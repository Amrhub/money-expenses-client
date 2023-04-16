export interface ReceiptDto {
  id: number;
  name: string;
  items: Array<{
    id?: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  isDeleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
