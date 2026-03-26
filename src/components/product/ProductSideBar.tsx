import { getCategoryName } from "@/services/category.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ProductSideBar({
  setSelectedCategories,
  selectedCategories,
  priceRange,
  setPriceRange,
  setSortBy,
  sortBy,
}: {
  setSelectedCategories: any;
  selectedCategories: any;
  priceRange: { min: number; max: number };
  setPriceRange: any;
  setSortBy: any;
  sortBy: string;
}) {
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: getCategoryName,
    placeholderData: keepPreviousData,
  });
  const categoryName = data;

  if (!categoryName) return;

  const handleChangeCategory = (categoryId: string): void => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(categoryId)
        ? prev.filter((id: string) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange((prev: any) => ({
      ...prev,
      max: Number(e.target.value),
    }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  return (
    <div>
      <Heading heading="Category" />
      {categoryName.map((category: { _id: string; name: string }) => {
        return (
          <div key={category._id} className="flex mb-2 gap-2 pl-2">
            <input
              className=""
              type="checkbox"
              name={category.name}
              id={category._id}
              checked={selectedCategories.includes(category._id)}
              onChange={() => handleChangeCategory(category._id)}
            />
            <label className="text-sm text-gray-600" htmlFor={category._id}>
              {category.name}
            </label>
          </div>
        );
      })}
      <Heading heading="Price" />
      <div className="px-2 mb-2">
        <input
          type="range"
          min="0"
          max="100000"
          step="100"
          value={priceRange.max}
          onChange={handlePriceChange}
          className="w-full cursor-pointer accent-black"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Min: ₹{priceRange.min}</span>
          <span>Max: ₹{priceRange.max}</span>
        </div>
      </div>
      {[
        { id: "price_desc", title: "High to Low" },
        { id: "price_asc", title: "Low to High" },
      ].map((i) => (
        <div key={i.id} className="flex mb-2 gap-2 pl-2 items-center">
          <input
            type="checkbox"
            name="sortPrice"
            id={i.id}
            checked={sortBy === i.id}
            onChange={() => handleSortChange(i.id)}
            className="cursor-pointer accent-black"
          />
          <label
            className="text-sm text-gray-600 cursor-pointer"
            htmlFor={i.id}
          >
            {i.title}
          </label>
        </div>
      ))}
    </div>
  );
}

function Heading({ heading }: { heading: string }) {
  return (
    <h1 className="text-sm uppercase py-2 text-gray-600 font-medium">
      {heading}
    </h1>
  );
}
