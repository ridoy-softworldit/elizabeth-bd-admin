import { Button } from "../ui/button";
import ReusableTable from "./ReusableTable";
import { withdrawalsColumns, withdrawalsData } from "@/data/withdrawals-data";
import SearchInput from "../shared/SearchInput";
export type WithdrawalsItem = {
  amount: string;
  name: string;
  account: string;
  date: string;
  fees: string;
  netAmount: number;
  status: "Completed" | "Failed" | "Processing" | "Pending";
};

const WithdrawalsManagementTable = () => {
  return (
    <section className="mt-8 space-y-4 bg-white p-4 rounded-md">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Withdrawal Management </h3>
        <p className="text-sm text-muted-foreground">
          Process and track withdrawal requests and payouts
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center my-8">
        <SearchInput placeholder="Search withdrawals..." className="w-full" />
        <div className="flex gap-2 text-gray-500">
          <Button variant="outline">Filter by Type</Button>
          <Button variant="outline">Sort by Usage</Button>
        </div>
      </div>

      <ReusableTable<WithdrawalsItem>
        data={withdrawalsData}
        columns={withdrawalsColumns}
      />
    </section>
  );
};

export default WithdrawalsManagementTable;
