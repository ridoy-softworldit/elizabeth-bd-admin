"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  useGetAllFooterSettingsQuery,
  useDeleteFooterSettingsMutation,
  IFooterSettings,
} from "@/redux/featured/footer/footerApi";
import SimpleMenuForm from "@/components/forms/SimpleMenuForm";
import Swal from "sweetalert2";

export default function FooterSettingsPage() {
  const { data: footerSettings = [], isLoading } = useGetAllFooterSettingsQuery();
  const [deleteFooterSettings] = useDeleteFooterSettingsMutation();
  
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<{settingsId: string, menuIndex: number, menu: any} | null>(null);

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
        await deleteFooterSettings(id).unwrap();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Footer setting has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting footer settings:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete footer setting.",
        });
      }
    }
  };

  const handleMenuSuccess = () => {
    setShowMenuForm(false);
    setEditingMenu(null);
  };

  const handleEditMenu = (settingsId: string, menuIndex: number) => {
    const settings = footerSettings.find(s => s._id === settingsId);
    const menu = settings?.menus[menuIndex];
    setEditingMenu({ settingsId, menuIndex, menu });
    setShowMenuForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Footer Settings</h1>
        <Button onClick={() => setShowMenuForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu
        </Button>
      </div>

      {showMenuForm && (
        <div className="mb-6">
          <SimpleMenuForm 
            editingData={editingMenu}
            onSuccess={handleMenuSuccess}
            onCancel={() => {
              setShowMenuForm(false);
              setEditingMenu(null);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          footerSettings.flatMap((settings) => 
            settings.menus.map((menu, menuIndex) => (
              <Card key={`${settings._id}-${menuIndex}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{menu.menuTitle}</CardTitle>
                      <p className="text-sm text-gray-500">Order: {menu.order} • {menu.submenus.filter(s => s.isActive).length} Active Submenus</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {menu.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleEditMenu(settings._id, menuIndex)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(settings._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {menu.submenus.map((submenu, submenuIndex) => (
                      <div key={submenuIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{submenu.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${submenu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {submenu.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {submenu.isDynamicPage && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Dynamic Page
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{submenu.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}