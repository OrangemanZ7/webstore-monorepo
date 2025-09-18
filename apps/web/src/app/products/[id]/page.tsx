// Define types locally
interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  // Add other fields you want to display
}

// Data fetching function
async function getProduct(id: string): Promise<IProduct | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/public/products/${id}`, {
      cache: "no-store",
    });
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

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 w-full rounded-lg"></div>{" "}
        {/* Image Placeholder */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-gray-800 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
