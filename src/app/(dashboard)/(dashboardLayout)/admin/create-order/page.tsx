import AddProducts from "@/components/modules/Dashboard/CreateOrder/AddProducts";
import CustomerInfo from "@/components/modules/Dashboard/CreateOrder/CustomerInfo";
import OrderItems from "@/components/modules/Dashboard/CreateOrder/OrderItems";
import OrderSummary from "@/components/modules/Dashboard/CreateOrder/OrderSummary";
import PaymentAndShipping from "@/components/modules/Dashboard/CreateOrder/PaymentAndShipping";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

const CreateOrder = () => {
  return (
    <div className="py-6 p-2 sm:p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold ">
            Create New Order
          </h2>
          <p className="opacity-60 text-xs sm:text-sm lg:text-base">
            Manually create orders for customers
          </p>
        </span>
        <span className="flex items-center gap-2">
          <Button variant={"outline"}>Save Draft</Button>
          <Button>
            <ShoppingCart /> Create Order
          </Button>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
        <div className="space-y-7 xl:col-span-2 ">
          <CustomerInfo />
          <AddProducts />
          <OrderItems />
        </div>
        <div className="space-y-7 xl:col-span-1 ">
          <PaymentAndShipping />
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
