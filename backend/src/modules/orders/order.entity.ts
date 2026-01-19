//Defines the Order object (id, status, items, timestamps)
export class Order {
  id: string;
  status: string;
  items: Array<{ productId: string; quantity: number }>;
  createdAt: Date;
  updatedAt: Date;
}

