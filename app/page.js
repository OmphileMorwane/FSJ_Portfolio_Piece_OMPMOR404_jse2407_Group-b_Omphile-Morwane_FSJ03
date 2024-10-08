import Link from "next/link";
import SkeletonLoader from "./components/SkeletonLoader";
import ProductsImageCorousel from "./components/ProductsImageCorousel";
import SearchBar from "./components/SearchBar";
import Sort from "./components/Sort";
import Filter from "./components/Filter";
import Pagination from "./components/Pagination";
import ResetButton from "./components/ResetButton";
import { fetchProducts } from "./api/productApi"; // Import the fetchProducts function
import "./globals.css";

export const dynamic = "force-dynamic"; // You can also use "force-static" for static pages

/**
 * ProductsPage component renders the products page with sorting, filtering,
 * pagination, and other product-related features.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.searchParams - URL search parameters for filtering products.
 * @param {string} props.searchParams.page - The current page for pagination (optional).
 * @param {string} props.searchParams.query - The search query entered by the user (optional).
 * @param {string} props.searchParams.sort - The sort parameter for products (optional).
 * @param {string} props.searchParams.order - The order of sorting (asc or desc) (optional).
 * @param {string} props.searchParams.category - The selected product category for filtering (optional).
 * @returns {JSX.Element} The rendered component.
 */
export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const searchQuery = searchParams.query || "";
  const selectedSort = searchParams.sort || "default";
  const selectedOrder = searchParams.order || "asc"; // Get order
  const selectedCategory = searchParams.category || "";

  let sortBy = "id"; // Default sort field
  let order = "asc"; // Default order

  // Determine sort parameters based on user selection
  if (selectedSort === "price") {
    sortBy = "price";
    order = selectedOrder; // Use order from query
  }

  let products = [];
  let hasMore = false;
  let error = null;

  try {
    const { products: fetchedProducts, hasMore: more } = await fetchProducts(
      page,
      searchQuery,
      sortBy,
      order, // Pass order to the API
      selectedCategory
    );
    products = fetchedProducts;
    hasMore = more;
  } catch (err) {
    error = "Failed to load products. Please try again later.";
    console.error(err);
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-stone-100">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <SearchBar searchQuery={searchQuery} />

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Filter
            categories={["Category1", "Category2"]}
            selectedCategory={selectedCategory}
          />
          <Sort selectedSort={selectedSort} selectedOrder={selectedOrder} />
        </div>
        <ResetButton />
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-stone-200 bg-stone-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              {product.images.length > 1 ? (
                <ProductsImageCorousel images={product.images} />
              ) : (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-40 w-full object-contain"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {product.title}
                </h2>
                <p className="text-green-600 font-bold mt-2">
                  ${product.price}
                </p>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <Link
                  href={`/${product.id}`}
                  className="inline-block mt-2 px-1 py-1 bg-green-600 text-white rounded hover:bg-green-900"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} hasMore={hasMore} />
    </div>
  );
}
