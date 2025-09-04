import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicationDetail from "./ApplicationDetail";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/admin/form_data");
        if (res.data.status) {
          setApplications(res.data.body || []);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const renderValue = (val) => {
    if (typeof val === "object" && val !== null) {
      return (
        <pre className="text-xs bg-gray-100 rounded p-1 overflow-x-auto">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span>{String(val)}</span>;
  };

  return (
    <div className="grid grid-cols-1  gap-4">
      {applications.map((app) => (
        <div
          key={app.id}
          onClick={() => {
            setSelectedFormId(app.form_id);
            setOpen(true);
          }}
          className="cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500 mb-2">
            Submitted: {new Date(app.timestamp).toLocaleString()}
          </p>
          <div className="space-y-1">
            {Object.entries(app.data).map(([key, value]) => (
              <div key={key} className="text-sm">
                <strong className="text-gray-700">{key}: </strong>
                {renderValue(value)}
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedFormId && (
        <ApplicationDetail
          isOpen={open}
          setIsOpen={setOpen}
          formId={selectedFormId}
        />
      )}
    </div>
  );
};

export default Applications;
