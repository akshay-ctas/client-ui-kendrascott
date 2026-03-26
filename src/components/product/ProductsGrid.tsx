"use client";

import { getProductsForSearch } from "@/services/product.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductSideBar from "./ProductSideBar";

export default function ProductsGrid({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price_asc");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "products",
      search,
      page,
      selectedCategories,
      priceRange.min,
      priceRange.max,
      sortBy,
    ],
    queryFn: () =>
      getProductsForSearch(
        search,
        page,
        selectedCategories,
        priceRange.min,
        priceRange.max,
        sortBy,
      ),
    placeholderData: keepPreviousData,
    enabled: true,
  });

  const products = res?.products ?? [];
  const total = res?.total;
  const totalPages = res?.totalPages;

  if (isLoading)
    return (
      <div className="py-20 text-center text-stone-400 text-sm">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center text-red-400 text-sm">
        Error loading products
      </div>
    );

  if (products.length === 0)
    return (
      <div className=" mx-auto px-6 py-10">
        <div className="flex gap-8 ">
          <div className="w-120 px-3 py-4 rounded ring-yellow-200 ring-1 ">
            <h1 className="text-xl uppercase tracking-widest   text-yellow-500">
              Filter
            </h1>
            <div className="border-b py-1 border-yellow-500 "></div>
            <ProductSideBar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          {search ? `No results found for "${search}"` : "No products found"}
        </div>
      </div>
    );

  return (
    <div className=" mx-auto px-6 py-10">
      <div className="flex gap-8 ">
        <div className="w-120 px-3 py-4 rounded ring-yellow-200 ring-1 ">
          <h1 className="text-xl uppercase tracking-widest   text-yellow-500">
            Filter
          </h1>
          <div className="border-b py-1 border-yellow-500 "></div>
          <ProductSideBar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div>
          {search && (
            <p className="text-sm text-stone-400 mb-6">
              Showing results for{" "}
              <span className="text-stone-700 font-medium">"{search}"</span>
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <a
                key={product._id}
                href={`/products/${product.slug}`}
                className="group flex flex-col gap-2"
              >
                <div className="aspect-square rounded overflow-hidden bg-stone-50">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200 text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-stone-500">
                    ₹{product.price?.toLocaleString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-between  items-center px-6 py-4 border-t">
        <div className="text-sm text-slate-500">
          Page {res?.page} of {totalPages}
        </div>

        <div className="flex justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded "
          >
            Prev
          </button>

          <p className="flex gap-2">{page}</p>
          <button
            disabled={page === res?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
