// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   MoreVertical,
//   UserIcon,
//   UsersIcon,
//   CalendarDaysIcon,
//   PackageIcon,
// } from "lucide-react";
// import { UserStatCard } from "@/components/shared/userStatCard";
// import { UserFilterBar } from "@/components/shared/UserFilterBar";
// import { useGetAllUsersQuery } from "@/redux/featured/user/userApi";
// import { format } from "date-fns/esm";

// const AllUsersPage = () => {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const { data: users = [] ,isLoading} = useGetAllUsersQuery();
//   if(isLoading) return <p>Loading...</p>

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       (user.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
//       (user.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
//     const matchesStatus =
//       statusFilter === "all" || user.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalUsers = users.length;
//   const activeUsers = users.filter((u) => u.status === "active").length;
//   const totalOrders = users.reduce((sum, u) => sum + (u.orders ?? 0), 0);
//   const newThisMonth = users.length;

//   return (
//     <div className="p-4 py-6 space-y-6">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <UserStatCard
//           title="All Users"
//           value={String(totalUsers)}
//           subtitle="+2 from last week"
//           icon={<UserIcon className="h-6 w-6 text-pink-600" />}
//         />
//         <UserStatCard
//           title="Active Users"
//           value={String(activeUsers)}
//           subtitle={`${Math.round(
//             (activeUsers / totalUsers) * 100 || 0
//           )}% active rate`}
//           icon={<UsersIcon className="h-6 w-6 text-green-600" />}
//         />
//         <UserStatCard
//           title="New This Month"
//           value={String(newThisMonth)}
//           subtitle="+50% from last month"
//           icon={<CalendarDaysIcon className="h-6 w-6 text-pink-600" />}
//         />
//         <UserStatCard
//           title="Total Products Sell"
//           value={String(totalOrders)}
//           subtitle="+20% from last month"
//           icon={<PackageIcon className="h-6 w-6 text-pink-600" />}
//         />
//       </div>

//       {/* Filter Bar */}
//       <UserFilterBar
//         search={search}
//         setSearch={setSearch}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//       />

//       {/* User Table */}
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="border border-[#CFCFCF] ">
//               <TableHead className="text-center">User</TableHead>
//               <TableHead className="text-center">Email</TableHead>
//               <TableHead className="text-center">Status</TableHead>
//               <TableHead className="text-center">Join Date</TableHead>
//               <TableHead className="text-center">Orders</TableHead>
//               <TableHead className="text-center">Wallet Point</TableHead>
//               <TableHead />
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.map((user, index) => (
//               <TableRow key={index} className="border-none">
//                 <TableCell className="py-4">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-muted-foreground  font-medium ">
//                       {user.name?.charAt(0)}
//                     </div>
//                     <div>
//                       <div className="font-medium text-center">{user.name}</div>
//                       <div className="text-xs text-muted-foreground ">
//                         {user.role}
//                       </div>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="py-4 text-center">{user.email}</TableCell>
//                 <TableCell className="py-4 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       user.status === "active"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-gray-300 text-gray-700"
//                     }`}
//                   >
//                     {user.status}
//                   </span>
//                 </TableCell>
//                 <TableCell className="py-4 text-center">{user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "—"}</TableCell>
//                 <TableCell className="py-4 text-center">0</TableCell>
//                 <TableCell className="py-4 text-center">{user.walletPoint}</TableCell>
//                 <TableCell className="py-4 text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreVertical className="w-4 h-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>View</DropdownMenuItem>
//                       <DropdownMenuItem>Edit</DropdownMenuItem>
//                       <DropdownMenuItem>Delete</DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default AllUsersPage;

"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  UserIcon,
  UsersIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { UserStatCard } from "@/components/shared/userStatCard";
import { UserFilterBar } from "@/components/shared/UserFilterBar";

import { format } from "date-fns/esm";
import { toast } from "sonner";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "@/redux/featured/user/userApi";


const AllUsersPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit] = useState(10);

  const { data: userResponse, isLoading, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const users = userResponse?.data || [];
  const meta = userResponse?.meta;
  
  const { data: userDetails } = useGetUserDetailsQuery(
    { userId: selectedUserId!, page: orderPage, limit: orderLimit },
    { skip: !selectedUserId }
  );

  const [updateUserStatus, { isLoading: updating }] = useUpdateUserMutation();

  if (isLoading) return <p>Loading...</p>;

  // Filter locally (for search & status)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = meta?.total || 0;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const newThisMonth = users.length;


  const handleToggleStatus = async (id: string, email: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateUserStatus({ id, data: { email, status: newStatus } }).unwrap();
      toast.success(`User ${email} is now ${newStatus}!`);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="p-4 py-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserStatCard
          title="All Users"
          value={String(totalUsers)}
          subtitle="+2 from last week"
          icon={<UserIcon className="h-6 w-6 text-pink-600" />}
        />
        <UserStatCard
          title="Active Users"
          value={String(activeUsers)}
          subtitle={`${Math.round((activeUsers / totalUsers) * 100 || 0)}% active rate`}
          icon={<UsersIcon className="h-6 w-6 text-green-600" />}
        />
        <UserStatCard
          title="New This Month"
          value={String(newThisMonth)}
          subtitle="+50% from last month"
          icon={<CalendarDaysIcon className="h-6 w-6 text-pink-600" />}
        />
      </div>

      {/* Filter Bar */}
      <UserFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* User Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border border-[#CFCFCF]">
              <TableHead className="text-center">User</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Join Date</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-muted-foreground font-medium">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-center">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">{user.email}</TableCell>
                <TableCell className="py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "—"}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <span className="font-medium">0</span>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => {
                        setSelectedUserId(user._id!);
                        setOrderPage(1);
                        setShowDetailsModal(true);
                      }}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            user._id && user.email && user.status
                              ? handleToggleStatus(user._id, user.email, user.status)
                              : undefined
                          }
                          disabled={updating}
                          className={`${
                            user.status === "active" ? "text-gray-700" : "text-green-600"
                          }`}
                        >
                          {user.status === "active" ? "Set Inactive" : "Activate User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="mt-4 px-5 py-3 bg-white rounded-lg">
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, meta.total)} of {meta.total} users
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
                  
                  if (currentPage > 3) {
                    pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                  }
                  
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
                  
                  if (currentPage < totalPages - 2) {
                    pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                  }
                  
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

      {/* User Details Modal */}
      {showDetailsModal && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Fixed Header with Close Button */}
            <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUserId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{userDetails.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{userDetails.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact No</p>
                    <p className="font-medium">{userDetails.user.contactNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{userDetails.user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      userDetails.user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-300 text-gray-700"
                    }`}>
                      {userDetails.user.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wallet Points</p>
                    <p className="font-medium">{userDetails.user.walletPoint || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium">{format(new Date(userDetails.user.createdAt!), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Orders ({userDetails.meta?.total || userDetails.orders.length})</h3>
                <div className="space-y-3">
                  {userDetails.orders.map((order: any) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Order #{order.orderId}</p>
                          <p className="text-sm text-gray-600">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{order.totalAmount}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.orderInfo[0]?.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.orderInfo[0]?.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {order.orderInfo[0]?.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.orderInfo.length} item(s) • {order.paymentInfo}
                      </div>
                    </div>
                  ))}
                  {userDetails.orders.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No orders found</p>
                  )}
                </div>
                
                {/* Orders Pagination */}
                {userDetails.meta && userDetails.meta.totalPage > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setOrderPage(prev => Math.max(1, prev - 1))}
                      disabled={orderPage === 1}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {orderPage} of {userDetails.meta.totalPage}
                    </span>
                    <button
                      onClick={() => setOrderPage(prev => Math.min(userDetails.meta!.totalPage, prev + 1))}
                      disabled={orderPage === userDetails.meta.totalPage}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;