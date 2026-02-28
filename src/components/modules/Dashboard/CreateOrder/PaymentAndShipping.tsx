import { Select } from "@/components/shared/Select";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const PaymentAndShipping = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
          <CreditCard size={20} /> Payment & Shipping
        </h2>
        <div className="flex flex-col gap-6">
          <Select
            label="Payment Method"
            options={["Card", "Cash", "Bank Transfer"]}
          />

          <Select label="Shipping Method" options={["Standard", "Express"]} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentAndShipping;
