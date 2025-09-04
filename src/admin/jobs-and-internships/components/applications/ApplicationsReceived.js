import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

export default function ApplicationsReceived({ isOpen, setIsOpen, formId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formId || !isOpen) return;
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/form_data/${formId}`);
        if (res.data.status) {
          setApplications(res.data.body || []);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [formId, isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Fullscreen Panel */}
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-screen h-screen bg-white flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <Dialog.Title className="text-lg font-semibold text-gray-800">
                  Applications Received
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Close
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : applications.length > 0 ? (
                  <ul className="space-y-3">
                    {applications.map((app) => (
                      <li
                        key={app.id}
                        className="p-4 border rounded-lg bg-gray-50 text-sm"
                      >
                        <p className="text-xs text-gray-500 mb-2">
                          Submitted: {new Date(app.timestamp).toLocaleString()}
                        </p>
                        {Object.entries(app.data).map(([key, value]) => (
                          <p key={key}>
                            <strong>{key}: </strong>
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </p>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No applications found.</p>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
