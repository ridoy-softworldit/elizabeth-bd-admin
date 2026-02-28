// "use client";

// import * as React from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// import {
//   Loader2,
//   Package,
//   Clock,
//   CheckCircle2,
//   DollarSign,
// } from "lucide-react";
// import { useGetOrderSummaryQuery } from "@/redux/featured/order/orderApi";

// const AdminDashboard = () => {
//   const { data, isLoading, isError, error } = useGetOrderSummaryQuery();

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
//         <span className="ml-2 text-sm text-muted-foreground">
//           Loading summary...
//         </span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         Failed to load order summary 😞
//       </div>
//     );
//   }

//   const summaryItems = [
//     {
//       title: "Total Orders",
//       value: data?.totalOrders ?? 0,
//       icon: <Package className="w-5 h-5 text-blue-500" />,
//       color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
//     },
//     {
//       title: "Pending Orders",
//       value: data?.totalPendingOrders ?? 0,
//       icon: <Clock className="w-5 h-5 text-yellow-500" />,
//       color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
//     },
//     {
//       title: "Completed Orders",
//       value: data?.totalCompletedOrders ?? 0,
//       icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
//       color: "bg-green-50 hover:bg-green-100 border-green-200",
//     },
//     {
//       title: "Pending Amount",
//       value: `৳${data?.totalPendingAmount?.toFixed(2) ?? 0}`,
//       icon: <DollarSign className="w-5 h-5 text-orange-500" />,
//       color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
//     },
//     {
//       title: "Completed Amount",
//       value: `৳${data?.totalCompletedAmount?.toFixed(2) ?? 0}`,
//       icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
//       color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
//     },
//   ];

