"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useGetAllAuthorsQuery,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} from "@/redux/featured/author/authorApi";
import { Edit, Trash2, Loader2, X, Users, Camera } from "lucide-react";
import { toast } from "sonner";

export default function AllAuthors() {
  const { data: authors = [], isLoading, refetch } = useGetAllAuthorsQuery();
  const [updateAuthor, { isLoading: updating }] = useUpdateAuthorMutation();
  const [deleteAuthor, { isLoading: deleting }] = useDeleteAuthorMutation();

  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    preview: "",
  });

  // Handle Edit Click
  const handleEdit = (author: any) => {
    setSelectedAuthor(author);
    setFormData({
      name: author.name || "",
      description: author.description || "",
      image: null,
      preview: author.image || "",
    });
    setShowModal(true);
  };

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuthor?._id) return;

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      if (formData.image) fd.append("image", formData.image);

      await updateAuthor({ id: selectedAuthor._id, formData: fd }).unwrap();
      toast.success("Author updated successfully!");
      setShowModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update author");
    }
  };
  const MySwal = withReactContent(Swal);
  // Handle Delete
  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this author?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteAuthor(id).unwrap();
        Swal.fire("Deleted!", "Author has been deleted.", "success");
        refetch();
      } catch (error: any) {
        Swal.fire(
          "Error!",
          error?.data?.message || "Failed to delete author",
          "error"
        );
      }
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-gray-600">Loading authors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 ">
      <div className="md:mx-5 mx-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-blue-600">All Authors</h2>
          </div>
          <p className="text-gray-600 ml-15">Manage your author profiles</p>
        </div>

        {authors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No authors found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first author to get started!
            </p>
          </div>
        ) : (
          // Make table horizontally scrollable on mobile
          <div className="overflow-x-auto rounded-sm ">
            <div className="bg-white rounded-sm md:min-w-[800px] min-w-[850px]">
              {/* Table Header */}
              <div className="bg-blue-400 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-white font-semibold">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-3">Author</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2 text-center">Followers</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {authors.map((author: any, index: number) => (
                  <div
                    key={author._id}
                    className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center min-w-[800px]">
                      {/* Index */}
                      <div className="col-span-1 text-center">
                        <span className="text-gray-500 font-medium">
                          {index + 1}
                        </span>
                      </div>

                      {/* Author Info */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-blue-200">
                            <Image
                              src={author.image || "/placeholder.png"}
                              alt={author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {author.name}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-span-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {author.description || "No description available"}
                        </p>
                      </div>

                      {/* Followers */}
                      <div className="col-span-2 text-center">
                        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-semibold text-blue-600">
                            {author.followersCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(author)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(author._id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-1">
                  Edit Author
                </h3>
                <p className="text-gray-500 text-sm">
                  Update author information
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Author Photo
                  </label>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 bg-blue-50 flex items-center justify-center">
                      {formData.preview ? (
                        <Image
                          src={formData.preview}
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Camera className="w-10 h-10 text-blue-300" />
                      )}
                    </div>
                    <label
                      htmlFor="edit-file"
                      className="absolute bottom-0 right-0 bg-blue-400 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-500 transition-all duration-300 hover:scale-110"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <Input
                      id="edit-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 py-5"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biography
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-5 border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-5 bg-blue-400 hover:bg-blue-500 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Author"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
