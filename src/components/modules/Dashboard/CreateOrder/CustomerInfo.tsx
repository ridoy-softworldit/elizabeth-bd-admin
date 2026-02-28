import InputField from "@/components/shared/InputField";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const CustomerInfo = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
          <User size={20} /> Customer Information
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <InputField
            label="Customer"
            placeholder="Search customers..."
            id="customer"
          />
          <InputField
            label="Email"
            placeholder="customer@email.com"
            id="email"
            type="email"
          />
          <InputField label="First Name" placeholder="John" id="firstName" />
          <InputField label="Last Name" placeholder="Doe" id="lastName" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
