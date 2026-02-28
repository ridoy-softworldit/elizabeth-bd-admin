import WithdrawalsCategories from "@/components/modules/Dashboard/Withdrawals/WithdrawalsCategories";
import StatsCards from "@/components/shared/StatsCards";
import WithdrawalsManagementTable from "@/components/tables/WithdrawalsManagementTable";
import { Button } from "@/components/ui/button";
import { categoryData, statsData } from "@/data/withdrawals-data";
import { Plus } from "lucide-react";
import React from "react";

const Withdrawals = () => {
  return (
    <div className="py-6 p-2 sm:p-4">
      <div className="flex justify-end mb-4">
        <Button>
          <Plus /> New Withdrawal
        </Button>
      </div>
      <StatsCards items={statsData} />
      <WithdrawalsCategories items={categoryData} />
      <WithdrawalsManagementTable />
    </div>
  );
};

export default Withdrawals;
