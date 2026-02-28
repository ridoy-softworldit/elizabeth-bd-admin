// "use client";
// import { useState, useEffect } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import {
//   CircleChevronUp,
//   CircleChevronDown,
//   ChevronDown,
//   Search,
//   Calendar,
// } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { useGetAllOrdersQuery } from "@/redux/featured/order/orderApi";

// type OrderStatus =
//   | "Pending"
//   | "Confirmed"
//   | "Processing"
//   | "Picked"
//   | "Shipped"
//   | "Delivered"
//   | "Cancelled";

// type Order = {
//   order_id: string;
//   created: string;
//   createdDate: Date; // নতুন: ফিল্টারের জন্য Date অবজেক্ট
//   customer: string;
//   total: number;
//   profit: number;
//   profit_percent: number;
//   status: OrderStatus;
// };

// const ORDER_STATUSES: OrderStatus[] = [
//   "Pending",
//   "Confirmed",
//   "Processing",
//   "Picked",
//   "Shipped",
//   "Delivered",
//   "Cancelled",
// ];

// const OrderPage = () => {
//   const { data: orderData = [] } = useGetAllOrdersQuery();
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<OrderStatus>("Pending");
//   const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
//   const [searchValue, setSearchValue] = useState("");

//   // নতুন: Date Range Filter
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [ordersByStatus, setOrdersByStatus] = useState<
//     Record<OrderStatus, Order[]>
//   >({
//     Pending: [],
//     Confirmed: [],
//     Processing: [],
//     Picked: [],
//     Shipped: [],
//     Delivered: [],
//     Cancelled: [],
//   });

//   useEffect(() => {
//     if (!orderData || orderData.length === 0) return;

//     const transformOrder = (raw: any): Order => ({
//       order_id: raw._id,
//       created: new Date(raw.createdAt).toLocaleString(),
//       createdDate: new Date(raw.createdAt), // ফিল্টারের জন্য
//       customer:
//         `${raw.customerInfo.firstName} ${raw.customerInfo.lastName}` ||
//         "Unknown",
//       total: raw.totalAmount || 0,
//       profit: raw.orderInfo?.profit || 0,
//       profit_percent: raw.orderInfo?.profitPercent || 0,
//       status: raw.orderInfo?.status || "Pending",
//     });

//     const transformed = orderData.map(transformOrder);

//     const grouped: Record<OrderStatus, Order[]> = {
//       Pending: [],
//       Confirmed: [],
//       Processing: [],
//       Picked: [],
//       Shipped: [],
//       Delivered: [],
//       Cancelled: [],
//     };

//     transformed.forEach((order) => {
//       if (ORDER_STATUSES.includes(order.status))
//         grouped[order.status].push(order);
//       else grouped["Pending"].push(order);
//     });

//     setOrdersByStatus(grouped);
//     setCurrentOrders(grouped["Pending"]);
//   }, [orderData]);

//   // নতুন: ফিল্টারিং ফাংশন
//   const applyFilters = (orders: Order[]) => {
//     return orders
//       .filter((item) =>
//         item.order_id.toLowerCase().includes(searchValue.toLowerCase())
//       )
//       .filter((item) => {
//         if (!startDate && !endDate) return true;
//         const orderDate = item.createdDate;
//         const start = startDate ? new Date(startDate) : null;
//         const end = endDate ? new Date(endDate) : null;

//         if (start && end) {
//           return (
//             orderDate >= start &&
//             orderDate <= new Date(end.setHours(23, 59, 59, 999))
//           );
//         }
//         if (start) return orderDate >= start;
//         if (end) return orderDate <= new Date(end.setHours(23, 59, 59, 999));
//         return true;
//       });
//   };

//   // ট্যাব চেঞ্জ হলে ফিল্টার প্রয়োগ
//   useEffect(() => {
//     const filtered = applyFilters(ordersByStatus[activeTab] || []);
//     setCurrentOrders(filtered);
//   }, [activeTab, ordersByStatus, searchValue, startDate, endDate]);

//   const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
//     const currentStatus = Object.keys(ordersByStatus).find((status) =>
//       ordersByStatus[status as OrderStatus].some((o) => o.order_id === orderId)
//     ) as OrderStatus;

//     if (!currentStatus || newStatus === currentStatus) return;

//     const updatedOrder = ordersByStatus[currentStatus].find(
//       (o) => o.order_id === orderId
//     );
//     if (!updatedOrder) return;

//     const newOrder = { ...updatedOrder, status: newStatus };

//     const updatedOrdersByStatus = {
//       ...ordersByStatus,
//       [currentStatus]: ordersByStatus[currentStatus].filter(
//         (o) => o.order_id !== orderId
//       ),
//       [newStatus]: [newOrder, ...ordersByStatus[newStatus]],
//     };

