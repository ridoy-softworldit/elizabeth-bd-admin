import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";

interface Props {
  products: Product[];
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-blue-100 text-blue-800";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProductTable = ({ products, isLoading }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Product
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              SKU
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Category
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Stock
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Min Stock
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Price
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8}>Loading...</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4 font-medium">
                  {product.description.name}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {product.productInfo.sku}
                </td>
                <td className="py-4 px-4 text-gray-600">---</td>
                <td className="py-4 px-4">{product.productInfo.quantity}</td>
                <td className="py-4 px-4 text-gray-600">---</td>
                <td className="py-4 px-4">
                  <Badge className={getStatusColor(product.description.status)}>
                    {product.description.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 font-medium">
                  {product.productInfo.price}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Restock
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