//   return (
//     <div className="p-2 sm:p-4 space-y-6">
//       <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
//         📊 Order Summary
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {summaryItems.map((item, i) => (
//           <Card
//             key={i}
//             className={`transition-all duration-300 border ${item.color} shadow-sm hover:shadow-md hover:-translate-y-1`}
//           >
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {item.title}
//               </CardTitle>
//               {item.icon}
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{item.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// "use client";

// import * as React from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Loader2,
//   Package,
//   Clock,
//   CheckCircle2,
//   DollarSign,
//   Calendar,
// } from "lucide-react";
// import {
//   useGetOrderSummaryQuery,
//   useGetOrderRangeSummaryQuery,
// } from "@/redux/featured/order/orderApi";
// import { format } from "date-fns";

// const AdminDashboard = () => {
//   // Default: Last 7 days
//   const today = new Date();
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(today.getDate() - 7);

//   const [startDate, setStartDate] = React.useState(
//     format(sevenDaysAgo, "yyyy-MM-dd")
//   );
//   const [endDate, setEndDate] = React.useState(format(today, "yyyy-MM-dd"));

//   // Overall Summary (All Time)
//   const { data: overallData, isLoading: loadingOverall } =
//     useGetOrderSummaryQuery();

//   // Range Summary
//   const {
//     data: rangeData,
//     isLoading: loadingRange,
//     refetch,
//   } = useGetOrderRangeSummaryQuery(
//     { start: startDate, end: endDate },
//     { skip: !startDate || !endDate }
//   );

//   const handleSearch = () => {
//     if (startDate && endDate) {
//       refetch();
//     }
//   };

//   const SummaryCard = ({
//     title,
//     value,
//     icon,
//     color,
//   }: {
//     title: string;
//     value: string | number;
//     icon: React.ReactNode;
//     color: string;
//   }) => (
//     <Card
//       className={`transition-all duration-300 border ${color} shadow-sm hover:shadow-md hover:-translate-y-1`}
//     >
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">
//           {title}
//         </CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//       </CardContent>
//     </Card>
//   );

//   const renderSummary = (
//     data: any,
//     isLoading: boolean,
//     title: string,
//     showDateRange: boolean = false
//   ) => {
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center h-32">
//           <Loader2 className="w-5 h-5 animate-spin mr-2" />
//           <span className="text-sm">Loading {title.toLowerCase()}...</span>
//         </div>
//       );
//     }

//     const items = [
//       {
//         title: "Total Orders",
//         value: data?.totalOrders ?? 0,
//         icon: <Package className="w-5 h-5 text-blue-500" />,
//         color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
//       },
//       {
//         title: "Pending Orders",
//         value: data?.totalPendingOrders ?? 0,
//         icon: <Clock className="w-5 h-5 text-yellow-500" />,
//         color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
//       },
//       {
//         title: "Completed Orders",
//         value: data?.totalCompletedOrders ?? 0,
//         icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
//         color: "bg-green-50 hover:bg-green-100 border-green-200",
//       },
//       {
//         title: "Pending Amount",
//         value: `৳${(data?.totalPendingAmount ?? 0).toFixed(2)}`,
//         icon: <DollarSign className="w-5 h-5 text-orange-500" />,
//         color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
//       },
//       {
//         title: "Completed Amount",
//         value: `৳${(data?.totalCompletedAmount ?? 0).toFixed(2)}`,
//         icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
//         color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
//       },
//     ];

//     return (
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold flex items-center gap-2">
//             <Calendar className="w-4 h-4" />
//             {title}
//           </h3>
//           {showDateRange && data?.dateRange && (
//             <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
//               {data.dateRange.start} → {data.dateRange.end}
//             </span>
//           )}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
//           {items.map((item, i) => (
//             <SummaryCard key={i} {...item} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 sm:p-6 space-y-8">
//       {/* Date Range Selector */}
//       <Card className="p-4 shadow-sm">
//         <div className="flex flex-col sm:flex-row gap-3 items-end">
//           <div className="flex-1">
//             <Label htmlFor="start">Start Date</Label>
//             <Input
//               id="start"
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               max={endDate}
//             />
//           </div>
//           <div className="flex-1">
//             <Label htmlFor="end">End Date</Label>
//             <Input
//               id="end"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               min={startDate}
//               max={format(today, "yyyy-MM-dd")}
//             />
//           </div>
//           <Button onClick={handleSearch} className="sm:w-auto w-full">
//             <Calendar className="w-4 h-4 mr-2" />
//             Show Report
//           </Button>
//         </div>
//       </Card>

//       {/* Range Summary */}
//       {renderSummary(
//         rangeData,
//         loadingRange,
//         "Selected Date Range Summary",
//         true
//       )}

//       {/* Divider */}
//       <div className="flex items-center gap-2 text-muted-foreground">
//         <div className="flex-1 h-px bg-border"></div>
//         <span className="text-xs">All Time Summary</span>
//         <div className="flex-1 h-px bg-border"></div>
//       </div>

//       {/* Overall Summary */}
//       {renderSummary(overallData, loadingOverall, "All Time Summary")}
//     </div>
//   );
// };

// export default AdminDashboard;

"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  useGetOrderSummaryQuery,
  useGetOrderRangeSummaryQuery,
} from "@/redux/featured/order/orderApi";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

type Preset = "today" | "7days" | "30days";

const AdminDashboard = () => {
  const today = new Date();
  const [startDate, setStartDate] = React.useState(
    format(subDays(today, 6), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = React.useState(format(today, "yyyy-MM-dd"));
  const [activePreset, setActivePreset] = React.useState<Preset>("7days");

  // All Time Summary
  const { data: overallData, isLoading: loadingOverall } =
    useGetOrderSummaryQuery();

  // Range Summary
  const {
    data: rangeData,
    isLoading: loadingRange,
    refetch,
  } = useGetOrderRangeSummaryQuery(
    { start: startDate, end: endDate },
    { skip: !startDate || !endDate }
  );

  // Auto refetch on date change
  React.useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      refetch();
    }
  }, [startDate, endDate, refetch]);

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset);
    const end = format(today, "yyyy-MM-dd");
    let start = "";

    if (preset === "today") {
      start = end;
    } else if (preset === "7days") {
      start = format(subDays(today, 6), "yyyy-MM-dd");
    } else if (preset === "30days") {
      start = format(subDays(today, 29), "yyyy-MM-dd");
    }

    setStartDate(start);
    setEndDate(end);
  };

  const SummaryCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card className={`border ${color} shadow-sm hover:shadow transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <p className="text-lg font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  const renderSummary = (
    data: any,
    isLoading: boolean,
    title: string,
    showBadge: boolean = false
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      );
    }

    const items = [
      {
        title: "Total Orders",
        value: data?.totalOrders ?? 0,
        icon: <Package className="w-4 h-4 text-blue-600" />,
        color: "bg-blue-50 hover:bg-blue-100",
      },
      {
        title: "Pending",
        value: data?.totalPendingOrders ?? 0,
        icon: <Clock className="w-4 h-4 text-yellow-600" />,
        color: "bg-yellow-50 hover:bg-yellow-100",
      },
      {
        title: "Completed",
        value: data?.totalCompletedOrders ?? 0,
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        color: "bg-green-50 hover:bg-green-100",
      },
      {
        title: "Pending Amount",
        value: `৳${(data?.totalPendingAmount ?? 0).toFixed(0)}`,
        icon: <DollarSign className="w-4 h-4 text-orange-600" />,
        color: "bg-orange-50 hover:bg-orange-100",
      },
      {
        title: "Revenue",
        value: `৳${(data?.totalCompletedAmount ?? 0).toFixed(0)}`,
        icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
        color: "bg-emerald-50 hover:bg-emerald-100",
      },
    ];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {title}
          </h3>
          {showBadge && data?.dateRange && (
            <Badge variant="secondary" className="text-xs">
              {data.dateRange.start} → {data.dateRange.end}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {items.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-5 space-y-5">
      {/* Date Range Selector Card */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Filter by Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {(["today", "7days", "30days"] as Preset[]).map((preset) => (
              <Button
                key={preset}
                variant={activePreset === preset ? "default" : "outline"}
                size="sm"
                onClick={() => handlePreset(preset)}
                className="text-xs h-8"
              >
                {preset === "today" && "Today"}
                {preset === "7days" && "Last 7 Days"}
                {preset === "30days" && "Last 30 Days"}
              </Button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
            <div>
              <Label htmlFor="start" className="text-xs">
                Start
              </Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset(null as any);
                }}
                max={endDate}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="end" className="text-xs">
                End
              </Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset(null as any);
                }}
                min={startDate}
                max={format(today, "yyyy-MM-dd")}
                className="h-9 text-sm"
              />
            </div>
            <Button
              size="sm"
              onClick={refetch}
              disabled={!startDate || !endDate || startDate > endDate}
              className="h-9 text-xs"
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Apply
            </Button>
          </div> */}
          {/* Custom Date Picker - Super Compact */}
          <div className="flex items-end gap-1.5 flex-wrap">
            {/* Start Date */}
            <div className="flex flex-col">
              <Label
                htmlFor="start"
                className="text-[10px] text-muted-foreground mb-0.5"
              >
                From
              </Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset(null as any);
                }}
                max={endDate}
                className="h-8 text-xs w-28 sm:w-32 border-muted focus:border-primary"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <Label
                htmlFor="end"
                className="text-[10px] text-muted-foreground mb-0.5"
              >
                To
              </Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset(null as any);
                }}
                min={startDate}
                max={format(today, "yyyy-MM-dd")}
                className="h-8 text-xs w-28 sm:w-32 border-muted focus:border-primary"
              />
            </div>

            {/* Apply Button - Icon Only */}
            <Button
              size="sm"
              onClick={refetch}
              disabled={!startDate || !endDate || startDate > endDate}
              className="h-8 w-8 p-0"
              variant="outline"
            >
              <Calendar className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Range Summary */}
      <div>
        {renderSummary(rangeData, loadingRange, "Date Range Summary", true)}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-xs font-medium">All Time Overview</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      {/* All Time Summary */}
      <div>
        {renderSummary(overallData, loadingOverall, "All Time Summary")}
      </div>
    </div>
  );
};

export default AdminDashboard;
