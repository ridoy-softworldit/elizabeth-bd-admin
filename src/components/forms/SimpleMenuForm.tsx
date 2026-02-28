"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useCreateFooterSettingsMutation, useUpdateFooterSettingsMutation, useGetAvailablePagesQuery, useCreateSubmenuWithPageMutation } from "@/redux/featured/footer/footerApi";
import Swal from "sweetalert2";

interface SimpleMenuFormProps {
  editingData?: { settingsId: string; menuIndex: number; menu: any } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SubmenuItem {
  title: string;
  linkType: "existing" | "new" | "external";
  url: string;
  selectedPageUrl: string;
  pageTitle: string;
  pageSlug: string;
  pageContent: string;
  heroImage: File | null;
  isActive: boolean;
  isDynamicPage: boolean;
}

export default function SimpleMenuForm({ editingData, onSuccess, onCancel }: SimpleMenuFormProps) {
  const [createFooterSettings, { isLoading }] = useCreateFooterSettingsMutation();
  const [updateFooterSettings] = useUpdateFooterSettingsMutation();
  const [createSubmenuWithPage] = useCreateSubmenuWithPageMutation();
  const { data: availablePages = [] } = useGetAvailablePagesQuery();

  const [menuTitle, setMenuTitle] = useState(editingData?.menu?.menuTitle || "");
  const [menuOrder, setMenuOrder] = useState(editingData?.menu?.order || 1);
  const [submenus, setSubmenus] = useState<SubmenuItem[]>(
    editingData?.menu?.submenus?.map((sub: any) => ({
      title: sub.title,
      linkType: sub.isDynamicPage ? "existing" : "external",
      url: sub.url,
      selectedPageUrl: sub.isDynamicPage ? sub.url : "",
      pageTitle: "",
      pageSlug: "",
      pageContent: "",
      heroImage: null,
      isActive: sub.isActive,
      isDynamicPage: sub.isDynamicPage,
    })) || [
      {
        title: "",
        linkType: "external",
        url: "",
        selectedPageUrl: "",
        pageTitle: "",
        pageSlug: "",
        pageContent: "",
        heroImage: null,
        isActive: true,
        isDynamicPage: false,
      }
    ]
  );

  const addSubmenu = () => {
    setSubmenus([...submenus, {
      title: "",
      linkType: "external",
      url: "",
      selectedPageUrl: "",
      pageTitle: "",
      pageSlug: "",
      pageContent: "",
      heroImage: null,
      isActive: true,
      isDynamicPage: false,
    }]);
  };

  const removeSubmenu = (index: number) => {
    setSubmenus(submenus.filter((_, i) => i !== index));
  };

  const updateSubmenu = (index: number, field: keyof SubmenuItem, value: any) => {
    const updated = [...submenus];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-set isDynamicPage based on linkType
    if (field === "linkType") {
      updated[index].isDynamicPage = value !== "external";
      if (value === "existing") {
        updated[index].url = updated[index].selectedPageUrl;
      }
    }
    
    if (field === "selectedPageUrl") {
      updated[index].url = value;
    }

    setSubmenus(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuTitle.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter menu title",
      });
      return;
    }

