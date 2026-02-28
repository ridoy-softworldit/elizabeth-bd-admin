"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  XCircle,
  Calendar,
  Hash,
  FileText,
  Tag as TagIcon,
  Info,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDeleteTagMutation,
  useGetAlltagsQuery,
} from "@/redux/featured/tags/tagsApi";
import { setTags } from "@/redux/featured/tags/tagsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ITag } from "@/types/tags";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2

const TagManagement = () => {
  const { data: allTags, isLoading, refetch } = useGetAlltagsQuery(); // Add refetch to refresh data
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteTag] = useDeleteTagMutation(); // Use the delete mutation hook

  useEffect(() => {
    if (allTags) {
      dispatch(setTags(allTags as ITag[]));
    }
  }, [dispatch, allTags]);

  const handleViewTag = (tag: ITag) => {
    setSelectedTag(tag);
    setOpen(true);
  };

  const handleDeleteTag = async (tagId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteTag(tagId).unwrap();
        Swal.fire("Deleted!", "The tag has been deleted.", "success");
        refetch(); // Refresh the tag list after deletion
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the tag.", "error");
        console.error("Failed to delete tag:", error);
      }
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Add Tag Button */}
      <div className="flex justify-end">
        <Link href={"/admin/create-tag"}>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white">
            + Add Tag
          </Button>
        </Link>
      </div>

      {/* Tag Management Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-amber-600" />
            Tag Management
          </h2>
          <p className="text-gray-600 text-sm">
            Organize and label your products with tags for better filtering and
            discoverability.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tags"
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
              Sort by Usage
            </Button>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div>Loading.......</div>
          ) : (
            allTags
              ?.filter((tag) =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((tag, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-lg transition-all border border-gray-100 rounded-xl flex flex-col justify-between h-full"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Tag Image */}
                    {tag.image && (
                      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={tag.image}
                          alt={tag.name}
                          fill
                          className="object-cover"
                          unoptimized={tag.image.startsWith("http")}
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-amber-100 text-black text-sm">
                        {tag.name}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm flex-grow">
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <span className="ml-2 font-medium">
                          {tag.details.length > 60
                            ? `${tag.details.slice(0, 60)}...`
                            : tag.details}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Link
                        href={`/admin/edit-tag/${tag._id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleViewTag(tag)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleDeleteTag(tag._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>

      {/* Tag Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto">
          {selectedTag && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 sticky top-0 bg-white pt-4 pb-2 z-10 border-b">
                  <Info className="w-5 h-5 text-amber-600" />
                  {selectedTag.name}
                </DialogTitle>
                <DialogDescription className="sticky top-10 bg-white z-10 px-4 mb-2">
                  Complete information about this tag
                </DialogDescription>
              </DialogHeader>

              {/* Main Image */}
              {selectedTag.image && (
                <div className="w-full flex justify-center mb-4 px-4">
                  <Image
                    src={selectedTag.image}
                    alt={selectedTag.name}
                    width={500}
                    height={250}
                    className="rounded-lg w-full sm:w-3/4 h-48 sm:h-52 object-cover border"
                    priority
                  />
                </div>
              )}

              {/* Details Section */}
              <div className="space-y-5 px-4 pb-4">
                {/* Basic Information */}
                <div>
                  <h4 className="text-gray-700 font-semibold mb-2 border-b pb-1">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        <strong>Slug:</strong> {selectedTag.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 leading-relaxed">
                        <strong>Details:</strong> {selectedTag.details}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Icon Section */}
                <div>
                  <h4 className="text-gray-700 font-semibold mb-2 border-b pb-1">
                    Icon Information
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      <strong>Name:</strong> {selectedTag.icon?.name}
                    </div>
                    {selectedTag.icon?.url && (
                      <div className="relative w-28 h-28">
                        <Image
                          src={selectedTag.icon.url}
                          alt="Icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="text-gray-700 font-semibold mb-2 border-b pb-1">
                    Additional Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Created:{" "}
                      {new Date(selectedTag.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Updated:{" "}
                      {new Date(selectedTag.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end px-4 pb-4">
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-700"
                >
                  <XCircle className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagManagement;
