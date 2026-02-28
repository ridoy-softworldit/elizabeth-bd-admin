/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Palette,
  Ruler,
  Package,
  Weight,
  Award,
  Shield,
  Icon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectAttributes,
  setAttributes,
} from "@/redux/featured/attribute/attributeSlice";
import { IAttribute } from "@/types/attribute";
import { useGetAttributesQuery } from "@/redux/featured/attribute/attributeApi";

export default function AttributeManagement() {
  const { data, isLoading } = useGetAttributesQuery();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const allAttributes = useAppSelector(selectAttributes);

  useEffect(() => {
    if (data) {
      dispatch(setAttributes(data as IAttribute[]));
    }
  }, [dispatch, data]);

  const stats = [
    {
      title: "Total Attributes",
      value: "24",
      subtitle: "+4 this month",
      icon: "⚙️",
      color: "text-blue-600",
    },
    {
      title: "Required Attributes",
      value: "8",
      subtitle: "Needs of total",
      icon: "❗",
      color: "text-red-600",
    },
    {
      title: "Dropdown Attributes",
      value: "16",
      subtitle: "Most common type",
      icon: "📋",
      color: "text-orange-600",
    },
    {
      title: "Categories",
      value: "6",
      subtitle: "Attribute groups",
      icon: "📊",
      color: "text-purple-600",
    },
  ];

  const getRequiredColor = (required: string) => {
    switch (required) {
      case "Required":
        return "bg-red-100 text-red-800";
      case "Optional":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dropdown":
        return "bg-blue-100 text-blue-800";
      case "text":
        return "bg-green-100 text-green-800";
      case "number":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Add Attribute Button */}
      <div className="flex justify-end">
        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
          + Add Attribute
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Attributes Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Product Attributes</h2>
          <p className="text-gray-600 text-sm">
            Define product characteristics for specifications
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search attributes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter by Type
            </Button>
            <Button variant="outline" size="sm">
              Sort by Category
            </Button>
          </div>
        </div>

        {/* Attributes Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Attribute Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Values
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Required
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Usage
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allAttributes.length > 0 ? (
                allAttributes.map((attribute, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-600">----</div>
                        <span className="font-medium">{attribute.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={""}>---</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">---</td>
                    <td className="py-4 px-4 text-gray-600">---</td>
                    <td className="py-4 px-4">
                      <Badge className={getRequiredColor("required")}>
                        ---
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">---</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Values
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No attributes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
