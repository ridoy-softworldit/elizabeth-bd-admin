"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function EditShopPage() {
  const [shopLogo, setShopLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setShopLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Edit Shop</h1>
      <p className="text-sm text-muted-foreground">
        Update your shop information and settings.
      </p>

      <Card>
        <CardContent className="space-y-8 pt-6">
          {/* Shop Logo & Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                {shopLogo ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={shopLogo}
                      alt="Shop Logo"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      onClick={() => setShopLogo(null)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        No Logo
                      </span>
                    </div>
                    <label className="cursor-pointer text-sm text-primary underline">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      Upload New Logo
                    </label>
                    <p className="text-xs text-muted-foreground text-center">
                      Recommended size: 512x512px
                      <br />
                      Max file size: 2MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Shop Info Form */}
            <div className="space-y-4">
              <h1 className="text-xl">Shop Information</h1>
              <Label>Shop Name</Label>
              <Input placeholder="Tech Gadgets Store" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Address</Label>
                  <Input
                    className="mt-2"
                    placeholder="contact@techgadgetsstore.com"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input className="mt-2" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Website</Label>
                  <Input
                    className="mt-2"
                    placeholder="www.techgadgetsstore.com"
                  />
                </div>

                <div>
                  <Label>Shop Type*</Label>
                  <Select defaultValue="electronics">
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Shop Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">
                        Electronics & Tech Gadgets
                      </SelectItem>
                      <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                      <SelectItem value="home">Home & Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Shop Address*</Label>
                <Input placeholder="123 Market St" className="mt-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder="City" />
                <Input placeholder="State" />
                <Input placeholder="Zip Code" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t" />

          {/* Business Hours */}
          <div className="space-y-2">
            <h2 className="font-semibold">Business Hours</h2>
            <div className="space-y-3">
              {[
                {
                  day: "Monday",
                  open: "9:00 AM",
                  close: "6:00 PM",
                  checked: true,
                },
                {
                  day: "Tuesday",
                  open: "9:00 AM",
                  close: "6:00 PM",
                  checked: true,
                },
                {
                  day: "Saturday",
                  open: "10:00 AM",
                  close: "4:00 PM",
                  checked: true,
                },
                {
                  day: "Sunday",
                  open: "Closed",
                  close: "Closed",
                  checked: false,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4"
                >
                  <div className="gap-4 flex items-center">
                    <Checkbox defaultChecked={item.checked} />
                    <span className="w-24">{item.day}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Input
                      defaultValue={item.open}
                      disabled={!item.checked}
                      className="w-full sm:w-28"
                    />
                    <span>to</span>
                    <Input
                      defaultValue={item.close}
                      disabled={!item.checked}
                      className="w-full sm:w-28"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t" />

          {/* Shop Description */}
          <div>
            <h2 className="font-semibold mb-2">Shop Description</h2>
            <Textarea
              className="min-h-[80px]"
              placeholder="Tech Gadgets Store is your one-stop destination for the latest and greatest in technology and electronics. We specialize in offering high-quality smartphones, laptops, smart home devices, audio equipment, and accessories at competitive prices."
            />
          </div>

          {/* Divider */}
          <hr className="border-t" />

          {/* Shipping Methods */}
          <div>
            <h2 className="font-semibold mb-2">Shipping Methods</h2>
            <div className="space-y-2">
              {[
                { name: "Standard Shipping", price: "$5.99" },
                { name: "Express Shipping", price: "$12.99" },
                { name: "International Shipping", price: "$24.99" },
              ].map((method, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox defaultChecked />
                    <span>{method.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    Price: {method.price}
                  </span>
                </div>
              ))}
              <Button variant="link" className="px-0">
                + Add Shipping Method
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
