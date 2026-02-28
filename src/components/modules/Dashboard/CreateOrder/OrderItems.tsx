import ReusableTable from "@/components/tables/ReusableTable";
import { Card, CardContent } from "@/components/ui/card";
import { orderItemsColumns, orderItemsData } from "@/data/CreateOrder";

export type OrderItem = {
  name: string;
  sku: string;
  price: string;
  quantity: number;
  total: string;
};
const OrderItems = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-8">Order Items</h2>

        <ReusableTable<OrderItem>
          data={orderItemsData}
          columns={orderItemsColumns}
        />
      </CardContent>
    </Card>
  );
};

export default OrderItems;
