// SearchBar.js
"use client"; // Ensure this is a Client Component
import React, { useState } from "react";

/**
 * SearchBar component for filtering products based on user input.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.products - Array of product objects to search through.
 * @param {Function} props.onSearch - Callback function to handle search results.
 * @returns {JSX.Element} The SearchBar component.
 */
export default function SearchBar({ products = [], onSearch }) {
  const [searchQuery, setSearchQuery] = useState(""); // Local state to manage the query

  /**
   * Handles form submission for searching products.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Filter products based on the search query
    const filteredProducts = Array.isArray(products)
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []; // Default to empty if not an array

    // Pass the filtered products back to the parent component
    if (typeof onSearch === "function") {
      onSearch(filteredProducts); // Ensure onSearch is a function
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="bg-gray-100 border border-gray-400 p-2 rounded-md shadow-md text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out w-full mr-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-300 border border-gray-400 text-gray-700 rounded-md shadow-md hover:bg-green-500 hover:text-white transition-colors duration-200 ease-in-out"
      >
        Search
      </button>
    </form>
  );
}