//     setOrdersByStatus(updatedOrdersByStatus);
//     setActiveTab(newStatus);
//     setExpandedOrder(null);
//   };

//   // Clear Filter
//   const clearDateFilter = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
//         <div className="relative w-full sm:w-1/3 bg-white">
//           <input
//             type="text"
//             placeholder="Search by order id"
//             className="w-full rounded-md px-4 py-2 text-sm"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//           />
//           <Search
//             size={18}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
//           />
//         </div>

//         {/* নতুন: Date Range Filter */}
//         {/* <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 text-sm border border-gray-300"
//             />
//             <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           <span className="text-gray-500">to</span>
//           <div className="relative">
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 text-sm border border-gray-300"
//             />
//             <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           {(startDate || endDate) && (
//             <button
//               onClick={clearDateFilter}
//               className="text-xs text-red-600 hover:text-red-800 underline"
//             >
//               Clear
//             </button>
//           )}
//         </div> */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
//             />
//             {/* <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             /> */}
//           </div>
//           <span className="text-gray-500">to</span>
//           <div className="relative">
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
//             />
//             {/* <Calendar
//               size={16}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             /> */}
//           </div>
//           {(startDate || endDate) && (
//             <button
//               onClick={clearDateFilter}
//               className="text-xs text-red-600 hover:text-red-800 underline"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       <Tabs.Root
//         value={activeTab}
//         onValueChange={(val) => setActiveTab(val as OrderStatus)}
//       >
//         <Tabs.List className="flex overflow-x-auto">
//           {ORDER_STATUSES.map((status) => (
//             <Tabs.Trigger
//               key={status}
//               value={status}
//               className="flex-1 h-[45px] px-4 bg-white text-sm text-center hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-2 data-[state=active]:border-violet-500"
//             >
//               {status} ({applyFilters(ordersByStatus[status] || []).length})
//             </Tabs.Trigger>
//           ))}
//         </Tabs.List>

