// Define types locally for simplicity
interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface IProduct {
  _id: string;
  name: string;
  price: number;
  // Add other fields as needed, e.g., images
}

// Data fetching function for products
async function getProducts() {
  try {
    const res = await fetch("http://localhost:3001/api/public/products", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return data.data as IProduct[];
  } catch (error) {
    console.error(error);
    return []; // Return empty array on error
  }
}

// Data fetching function for categories
async function getCategories() {
  try {
    const res = await fetch("http://localhost:3001/api/public/categories", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await res.json();
    return data.data as ICategory[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// The main Homepage Server Component
export default async function HomePage() {
  // Fetch data directly in the server component
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="bg-white">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            WebStore
          </a>
          <ul className="flex space-x-6">
            {/* Add an "All Products" link */}
            <li>
              <a href="/shop" className="text-gray-600 hover:text-black">
                All Products
              </a>
            </li>
            {categories.map((category) => (
              <li key={category._id}>
                {/* Update the href to use the /shop?category=... structure */}
                <a
                  href={`/shop?category=${category.slug}`}
                  className="text-gray-600 hover:text-black"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Our Products</h2>
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
    </div>
  );
}
