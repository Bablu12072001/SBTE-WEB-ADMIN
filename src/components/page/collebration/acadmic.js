"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Details from "./acadmicpage"; // Assuming this is your academic details component

export default function CategoryPage() {
  const [cardData, setCardData] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    setLoadingCards(true);
    axios
      .get(`/api/web/collaboration?category=Academic Partnership`)
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.body)) {
          setCardData(res.data.body);
        } else {
          setCardData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setCardData([]);
      })
      .finally(() => setLoadingCards(false));
  }, []);

  const toggleExpand = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <Details />
      <div className="bg-white px-6 pt-10 pb-2 font-sans min-h-screen">
        {/* Card Section */}
        {loadingCards ? (
          <p className="text-gray-500 text-center text-lg">Loading data...</p>
        ) : cardData.length === 0 ? (
          <p className="text-center text-red-600 font-semibold">
            No data available.
          </p>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {cardData.map((item, idx) => {
                const isExpanded = expandedCards[idx];
                const desc = item.description || "";
                const shortDesc = desc.slice(0, 100);

                return (
                  <div
                    key={idx}
                    className="bg-white border rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-52 w-full object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder-image.jpg")
                        }
                      />
                      <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
                        <ArrowUpRightIcon className="h-5 w-5 text-blue-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
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
                        className="inline-flex items-center gap-1 border border-blue-500 text-blue-700 rounded-full px-3 py-1 text-sm hover:bg-blue-50 transition w-fit"
                      >
                        ⬇ Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logo Infinite Scroll Section */}
            <div className="mt-20 py-12 bg-gradient-to-b from-white to-blue-50 relative">
              <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">
                Academic Partnership Partners
              </h2>

              {/* Fading gradient edges */}
              <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="overflow-hidden">
                <div className="flex gap-10 animate-marquee whitespace-nowrap px-6">
                  {[...cardData, ...cardData].map((item, idx) => (
                    <div
                      key={`logo-${idx}`}
                      className="flex-shrink-0 w-44 text-center bg-white rounded-xl p-4 shadow hover:shadow-xl transition duration-300"
                    >
                      <img
                        src={item.logo}
                        alt={item.label || "Partner logo"}
                        className="w-20 h-20 object-contain mx-auto mb-2"
                        onError={(e) =>
                          (e.target.src = "/placeholder-logo.png")
                        }
                      />
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
