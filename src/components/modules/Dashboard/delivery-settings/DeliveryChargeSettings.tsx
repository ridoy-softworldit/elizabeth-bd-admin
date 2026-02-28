"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Loader2, Save, Truck } from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useCreateSettingsMutation,
  IDeliveryCharge,
} from "@/redux/featured/settings/settingsApi";

export default function DeliveryChargeSettings() {
  const { data: settingsData, isLoading: isFetching, error } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [createSettings, { isLoading: isCreating }] = useCreateSettingsMutation();

  const [deliveryCharge, setDeliveryCharge] = useState<IDeliveryCharge>({
    insideDhaka: 60,
    outsideDhaka: 120,
  });

  useEffect(() => {
    if (settingsData?.deliveryCharge && typeof settingsData.deliveryCharge === 'object') {
      setDeliveryCharge(settingsData.deliveryCharge as IDeliveryCharge);
    }
  }, [settingsData]);

  const handleChargeChange = (
    zone: "insideDhaka" | "outsideDhaka",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setDeliveryCharge(prev => ({
      ...prev,
      [zone]: numValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      formData.append(`deliveryCharge[insideDhaka]`, deliveryCharge.insideDhaka.toString());
      formData.append(`deliveryCharge[outsideDhaka]`, deliveryCharge.outsideDhaka.toString());

      // If settings don't exist, create them
      const mutation = !settingsData || error ? createSettings : updateSettings;
      const result = await mutation(formData).unwrap();

      if (result.success) {
        toast.success("Delivery charges updated successfully!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update delivery charges!");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Delivery Charge Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Inside Dhaka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Delivery Charge</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">৳</span>
                <Input
                  type="number"
                  className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={deliveryCharge.insideDhaka}
                  onChange={(e) => handleChargeChange("insideDhaka", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Outside Dhaka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Delivery Charge</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">৳</span>
                <Input
                  type="number"
                  className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={deliveryCharge.outsideDhaka}
                  onChange={(e) => handleChargeChange("outsideDhaka", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSubmit} disabled={isUpdating || isCreating} className="w-full">
        {(isUpdating || isCreating) ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Delivery Charges
      </Button>
    </div>
  );
}