"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  useGetAllDynamicPagesQuery,
  useCreateDynamicPageMutation,
  useUpdateDynamicPageMutation,
  useDeleteDynamicPageMutation,
  IDynamicPage,
} from "@/redux/featured/dynamic-pages/dynamicPagesApi";
import Swal from "sweetalert2";

export default function DynamicPagesPage() {
  const { data: pages = [], isLoading } = useGetAllDynamicPagesQuery();
  const [createDynamicPage] = useCreateDynamicPageMutation();
  const [updateDynamicPage] = useUpdateDynamicPageMutation();
  const [deleteDynamicPage] = useDeleteDynamicPageMutation();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<IDynamicPage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    pageContent: "",
    isActive: true,
  });
  const [heroImage, setHeroImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString());
    });
    if (heroImage) {
      form.append("heroImage", heroImage);
    }

    try {
      if (editingPage) {
        await updateDynamicPage({ id: editingPage._id, formData: form }).unwrap();
      } else {
        await createDynamicPage(form).unwrap();
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: editingPage ? "Page updated successfully!" : "Page created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      resetForm();
    } catch (error) {
      console.error("Error saving page:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error saving page. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDynamicPage(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Page has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting page:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete page.",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      pageContent: "",
      isActive: true,
    });
    setHeroImage(null);
    setEditingPage(null);
    setShowForm(false);
  };

  const startEdit = (page: IDynamicPage) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      pageContent: page.pageContent || "",
      isActive: page.isActive,
    });
    setEditingPage(page);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dynamic Pages</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingPage ? "Edit Page" : "Add New Page"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="heroImage">Hero Image</Label>
                <Input
                  id="heroImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="pageContent">Page Content</Label>
                <Textarea
                  id="pageContent"
                  value={formData.pageContent}
                  onChange={(e) => setFormData({...formData, pageContent: e.target.value})}
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingPage ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page._id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                    <span className={`text-xs px-2 py-1 rounded ${page.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(page)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(page._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}