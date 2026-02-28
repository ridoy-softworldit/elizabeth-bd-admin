"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Eye, Search } from "lucide-react";
import FaqStatCard from "@/components/modules/Dashboard/faqs/StatCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simulated async fetch (replace with actual API call in the future)
const mockFaqData = [
  {
    question: "How do I create a new shop?",
    category: "Shop Management",
    status: "published",
    created: "2024-01-15",
    updated: "2024-01-20",
  },
  {
    question: "What payment methods are accepted?",
    category: "Payments",
    status: "draft",
    created: "2024-01-10",
    updated: "2024-01-18",
  },
  {
    question: "How long does shipping?",
    category: "Shipping",
    status: "published",
    created: "2024-01-08",
    updated: "2024-01-22",
  },
];

export default function FaqTableOnly() {
  const [faqs, setFaqs] = useState<typeof mockFaqData>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setFaqs(mockFaqData);
    }, 200);
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  // Stat Calculations
  const total = faqs.length;
  const published = faqs.filter((f) => f.status === "published").length;
  const drafts = faqs.filter((f) => f.status === "draft").length;
  const uniqueCategories = new Set(faqs.map((f) => f.category)).size;

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-end">
        <Button className="bg-[#1E1F25] hover:bg-[#2c2d34] text-white rounded-lg px-6 h-10 text-sm font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add New FAQ
        </Button>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <FaqStatCard
          title="Total FAQs"
          value={total}
          description="All frequently asked questions"
        />
        <FaqStatCard
          title="Published"
          value={published}
          description="Live on website"
        />
        <FaqStatCard
          title="Drafts"
          value={drafts}
          description="Pending publication"
        />
        <FaqStatCard
          title="Categories"
          value={uniqueCategories}
          description="Different topics"
        />
      </div>

      {/* FAQ Table */}
      <Card className="p-6 rounded-xl">
        {/* Title & Search */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">FAQs</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your frequently asked questions and help content.
          </p>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md overflow-hidden border-b">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#979797]">Question</TableHead>
                <TableHead className="text-[#979797]">Category</TableHead>
                <TableHead className="text-[#979797]">Status</TableHead>
                <TableHead className="text-[#979797]">Created</TableHead>
                <TableHead className="text-[#979797]">Updated</TableHead>
                <TableHead className="text-[#979797] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaqs.map((faq, index) => (
                <TableRow key={index}>
                  <TableCell className="py-4">{faq.question}</TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full border text-muted-foreground">
                      {faq.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        faq.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {faq.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">{faq.created}</TableCell>
                  <TableCell className="py-4">{faq.updated}</TableCell>
                  <TableCell className="py-4 flex justify-end">
                    <Eye className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}

              {filteredFaqs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No FAQs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
