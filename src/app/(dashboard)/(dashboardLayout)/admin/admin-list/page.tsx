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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  MoreVertical,
  UserIcon,
  UsersIcon,
  CalendarDaysIcon,
  PackageIcon,
} from "lucide-react";

import { UserStatCard } from "@/components/shared/userStatCard";
import { UserFilterBar } from "@/components/shared/UserFilterBar";
import { useGetAllAdminsQuery } from "@/redux/featured/adminprofile/adminprofileApi";

export type Admin = {
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Moderator" | "Support Admin";
  department: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  permission: string[];
  designation: string;
};

const AdminListPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: admins = [] } = useGetAllAdminsQuery();

  const filtered = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 space-y-6 py-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UserStatCard
          title="Total Admins"
          value="5"
          subtitle="Across all departments"
          icon={<UserIcon className="h-6 w-6 text-pink-600" />}
        />
        <UserStatCard
          title="Active Admins"
          value="4"
          subtitle="Currently online"
          icon={<UsersIcon className="h-6 w-6 text-green-600" />}
        />
        <UserStatCard
          title="New This Month"
          value="5"
          subtitle="Full Access level"
          icon={<CalendarDaysIcon className="h-6 w-6 text-pink-600" />}
        />
        <UserStatCard
          title="Total Products Sell"
          value="55"
          subtitle="Different teams"
          icon={<PackageIcon className="h-6 w-6 text-pink-600" />}
        />
      </div>

      {/* Filter Bar */}

      <UserFilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Admin Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border border-[#CFCFCF]">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((admin, i) => (
              <TableRow key={i} className="border-none">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {admin.designation}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">{admin.email}</TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={`${
                      admin.role === "Super Admin"
                        ? "bg-purple-500 text-white"
                        : ""
                    }`}
                  >
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">{admin.department}</TableCell>
                <TableCell className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      admin.status === "Active"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {admin.status}
                  </span>
                </TableCell>
                <TableCell className="py-4">{admin.lastLogin}</TableCell>
                <TableCell className="py-4 space-x-1 flex flex-wrap">
                  {(admin.permission || []).map((perm: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs px-2 py-1 rounded-full"
                    >
                      {perm}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminListPage;
