// src/components/ParentCategoryForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultipleSelector, Option } from "@/components/ui/multiple-selector";
import {
  useCreateParentCategoryMutation,
  useUpdateParentCategoryMutation,
  useGetAllParentCategoriesQuery,
} from "@/redux/featured/parentCategory/parentCategoryApi";
import { IParentCategory } from "@/types/ParentCategory";
import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  initialData?: IParentCategory | null;
  onSuccess?: () => void;
}

export const ParentCategoryForm = ({ initialData, onSuccess }: Props) => {
  const [createPC] = useCreateParentCategoryMutation();
  const [updatePC] = useUpdateParentCategoryMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      categories: initialData?.categories.map((c) => c._id) || [],
    },
  });

  const simplifiedCategories: Option[] =
    categoriesData?.map((cat: any) => ({
      value: cat._id,
      label: cat.name,
    })) ?? [];

  const onSubmit = async (values: FormValues) => {
    try {
      if (initialData) {
        await updatePC({
          id: initialData._id,
          ...values,
        }).unwrap();
      } else {
        await createPC(values).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Books" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                {isCategoriesLoading ? (
                  <Input
                    disabled
                    placeholder="Loading..."
                    className="animate-pulse"
                  />
                ) : (
                  <MultipleSelector
                    value={
                      field.value
                        .map((id) =>
                          simplifiedCategories.find((opt) => opt.value === id)
                        )
                        .filter(Boolean) as Option[]
                    }
                    onChange={(options) =>
                      field.onChange(options.map((opt) => opt.value))
                    }
                    defaultOptions={simplifiedCategories}
                    placeholder="Select categories..."
                    emptyIndicator={
                      <p className="text-center text-sm">
                        No categories found.
                      </p>
                    }
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update" : "Create"} Parent Category
        </Button>
      </form>
    </Form>
  );
};
