import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const CollaborationCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white w-80 border rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300">
      <img
        src={item.image}
        alt={item.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
            {item.title}
          </h3>
          {item.logo && (
            <img
              src={item.logo}
              alt="Logo"
              className="h-8 w-8 object-contain ml-2 rounded"
            />
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {item.description}
        </p>

        <div className="text-xs text-gray-500 mb-3 italic">{item.category}</div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = item.file;
              link.download = item.file.split("/").pop();
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-xs text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>

          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} title="Edit">
              <PencilIcon className="h-5 w-5 text-indigo-700 hover:scale-110 transition" />
            </button>
            <button onClick={() => onDelete(item.id)} title="Delete">
              <TrashIcon className="h-5 w-5 text-red-600 hover:scale-110 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
