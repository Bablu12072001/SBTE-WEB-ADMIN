"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Details from "./details";

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [expandedCards, setExpandedCards] = useState({}); // key: index, value: true/false

  // Fetch all categories on mount
  useEffect(() => {
    axios
      .get("/api/web/category")
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          setCategories(res.data.body);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fetch cards for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    setLoadingCards(true);
    axios
      .get(
        `/api/web/collaboration?category=${encodeURIComponent(
          selectedCategory
        )}`
      )
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          setCardData(res.data.body);
        } else {
          setCardData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching category data:", err);
        setCardData([]);
      })
      .finally(() => setLoadingCards(false));
  }, [selectedCategory]);

  const handleBack = () => {
    setSelectedCategory(null);
    setCardData([]);
    setExpandedCards({});
  };

  const toggleExpand = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <Details />
      <div className="bg-white px-6 pt-10 pb-2 font-sans">
        {!selectedCategory ? (
          <div className="flex justify-center gap-6 flex-wrap">
            {loadingCategories ? (
              <p className="text-gray-600">Loading categories...</p>
            ) : categories.length > 0 ? (
              categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.category)}
                  className="border border-blue-400 rounded-lg px-6 py-4 text-blue-900 font-semibold shadow-md hover:bg-blue-50 transition"
                >
                  {cat.category}
                </button>
              ))
            ) : (
              <p className="text-gray-600">No categories found.</p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <button onClick={handleBack}>
                <ArrowLeftIcon className="h-6 w-6 text-blue-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 ml-2">
                {selectedCategory}
              </h2>
            </div>

            {loadingCards ? (
              <p className="text-gray-500">Loading data...</p>
            ) : cardData.length === 0 ? (
              <p className="text-center text-red-600 font-semibold">
                No data available for this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cardData.map((item, idx) => {
                  const isExpanded = expandedCards[idx];
                  const desc = item.description || "";
                  const shortDesc = desc.slice(0, 100);

                  return (
                    <div
                      key={idx}
                      className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-48 w-full object-cover"
                        />
                        <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                          <ArrowUpRightIcon className="h-5 w-5 text-blue-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-md font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {isExpanded ? desc : shortDesc}
                          {desc.length > 100 && (
                            <button
                              onClick={() => toggleExpand(idx)}
                              className="text-blue-600 ml-1 underline text-sm"
                            >
                              {isExpanded ? "Show Less" : "Read More"}
                            </button>
                          )}
                        </p>
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 border border-blue-500 text-blue-700 rounded-full px-2 py-1 text-sm hover:bg-blue-50 transition w-fit"
                        >
                          ⬇ Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