//         {ORDER_STATUSES.map((status) => (
//           <Tabs.Content
//             key={status}
//             value={status}
//             className="grow bg-white p-5 rounded-b-md"
//           >
//             <div className="overflow-x-auto">
//               <Table className="min-w-[678px]">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-gray-400"></TableHead>
//                     <TableHead className="text-gray-400">ORDER ID</TableHead>
//                     <TableHead className="text-gray-400">CREATED</TableHead>
//                     <TableHead className="text-gray-400">CUSTOMER</TableHead>
//                     <TableHead className="text-gray-400">TOTAL</TableHead>
//                     <TableHead className="text-gray-400">PROFIT</TableHead>
//                     <TableHead className="text-gray-400">STATUS</TableHead>
//                     <TableHead />
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentOrders.map((item) => (
//                     <TableRow key={item.order_id}>
//                       <TableCell className="text-center">
//                         <button
//                           className="rounded-full border p-1 text-gray-500"
//                           onClick={() =>
//                             setExpandedOrder(
//                               expandedOrder === item.order_id
//                                 ? null
//                                 : item.order_id
//                             )
//                           }
//                         >
//                           {expandedOrder === item.order_id ? (
//                             <CircleChevronUp />
//                           ) : (
//                             <CircleChevronDown />
//                           )}
//                         </button>
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {item.order_id}
//                       </TableCell>
//                       <TableCell>{item.created}</TableCell>
//                       <TableCell>{item.customer}</TableCell>
//                       <TableCell>৳{item.total}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <span>৳{item.profit}</span>
//                           <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-md font-semibold">
//                             {item.profit_percent}%
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <button
//                               className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
//                                 item.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : item.status === "Confirmed"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : item.status === "Processing"
//                                   ? "bg-purple-100 text-purple-800"
//                                   : item.status === "Picked"
//                                   ? "bg-indigo-100 text-indigo-800"
//                                   : item.status === "Shipped"
//                                   ? "bg-cyan-100 text-cyan-800"
//                                   : item.status === "Delivered"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {item.status}
//                             </button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent>
//                             {ORDER_STATUSES.map((statusOption) => (
//                               <DropdownMenuItem
//                                 key={statusOption}
//                                 onSelect={() =>
//                                   handleStatusChange(
//                                     item.order_id,
//                                     statusOption
//                                   )
//                                 }
//                               >
//                                 {statusOption}
//                               </DropdownMenuItem>
//                             ))}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </Tabs.Content>
//         ))}
//       </Tabs.Root>

//       {/* বাকি মডাল কোড অপরিবর্তিত */}
//       {expandedOrder && (
//         <div className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50">
//           <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setExpandedOrder(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//             >
//               ✕
//             </button>

//             {(() => {
//               const rawOrder = orderData.find(
//                 (o: any) => o._id === expandedOrder
//               );
//               if (!rawOrder) return <p>Order not found.</p>;

//               return (
//                 <div className="space-y-6">
//                   <div className="flex flex-col sm:flex-row justify-between items-center">
//                     <h2 className="text-xl font-semibold">
//                       Order <span className="font-bold">{rawOrder._id}</span>
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {new Date(rawOrder.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="flex flex-col sm:flex-row justify-between gap-6">
//                     <div className="bg-[#F3F4F6] sm:w-2/3 p-4 rounded-lg shadow-sm">
//                       <h3 className="font-medium mb-2">Customer Information</h3>
//                       <div className="text-sm space-y-1">
//                         <p>
//                           <span className="font-semibold">Name:</span>{" "}
//                           {rawOrder.customerInfo.firstName}{" "}
//                           {rawOrder.customerInfo.lastName}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Email:</span>{" "}
//                           {rawOrder.customerInfo.email}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Phone:</span>{" "}
//                           {rawOrder.customerInfo.phone}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Address:</span>{" "}
//                           {rawOrder.customerInfo.address},{" "}
//                           {rawOrder.customerInfo.city},{" "}
//                           {rawOrder.customerInfo.postalCode},{" "}
//                           {rawOrder.customerInfo.country}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="bg-[#F3F4F6] sm:w-1/3 p-4 rounded-lg shadow-sm">
//                       <h3 className="font-medium mb-2">Payment</h3>
//                       <div className="text-sm space-y-1">
//                         <p>
//                           <span className="font-semibold">Method:</span>{" "}
//                           {rawOrder.paymentInfo}
//                         </p>
//                         <p>
//                           <span className="font-semibold">Total:</span> ৳
//                           {rawOrder.totalAmount}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm">
//                     <h3 className="font-medium mb-2">Order Items</h3>
//                     <div className="overflow-x-auto">
//                       <Table className="min-w-[600px]">
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Product</TableHead>
//                             <TableHead>Tracking</TableHead>
//                             <TableHead>Quantity</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Total</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {(rawOrder.orderInfo || []).map(
//                             (item: any, idx: number) => (
//                               <TableRow key={idx}>
//                                 <TableCell>
//                                   {item.productInfo || "N/A"}
//                                 </TableCell>
//                                 <TableCell>
//                                   {item.trackingNumber || "—"}
//                                 </TableCell>
//                                 <TableCell>{item.quantity}</TableCell>
//                                 <TableCell className="capitalize">
//                                   {item.status}
//                                 </TableCell>
//                                 <TableCell>
//                                   ৳{item.totalAmount?.total || 0}
//                                 </TableCell>
//                               </TableRow>
//                             )
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })()}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderPage;

"use client";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CircleChevronUp,
  CircleChevronDown,
  Search,
  Printer,
  ChevronDown,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation,
} from "@/redux/featured/order/orderApi";
import {
  useCreateSteadfastOrderMutation,
  useLazyGetSteadfastStatusByTrackingCodeQuery,
  useLazyGetSteadfastStatusByInvoiceQuery,
} from "@/redux/featured/courier/steadfastApi";
import {
  useCreateOrderMutation as usePathaoCreateOrderMutation,
  useLazyGetOrderInfoQuery as useLazyGetPathaoOrderInfoQuery,
} from "@/redux/featured/courier/pathaoApi";
import { useGetSingleProductQuery } from "@/redux/featured/products/productsApi";
import MultiCourierModal from "@/components/courier/MultiCourierModal";
import { CourierProvider, SteadfastForm, PathaoForm, CourierResult, PendingStatusUpdate } from '@/types/Courier';
import toast from 'react-hot-toast';

