import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const OrderSummary = () => {
  const summary = [
    { label: "Subtotal", value: "$1497.00" },
    { label: "Tax (20%)", value: "$299.40" },
    { label: "Shipping", value: "$9.99" },
  ];

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>

        {summary.map((item, i) => (
          <div key={i} className="flex justify-between text-sm space-y-2">
            <span className="opacity-60">{item.label}</span>
            <span className="text-sm text-[#023337]">{item.value}</span>
          </div>
        ))}

        <div className="flex justify-between text-lg text-[#023337] mb-2">
          <span>Total</span>
          <span>$1806.39</span>
        </div>

        <div>
          <label className="text-sm block mb-1">Order Notes (Optional)</label>
          <Input placeholder="Add any special instructions..." />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
