// Define types locally
interface ICategory {
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
}

interface PageData {
  category: ICategory;
  products: IProduct[];
}

// Data fetching function
async function getCategoryProducts(slug: string): Promise<PageData | null> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/public/categories/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// The Page component receives params from the URL
export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCategoryProducts(params.slug);

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Category not found</h1>
      </main>
    );
  }

  const { category, products } = data;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Category: {category.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <div className="bg-gray-200 h-48 w-full rounded-md mb-4"></div>{" "}
            {/* Image Placeholder */}
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-lg font-bold mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
