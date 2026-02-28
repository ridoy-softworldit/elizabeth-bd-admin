import { IoPersonAddOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BecomeSeller = () => {
  return (
    <div className="space-y-8 mx-3 py-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <div className="bg-white p-6 flex flex-col justify-between rounded-lg border-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg">Total Applications</h2>
            <IoPersonAddOutline className="text-gray-400 text-xl" />
          </div>
          <h2 className="font-bold text-2xl mt-3">3</h2>
          <p className="text-gray-400 text-sm">Seller applications</p>
        </div>
        <div className="bg-white p-6 flex flex-col justify-between rounded-lg border-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg">Pending</h2>
            <LuClock4 className="text-yellow-400 text-xl" />
          </div>
          <h2 className="font-bold text-2xl mt-3">1</h2>
          <p className="text-gray-400 text-sm">Awaiting review</p>
        </div>
        <div className="bg-white p-6 flex flex-col justify-between rounded-lg border-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg">Approved</h2>
            <FaRegCircleCheck className="text-green-400 text-xl" />
          </div>
          <h2 className="font-bold text-2xl mt-3">1</h2>
          <p className="text-gray-400 text-sm">Active sellers</p>
        </div>
        <div className="bg-white p-6 flex flex-col justify-between rounded-lg border-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg">Rejected</h2>
            <VscError className="text-red-400 text-xl" />
          </div>
          <h2 className="font-bold text-2xl mt-3">1</h2>
          <p className="text-gray-400 text-sm">Declined applications</p>
        </div>
      </div>
      <div className="bg-white p-5 border-2 rounded-lg">
        <h2 className="text-2xl font-semibold">Seller Applications</h2>
        <p className="text-gray-400">Review and manage seller registration applications.</p>
        <input
          type="text"
          placeholder="Search applications..."
          className="w-full my-5 p-2 text-sm rounded-lg border border-gray-200"
        />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader >
              <TableRow >
                <TableHead className="text-gray-400">Applicant</TableHead>
                <TableHead className="text-gray-400">Business Name</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Applied Date</TableHead>
                <TableHead className="text-gray-400">Documents</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>
                  <p>Sarah Johnson</p>
                  <p className="text-gray-400">sarah@fashion.com</p>
                </TableCell>
                <TableCell>Fashion Forward</TableCell>
                <TableCell>
                  <Badge variant="outline">Clothing</Badge>
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <FaRegCircleCheck className="text-green-400" />
                  <p className="text-green-500 bg-green-100 px-2 py-1 rounded-md">approved</p>
                </TableCell>
                <TableCell>2024-01-18</TableCell>
                <TableCell>3 document(s)</TableCell>
                <TableCell>View Details</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <p>Sarah Johnson</p>
                  <p className="text-gray-400">sarah@fashion.com</p>
                </TableCell>
                <TableCell>Fashion Forward</TableCell>
                <TableCell>
                  <Badge variant="outline">Clothing</Badge>
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <FaRegCircleCheck className="text-green-400" />
                  <p className="text-green-500 bg-green-100 px-2 py-1 rounded-md">approved</p>
                </TableCell>
                <TableCell>2024-01-18</TableCell>
                <TableCell>3 document(s)</TableCell>
                <TableCell>View Details</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
