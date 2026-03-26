export class ShoppingListResponseDto {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