// Model অনুযায়ী Status
const ORDER_STATUSES = [
  "pending",
  "processing",
  "at-local-facility",
  "out-for-delivery",
  "completed",
  "cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

type Order = {
  _id: string; // MongoDB ID for fetching
  order_id: string; // Display ID
  created: string;
  createdDate: Date;
  customer: string;
  total: number;
  profit: number;
  profit_percent: number;
  status: OrderStatus;
};

// Helper: Capitalize & format status
const formatStatus = (status: string) =>
  status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Helper: Status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "at-local-facility":
      return "bg-indigo-100 text-indigo-800";
    case "out-for-delivery":
      return "bg-cyan-100 text-cyan-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Component to fetch and display product name
const ProductName = ({ productId, onNameLoaded }: { productId: string; onNameLoaded?: (id: string, name: string) => void }) => {
  const { data: product } = useGetSingleProductQuery(productId);
  const productName = product?.description?.name || "Loading...";
  
  // Store the product name when loaded
  useEffect(() => {
    if (product?.description?.name && onNameLoaded) {
      onNameLoaded(productId, product.description.name);
    }
  }, [product, productId, onNameLoaded]);
  
  return <span>{productName}</span>;
};

const OrderPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  
  const { data: orderResponse, isLoading, refetch } = useGetAllOrdersQuery({ 
    page: currentPage, 
    limit: itemsPerPage,
    status: activeTab
  });
  const orderData = orderResponse?.data || [];
  const meta = orderResponse?.meta;
  
  // Fetch counts for all statuses
  const { data: pendingCount, refetch: refetchPending } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'pending' });
  const { data: processingCount, refetch: refetchProcessing } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'processing' });
  const { data: atLocalCount, refetch: refetchAtLocal } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'at-local-facility' });
  const { data: outForDeliveryCount, refetch: refetchOutForDelivery } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'out-for-delivery' });
  const { data: completedCount, refetch: refetchCompleted } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'completed' });
  const { data: cancelledCount, refetch: refetchCancelled } = useGetAllOrdersQuery({ page: 1, limit: 1, status: 'cancelled' });
  
  const statusCounts: Record<OrderStatus, number> = {
    'pending': pendingCount?.meta?.total || 0,
    'processing': processingCount?.meta?.total || 0,
    'at-local-facility': atLocalCount?.meta?.total || 0,
    'out-for-delivery': outForDeliveryCount?.meta?.total || 0,
    'completed': completedCount?.meta?.total || 0,
    'cancelled': cancelledCount?.meta?.total || 0,
  };
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [createSteadfastOrder, { isLoading: steadfastLoading }] = useCreateSteadfastOrderMutation();
  const [createPathaoOrder, { isLoading: pathaoLoading }] = usePathaoCreateOrderMutation();
  const [getSteadfastStatusByTracking] = useLazyGetSteadfastStatusByTrackingCodeQuery();
  const [getSteadfastStatusByInvoice] = useLazyGetSteadfastStatusByInvoiceQuery();
  const [getPathaoOrderInfo] = useLazyGetPathaoOrderInfoQuery();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<any>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider | null>(null);
  const [courierStep, setCourierStep] = useState<'select' | 'form'>('select');
  const [courierResult, setCourierResult] = useState<CourierResult | null>(null);
  const [ordersWithCourier, setOrdersWithCourier] = useState<Set<string>>(new Set());
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<PendingStatusUpdate | null>(null);
  const [trackingModal, setTrackingModal] = useState<{ show: boolean; data: any; loading: boolean }>({ show: false, data: null, loading: false });
  const [steadfastForm, setSteadfastForm] = useState<SteadfastForm>({
    invoice: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    cod_amount: 0,
    note: ''
  });
  const [pathaoForm, setPathaoForm] = useState<PathaoForm>({
    store_id: 0,
    merchant_order_id: '',
    recipient_name: '',
    recipient_phone: '',
    recipient_address: '',
    delivery_type: 48,
    item_type: 2,
    special_instruction: '',
    item_quantity: 1,
    item_weight: '0.5',
    item_description: '',
    amount_to_collect: 0
  });

  const [ordersByStatus, setOrdersByStatus] = useState<
    Record<OrderStatus, Order[]>
  >({
    'pending': [],
    'processing': [],
    'at-local-facility': [],
    'out-for-delivery': [],
    'completed': [],
    'cancelled': [],
  });

  // Transform Orders
  useEffect(() => {
    if (!orderData || orderData.length === 0) return;

    const transformOrder = (raw: any): Order => ({
      _id: raw._id,
      order_id: raw.orderId || raw._id,
      created: new Date(raw.createdAt).toLocaleString(),
      createdDate: new Date(raw.createdAt),
      customer:
        `${raw.customerInfo.firstName} ${raw.customerInfo.lastName}` ||
        "Unknown",
      total: raw.totalAmount || 0,
      profit: raw.orderInfo?.[0]?.profit || 0,
      profit_percent: raw.orderInfo?.[0]?.profitPercent || 0,
      status: (raw.orderInfo?.[0]?.status || "pending") as OrderStatus,
    });

    const transformed = orderData.map(transformOrder);

    // Mark orders that have tracking numbers
    const ordersWithTracking = new Set(
      orderData
        .filter((o: any) => o.trackingNumber)
        .map((o: any) => o._id)
    );
    setOrdersWithCourier(ordersWithTracking);

    setCurrentOrders(transformed);
  }, [orderData]);

  // Apply Filters
  const applyFilters = (orders: Order[]) => {
    return orders
      .filter((item) =>
        item.order_id.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((item) => {
        if (!startDate && !endDate) return true;
        const orderDate = item.createdDate;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return (
            orderDate >= start &&
            orderDate <= new Date(end.setHours(23, 59, 59, 999))
          );
        }
        if (start) return orderDate >= start;
        if (end) return orderDate <= new Date(end.setHours(23, 59, 59, 999));
        return true;
      });
  };

  const filteredOrders = applyFilters(currentOrders);

  // Reset to page 1 when tab changes
  const handleTabChange = (newTab: OrderStatus) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  // Handle Status Change
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    // Check if status change should trigger courier order creation
    if ((newStatus === "processing" || newStatus === "at-local-facility") && !ordersWithCourier.has(orderId)) {
      const rawOrder = orderData.find((o: any) => o._id === orderId);
      if (rawOrder) {
        setSelectedOrderForCourier(rawOrder);
        setPendingStatusUpdate({ orderId, newStatus });
        
        // Get product names from order items
        const itemDescriptions = await Promise.all(
          (rawOrder.orderInfo || []).map(async (item: any) => {
            if (typeof item.productInfo === 'string') {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/products/${item.productInfo}`);
                const data = await response.json();
                return data?.data?.description?.name || 'Product';
              } catch {
                return 'Product';
              }
            }
            return item.productInfo?.description?.name || 'Product';
          })
        );
        const itemDescription = itemDescriptions.join(', ');
        
        // Pre-fill forms with order data
        const commonData = {
          recipient_name: `${rawOrder.customerInfo.firstName} ${rawOrder.customerInfo.lastName}`,
          recipient_phone: (rawOrder.customerInfo.phone || "").replace(/^\+?88/, '').replace(/^0?/, '0'),
          recipient_address: `${rawOrder.customerInfo.address}, ${rawOrder.customerInfo.city}` || "",
          item_description: itemDescription,
        };
        
        setSteadfastForm({
          invoice: rawOrder._id,
          ...commonData,
          cod_amount: rawOrder.totalAmount || 0,
          note: itemDescription,
          recipient_email: rawOrder.customerInfo.email || '',
          delivery_type: 0
        });
        
        setPathaoForm({
          store_id: 0,
          merchant_order_id: rawOrder._id,
          ...commonData,
          delivery_type: 48,
          item_type: 2,
          special_instruction: '',
          item_quantity: rawOrder.orderInfo?.length || 1,
          item_weight: '0.5',
          amount_to_collect: rawOrder.totalAmount || 0
        });
        
        setCourierResult(null);
        setSelectedCourier(null);
        setCourierStep('select');
        setShowCourierModal(true);
        return;
      }
    }

    // Find the order in currentOrders instead of ordersByStatus
    const order = currentOrders.find((o) => o._id === orderId);
    if (!order) return;

    const currentStatus = order.status;
    if (newStatus === currentStatus) return;

    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
      setExpandedOrder(null);
      // Refetch all data
      refetch();
      refetchPending();
      refetchProcessing();
      refetchAtLocal();
      refetchOutForDelivery();
      refetchCompleted();
      refetchCancelled();
    } catch {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleCourierOrderCreate = async () => {
    if (!selectedCourier) return;
    
    try {
      let result: any;
      let trackingCode = '';
      
      if (selectedCourier === 'steadfast') {
        result = await createSteadfastOrder(steadfastForm).unwrap();
        // Steadfast returns: { consignment_id, tracking_code, status, invoice }
        trackingCode = result?.tracking_code || result?.consignment?.tracking_code || '';
      } else if (selectedCourier === 'pathao') {
        result = await createPathaoOrder(pathaoForm).unwrap();
        // Pathao returns: { data: { consignment_id, merchant_order_id, order_status, delivery_fee } }
        trackingCode = result?.data?.consignment_id || '';
      }
      
      setCourierResult({ success: true, data: result });
      
      if (selectedOrderForCourier && trackingCode) {
        try {
          await updateOrder({
            id: selectedOrderForCourier._id,
            payload: { trackingNumber: trackingCode, courierProvider: selectedCourier }
          }).unwrap();
          setOrdersWithCourier(prev => new Set([...prev, selectedOrderForCourier._id]));
        } catch (updateError) {
          console.error('Failed to update order:', updateError);
        }
      }
      
      if (pendingStatusUpdate) {
        try {
          await updateOrderStatus({ 
            orderId: pendingStatusUpdate.orderId, 
            status: pendingStatusUpdate.newStatus as OrderStatus
          }).unwrap();
          
          toast.success(`Order created! Tracking: ${trackingCode}`);
        } catch (statusError) {
          toast.success(`Order created! Tracking: ${trackingCode}`);
        }
      } else {
        toast.success(`Order created! Tracking: ${trackingCode}`);
      }
      
      // Close modals and refetch data
      handleCloseCourierModal();
      setExpandedOrder(null);
      refetch();
      refetchPending();
      refetchProcessing();
      refetchAtLocal();
      refetchOutForDelivery();
      refetchCompleted();
      refetchCancelled();
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      setCourierResult({ success: false, error: error?.data?.message || error?.message || "Failed" });
      toast.error(error?.data?.message || error?.message || 'Failed to create order');
    }
  };
  
  const handleCloseCourierModal = () => {
    setShowCourierModal(false);
    setSelectedOrderForCourier(null);
    setPendingStatusUpdate(null);
    setCourierResult(null);
    setSelectedCourier(null);
    setCourierStep('select');
  };
  
  const handleCourierSelect = (courier: CourierProvider) => {
    setSelectedCourier(courier);
    setCourierStep('form');
  };
  
  const handleBackToSelection = () => {
    setCourierStep('select');
    setSelectedCourier(null);
    setCourierResult(null);
  };

  // Clear Date Filter
  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleTrackOrder = async (orderId: string) => {
    const rawOrder = orderData.find((o: any) => o._id === orderId);
    if (!rawOrder?.trackingNumber) {
      toast.error('No tracking number found');
      return;
    }

    const trackingNumber = rawOrder.trackingNumber;
    const courierType = rawOrder.courierProvider || 'steadfast';

    setTrackingModal({ show: true, data: null, loading: true });

    try {
      let result;
      if (courierType === 'pathao') {
        // Pathao: GET /orders/:consignmentId/info
        result = await getPathaoOrderInfo(trackingNumber).unwrap();
      } else {
        // Steadfast: Try tracking code, fallback to invoice
        try {
          result = await getSteadfastStatusByTracking(trackingNumber).unwrap();
        } catch {
          result = await getSteadfastStatusByInvoice(orderId).unwrap();
        }
      }
      setTrackingModal({ show: true, data: result, loading: false });
    } catch (error: any) {
      toast.error('Failed to fetch tracking info');
      setTrackingModal({ show: false, data: null, loading: false });
    }
  };

  return (
    <>
      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pt-6">
        <div className="relative w-full sm:w-1/3 bg-white">
          <input
            type="text"
            placeholder="Search by order id"
            className="w-full rounded-md px-4 py-2 text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md bg-white px-3 py-2 pr-9 text-sm border border-gray-300 appearance-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={clearDateFilter}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
      <>
      {/* Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(val) => handleTabChange(val as OrderStatus)}
      >
        <Tabs.List className="flex overflow-x-auto">
          {ORDER_STATUSES.map((status) => (
            <Tabs.Trigger
              key={status}
              value={status}
              className="flex-1 h-[45px] px-4 bg-white text-sm text-center hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              {formatStatus(status)} ({statusCounts[status]})
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {ORDER_STATUSES.map((status) => (
          <Tabs.Content
            key={status}
            value={status}
            className="grow bg-white p-5 rounded-b-md"
          >
            <div className="overflow-x-auto">
              <Table className="min-w-[678px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-400"></TableHead>
                    <TableHead className="text-gray-400">ORDER ID</TableHead>
                    <TableHead className="text-gray-400">CREATED</TableHead>
                    <TableHead className="text-gray-400">CUSTOMER</TableHead>
                    <TableHead className="text-gray-400">TOTAL</TableHead>
                    <TableHead className="text-gray-400">PROFIT</TableHead>
                    <TableHead className="text-gray-400">STATUS -ACTION</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((item, index) => (
                    <TableRow 
                      key={`${item.order_id}-${index}`}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === item._id
                            ? null
                            : item._id
                        )
                      }
                    >
                      <TableCell className="text-center">
                        <button
                          className="rounded-full border p-1 text-gray-500"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === item._id
                                ? null
                                : item._id
                            )
                          }
                        >
                          {expandedOrder === item._id ? (
                            <CircleChevronUp />
                          ) : (
                            <CircleChevronDown />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.order_id}
                      </TableCell>
                      <TableCell>{item.created}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>৳{item.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>৳{item.profit}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-md font-semibold">
                            {item.profit_percent}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className={`flex items-center gap-1 text-xs px-3 py-2 rounded-md border-2 border-dashed border-gray-400 hover:border-solid hover:border-gray-600 hover:shadow-md transition-all cursor-pointer ${getStatusColor(
                                  item.status
                                )}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {formatStatus(item.status)}
                                <ChevronDown size={12} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {ORDER_STATUSES.map((statusOption) => (
                                <DropdownMenuItem
                                  key={statusOption}
                                  onSelect={() =>
                                    handleStatusChange(
                                      item._id,
                                      statusOption
                                    )
                                  }
                                >
                                  {formatStatus(statusOption)}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {ordersWithCourier.has(item._id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackOrder(item._id);
                              }}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                              title="Track order"
                            >
                              📦 Track
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* Expanded Order Modal */}
      {expandedOrder && (
        <div className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50 print:bg-white print:static print:w-full print:h-auto">
          <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:p-8 print:w-full print:max-w-none print:max-h-none">
            <button
              onClick={() => setExpandedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 print:hidden"
            >
              X
            </button>
            
            {/* Print Header */}
            <div className="hidden print:block mb-8">
              <div className="text-center border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Elizabeth BD</h1>
                <p className="text-gray-600 mt-1">Order Invoice</p>
              </div>
            </div>

            {(() => {
              const rawOrder = orderData.find(
                (o: any) => o._id === expandedOrder
              );
              if (!rawOrder) return <p>Order not found.</p>;

              return (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Order <span className="font-bold">{rawOrder.orderId || rawOrder._id}</span>
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md border-2 border-dashed border-gray-400 hover:border-solid hover:border-gray-600 hover:shadow-md transition-all cursor-pointer ${getStatusColor(
                              rawOrder.orderInfo?.[0]?.status || "pending"
                            )}`}
                          >
                            {formatStatus(rawOrder.orderInfo?.[0]?.status || "pending")}
                            <ChevronDown size={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {ORDER_STATUSES.map((statusOption) => (
                            <DropdownMenuItem
                              key={statusOption}
                              onSelect={() =>
                                handleStatusChange(
                                  rawOrder._id,
                                  statusOption
                                )
                              }
                            >
                              {formatStatus(statusOption)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button
                        onClick={() => {
                          // Get product names from the modal table
                          const productCells = document.querySelectorAll('tbody tr td:first-child span');
                          const productNames = Array.from(productCells).map(cell => cell.textContent || 'Product');
                          
                          const originalContent = document.body.innerHTML;
                          document.body.innerHTML = `
                            <div class="receipt-content">
                              <div class="receipt-header">
                                <h1>Elizabeth BD</h1>
                                <p>Order Management Receipt</p>
                                <p>Order ID: ${rawOrder.orderId || rawOrder._id}</p>
                                <p>Date: ${new Date(rawOrder.createdAt).toLocaleString()}</p>
                              </div>
                              
                              <div class="receipt-info">
                                <div>
                                  <h3>Customer Information</h3>
                                  <p><strong>Name:</strong> ${rawOrder.customerInfo.firstName} ${rawOrder.customerInfo.lastName}</p>
                                  <p><strong>Email:</strong> ${rawOrder.customerInfo.email}</p>
                                  <p><strong>Phone:</strong> ${rawOrder.customerInfo.phone}</p>
                                  <p><strong>Address:</strong> ${rawOrder.customerInfo.address}, ${rawOrder.customerInfo.city}</p>
                                </div>
                                <div>
                                  <h3>Order Details</h3>
                                  <p><strong>Status:</strong> ${rawOrder.orderInfo?.[0]?.status || 'pending'}</p>
                                  <p><strong>Payment:</strong> ${typeof rawOrder.paymentInfo === 'string' ? rawOrder.paymentInfo : 'Card'}</p>
                                  <p><strong>Tracking:</strong> ${rawOrder.orderInfo?.[0]?.trackingNumber || 'Not assigned'}</p>
                                </div>
                              </div>
                              
                              <div class="receipt-section">
                                <h3>Order Items</h3>
                                <table class="receipt-table">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Quantity</th>
                                      <th>Unit Price</th>
                                      <th>Subtotal</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${(rawOrder.orderInfo || []).map((item, index) => `
                                      <tr>
                                        <td>${productNames[index] || 'Product'}</td>
                                        <td>${item.quantity}</td>
                                        <td>৳${Math.round((item.totalAmount?.subTotal || 0) / item.quantity)}</td>
                                        <td>৳${item.totalAmount?.subTotal || 0}</td>
                                        <td>${item.status}</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div class="receipt-total">
                                <div class="total-row">
                                  <span>Subtotal:</span>
                                  <span>৳${rawOrder.orderInfo?.reduce((sum, item) => sum + (item.totalAmount?.subTotal || 0), 0) || 0}</span>
                                </div>
                                <div class="total-row">
                                  <span>Delivery Charge:</span>
                                  <span>৳${rawOrder.deliveryCharge || 0}</span>
                                </div>
                                <div class="total-row final-total">
                                  <span>TOTAL AMOUNT:</span>
                                  <span>৳${rawOrder.totalAmount}</span>
                                </div>
                              </div>
                              
                              <div style="margin-top: 30px; text-align: center; font-size: 9pt;">
                                <p>Printed: ${new Date().toLocaleString()}</p>
                              </div>
                            </div>
                          `;
                          window.print();
                          document.body.innerHTML = originalContent;
                          window.location.reload();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Printer size={16} />
                        Print
                      </button>
                      <p className="text-sm text-gray-500">
                        {new Date(rawOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div id="order-receipt" className="receipt-content space-y-6">

                  <div className="flex flex-col sm:flex-row justify-between gap-6 print:gap-8">
                    <div className="bg-[#F3F4F6] sm:w-2/3 p-4 rounded-lg shadow-sm print:bg-white print:border print:border-gray-300 print:shadow-none print:w-2/3">
                      <h3 className="font-medium mb-2 print:font-bold print:text-lg print:border-b print:border-gray-200 print:pb-2">Customer Information</h3>
                      <div className="text-sm space-y-1 print:text-base print:space-y-2">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {rawOrder.customerInfo.firstName}{" "}
                          {rawOrder.customerInfo.lastName}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {rawOrder.customerInfo.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {rawOrder.customerInfo.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {rawOrder.customerInfo.address},{" "}
                          {rawOrder.customerInfo.city},{" "}
                          {rawOrder.customerInfo.postalCode},{" "}
                          {rawOrder.customerInfo.country}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F3F4F6] sm:w-1/3 p-4 rounded-lg shadow-sm print:bg-white print:border print:border-gray-300 print:shadow-none print:w-1/3">
                      <h3 className="font-medium mb-2 print:font-bold print:text-lg print:border-b print:border-gray-200 print:pb-2">Payment</h3>
                      <div className="text-sm space-y-1 print:text-base print:space-y-2">
                        <p>
                          <span className="font-semibold">Method:</span>{" "}
                          {typeof rawOrder.paymentInfo === "string"
                            ? rawOrder.paymentInfo
                            : "Card"}
                        </p>
                        <p>
                          <span className="font-semibold">Total:</span> ৳
                          {rawOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm print:bg-white print:border print:border-gray-300 print:shadow-none">
                    <h3 className="font-medium mb-2 print:font-bold print:text-lg print:border-b print:border-gray-200 print:pb-2">Order Items</h3>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] print:min-w-full">
                        <TableHeader>
                          <TableRow className="print:border-b-2 print:border-gray-400">
                            <TableHead>Item</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(rawOrder.orderInfo || []).map(
                            (item: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  {typeof item.productInfo === 'string' ? (
                                    <ProductName productId={item.productInfo} />
                                  ) : (
                                    (item.productInfo as any)?.description?.name || "N/A"
                                  )}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>৳{item.totalAmount?.subTotal || 0}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-[#F3F4F6] p-4 rounded-lg shadow-sm print:bg-white print:border print:border-gray-300 print:shadow-none">
                    <h3 className="font-medium mb-3 print:font-bold print:text-lg print:border-b print:border-gray-200 print:pb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm print:space-y-3 print:text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-600 print:text-black">Subtotal:</span>
                        <span className="font-medium print:font-semibold">৳{(rawOrder as any).orderInfo?.reduce((sum: number, item: any) => sum + (item.totalAmount?.subTotal || 0), 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 print:text-black">Delivery Charge:</span>
                        <span className="font-medium print:font-semibold">৳{(rawOrder as any).deliveryCharge || 0}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between print:border-t-2 print:border-gray-400 print:pt-3 print:mt-3">
                        <span className="font-semibold text-base print:font-bold print:text-lg">Total Amount:</span>
                        <span className="font-bold text-base text-violet-600 print:text-black print:text-lg">৳{(rawOrder as any).totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      </>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="mt-4 px-5 py-3 bg-white rounded-lg">
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, meta.total)} of {meta.total} orders
            </div>
            <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {(() => {
                const pages = [];
                const totalPages = meta.totalPage;
                
                // Always show first page
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    1
                  </button>
                );
                
                // Show ellipsis if current page is far from start
                if (currentPage > 3) {
                  pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                }
                
                // Show pages around current page
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Show ellipsis if current page is far from end
                if (currentPage < totalPages - 2) {
                  pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                }
                
                // Always show last page (if more than 1 page)
                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(meta.totalPage, prev + 1))}
              disabled={currentPage === meta.totalPage}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModal.show && (
        <div className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setTrackingModal({ show: false, data: null, loading: false })}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-semibold mb-4">📦 Order Tracking</h2>
            
            {trackingModal.loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : trackingModal.data ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-lg">Tracking Information</h3>
                  <div className="space-y-2">
                    {Object.entries(trackingModal.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-gray-800">{String(value ?? 'N/A')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tracking data available</p>
            )}
          </div>
        </div>
      )}

      {/* Multi-Courier Order Creation Modal */}
      <MultiCourierModal
        showModal={showCourierModal}
        courierStep={courierStep}
        selectedCourier={selectedCourier}
        pendingStatusUpdate={pendingStatusUpdate}
        steadfastForm={steadfastForm}
        pathaoForm={pathaoForm}
        courierResult={courierResult}
        steadfastLoading={steadfastLoading}
        pathaoLoading={pathaoLoading}
        onClose={handleCloseCourierModal}
        onCourierSelect={handleCourierSelect}
        onBackToSelection={handleBackToSelection}
        onSteadfastFormChange={setSteadfastForm}
        onPathaoFormChange={setPathaoForm}
        onCreateOrder={handleCourierOrderCreate}
      />
    </>
  );
};

export default OrderPage;
