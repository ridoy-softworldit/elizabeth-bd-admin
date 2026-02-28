import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiOutlinePrinter } from "react-icons/ai";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/shared/Select";
import { Input } from "@/components/ui/input";
import { DatePickerForm } from "@/components/shared/DatePickerForm";

const AddNewTerms = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center flex-wrap gap-4">
          <p className="flex items-center text-xs text-gray-600">
            <IoMdArrowBack className="mr-1" /> Back to Terms
          </p>
          <h2 className="text-2xl font-bold">Add New Terms & Policy</h2>
        </div>
        <div className="flex gap-2">
          <p className="border border-gray-300 p-2 rounded flex items-center gap-2">
            <MdOutlineRemoveRedEye /> Preview
          </p>
          <p className="text-white bg-black p-2 rounded flex items-center gap-2">
            <AiOutlinePrinter /> Save Document
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:flex-[2]">
          <form className="border p-6 md:p-10 bg-white rounded-xl">
            <h2 className="font-semibold text-2xl mb-1">Document Details</h2>
            <p className="text-gray-400 mb-6 text-sm">Create a new legal document or policy.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
              <div>
                <label className="block mb-1 font-semibold">Document Title*</label>
                <input
                  type="text"
                  placeholder="e.g., Terms of Service"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Document Type*</label>
                <Select
                  options={["Terms of Service", "Privacy Policy", "Refund Policy"]}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Version</label>
                <input
                  type="text"
                  placeholder="1.0"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Effective Date</label>
                <DatePickerForm />
              </div>
            </div>
            <div className="my-6 text-sm">
              <label className="block mb-1 font-semibold">Document Content*</label>
              <textarea
                rows={7}
                placeholder="Enter the complete document content..."
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

          </form>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-[350px]">
          <div className="border p-5 bg-white rounded-lg space-y-5">
            <div>
              <h2 className="font-semibold text-lg">Publishing Options</h2>
              <p className="text-sm text-gray-500">Control document visibility and status.</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Publish Status</h3>
                <p className="text-sm text-gray-500">Make this document live</p>
              </div>
              <Switch />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Current Status</h2>
              <p className="text-sm w-fit bg-gray-200 px-2  rounded-xl">Draft</p>
            </div>
          </div>
          <div className="border p-5 bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Import Document</h2>
            <p className="text-gray-400 text-sm mb-2">Upload an existing document file.</p>
            <Input type="file" className="my-5" />
            <p className="text-gray-400 text-sm mt-1">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>
          <div className="border p-5 bg-white rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Document Guidelines</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use clear, simple language</li>
              <li>Include effective dates</li>
              <li>Review legal compliance</li>
              <li>Version control changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewTerms;
