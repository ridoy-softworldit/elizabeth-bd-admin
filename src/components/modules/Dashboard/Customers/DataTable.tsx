'use client';
import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation } from '@/redux/featured/user/userApi';
import toast from 'react-hot-toast';

export function DataTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { data: userResponse, isLoading } = useGetAllUsersQuery({ 
    page: currentPage, 
    limit: itemsPerPage,
    role: 'customer'
  });
  
  const users = userResponse?.data || [];
  const meta = userResponse?.meta;
  
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-4 w-full max-w-full overflow-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left p-3">NAME</th>
              <th className="text-left p-3">PHONE NUMBER</th>
              <th className="text-left p-3">CREATED</th>
              <th className="text-left p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user: any) => (
              <tr key={user._id} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || 'N/A'}</div>
                    <div className="text-gray-500 text-xs">{user.email || 'N/A'}</div>
                  </div>
                </td>
                <td className="p-3">{user.phone || 'N/A'}</td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex gap-3">
                  <button className="text-blue-500 hover:underline text-xs">Edit</button>
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </>
  );
}
