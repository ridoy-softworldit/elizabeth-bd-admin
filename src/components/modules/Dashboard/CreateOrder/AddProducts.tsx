import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products } from "@/data/CreateOrder";
import SearchInput from "@/components/shared/SearchInput";

const AddProducts = () => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-semibold opacity-90">Add Products</h2>
        <p className="text-sm mb-8 opacity-60">
          Search and add products to the order
        </p>
        <SearchInput
          placeholder="Search products by name or SKU..."
          className="mb-4"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.sku}
              className="border rounded-md p-3 flex flex-col justify-between"
            >
              <div className="flex justify-between">
                <div>
                  <p className="">{product.name}</p>
                  <p className="text-sm opacity-60">{product.sku}</p>
                </div>
                <span className="text-xs opacity-60">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#023337] text-sm">${product.price}</p>
                <Button variant={"outline"} size="sm">
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddProducts;
