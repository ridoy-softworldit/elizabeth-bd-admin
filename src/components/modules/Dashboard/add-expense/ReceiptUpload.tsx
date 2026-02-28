import { Receipt } from "lucide-react";
import React from "react";
import InputField from "@/components/shared/InputField";

const ReceiptUpload = () => {
  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white ">
      <h2 className="font-semibold text-2xl">Receipt Upload</h2>
      <div className="space-y-2">
        <Receipt size={24} className="mx-auto text-muted-foreground" />
        <InputField
          label="PDF/Drive Link"
          placeholder="https://drive.google.com/..."
          type="url"
        />
      </div>
    </div>
  );
};

export default ReceiptUpload;
