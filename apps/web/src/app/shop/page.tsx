// Define types
interface IProduct {
  _id: string;
  name: string;
  price: number;
}

// Data fetching function that accepts an optional category slug
async function getProducts(categorySlug?: string): Promise<IProduct[]> {
  try {
    // Append the category to the URL if it exists
    const url = `http://localhost:3001/api/public/products${
      categorySlug ? `?category=${categorySlug}` : ""
    }`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// The Page component receives searchParams from the URL
export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // Fetch products, passing the category from searchParams
  const products = await getProducts(searchParams.category);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {searchParams.category
          ? `Category: ${searchParams.category}`
          : "All Products"}
      </h1>
      {products.length > 0 ? (
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
      ) : (
        <p>No products found in this category.</p>
      )}
    </main>
  );
}