    if (submenus.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please add at least one submenu",
      });
      return;
    }

    // Validate submenus
    for (let i = 0; i < submenus.length; i++) {
      const submenu = submenus[i];
      if (!submenu.title.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please enter title for submenu ${i + 1}`,
        });
        return;
      }
      if (submenu.linkType === "existing" && !submenu.selectedPageUrl) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please select a page for submenu ${i + 1}`,
        });
        return;
      }
      if (submenu.linkType === "external" && !submenu.url.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please enter URL for submenu ${i + 1}`,
        });
        return;
      }
      if (submenu.linkType === "new") {
        if (!submenu.pageTitle.trim()) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: `Please enter page title for submenu ${i + 1}`,
          });
          return;
        }
        if (!submenu.pageSlug.trim()) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: `Please enter page slug for submenu ${i + 1}`,
          });
          return;
        }
        if (!submenu.pageContent.trim()) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: `Please enter page content for submenu ${i + 1}`,
          });
          return;
        }
      }
    }

    try {
      // Handle submenus with new dynamic pages
      for (const submenu of submenus) {
        if (submenu.linkType === "new") {
          const form = new FormData();
          form.append("menuTitle", menuTitle.trim());
          form.append("submenuTitle", submenu.title.trim());
          form.append("slug", submenu.pageSlug.trim());
          form.append("pageTitle", submenu.pageTitle.trim());
          form.append("pageContent", submenu.pageContent.trim());
          
          if (submenu.heroImage) {
            form.append("heroImage", submenu.heroImage);
          }

          await createSubmenuWithPage(form).unwrap();
        }
      }

      // Create regular menu for non-new submenus
      const regularSubmenus = submenus.filter(s => s.linkType !== "new");
      if (regularSubmenus.length > 0) {
        const menuData = {
          menus: [{
            menuTitle: menuTitle.trim(),
            order: menuOrder,
            isActive: true,
            submenus: regularSubmenus.map(submenu => ({
              title: submenu.title.trim(),
              url: submenu.url,
              isDynamicPage: submenu.isDynamicPage,
              isActive: submenu.isActive,
            }))
          }],
          isActive: true
        };

        if (editingData) {
          await updateFooterSettings({
            id: editingData.settingsId,
            data: menuData
          }).unwrap();
        } else {
          await createFooterSettings(menuData).unwrap();
        }
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: editingData ? "Menu updated successfully!" : "Menu created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving menu:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error saving menu. Please try again.",
      });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold">
          {editingData ? "Edit Menu" : "Add New Menu"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Menu Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="menuTitle">Menu Title *</Label>
              <Input
                id="menuTitle"
                value={menuTitle}
                onChange={(e) => setMenuTitle(e.target.value)}
                placeholder="e.g., আমাদের সম্পর্কে জানুন"
                required
              />
            </div>
            <div>
              <Label htmlFor="menuOrder">Display Order</Label>
              <Input
                id="menuOrder"
                type="number"
                value={menuOrder}
                onChange={(e) => setMenuOrder(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
          </div>

          {/* Submenus */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Submenus</Label>
              <Button 
                type="button" 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                onClick={addSubmenu}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Submenu
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {submenus.map((submenu, index) => (
                <Card key={index} className="p-3 border-l-4 border-l-gradient-to-b from-emerald-500 to-teal-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm">Submenu {index + 1}</h4>
                    {submenus.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSubmenu(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label>Submenu Title *</Label>
                      <Input
                        value={submenu.title}
                        onChange={(e) => updateSubmenu(index, "title", e.target.value)}
                        placeholder="e.g., আমাদের সম্পর্কে"
                        required
                      />
                    </div>
                    <div>
                      <Label>Link Type</Label>
                      <Select 
                        value={submenu.linkType} 
                        onValueChange={(value: "existing" | "new" | "external") => updateSubmenu(index, "linkType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="external">External URL</SelectItem>
                          <SelectItem value="existing">Existing Dynamic Page</SelectItem>
                          <SelectItem value="new">Create New Dynamic Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Link Type Specific Fields */}
                  {submenu.linkType === "external" && (
                    <div>
                      <Label>URL *</Label>
                      <Input
                        value={submenu.url}
                        onChange={(e) => updateSubmenu(index, "url", e.target.value)}
                        placeholder="/about-us/ or https://external-site.com"
                        required
                      />
                    </div>
                  )}

                  {submenu.linkType === "existing" && (
                    <div>
                      <Label>Select Existing Page *</Label>
                      <Select 
                        value={submenu.selectedPageUrl} 
                        onValueChange={(value) => updateSubmenu(index, "selectedPageUrl", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a page" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePages.map((page) => (
                            <SelectItem key={page.id} value={page.url}>
                              {page.title} ({page.url})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {submenu.linkType === "new" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Page Title *</Label>
                          <Input
                            value={submenu.pageTitle}
                            onChange={(e) => updateSubmenu(index, "pageTitle", e.target.value)}
                            placeholder="Page title"
                            required
                          />
                        </div>
                        <div>
                          <Label>Page Slug *</Label>
                          <Input
                            value={submenu.pageSlug}
                            onChange={(e) => updateSubmenu(index, "pageSlug", e.target.value)}
                            placeholder="page-slug"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Hero Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateSubmenu(index, "heroImage", e.target.files?.[0] || null)}
                        />
                      </div>
                      
                      <div>
                        <Label>Page Content *</Label>
                        <Textarea
                          value={submenu.pageContent}
                          onChange={(e) => updateSubmenu(index, "pageContent", e.target.value)}
                          placeholder="Enter the content for this page..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      checked={submenu.isActive}
                      onCheckedChange={(checked) => updateSubmenu(index, "isActive", checked)}
                    />
                    <Label>Active</Label>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (editingData ? "Updating..." : "Creating...") : (editingData ? "Update Menu" : "Create Menu")}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 transition-colors duration-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}