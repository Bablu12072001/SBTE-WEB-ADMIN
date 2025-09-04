import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

export default function ApplicationDetail({ isOpen, setIsOpen, formId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formId || !isOpen) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/form_data/${formId}`);
        setDetails(res.data);
      } catch (err) {
        console.error("Error fetching application detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [formId, isOpen]);

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
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Application Details
              </Dialog.Title>

              {loading ? (
                <p className="text-gray-500 mt-4">Loading...</p>
              ) : details ? (
                <div className="mt-4 space-y-2">
                  {Object.entries(details.body?.data || {}).map(
                    ([key, value]) => (
                      <div key={key} className="text-sm">
                        <strong className="text-gray-700">{key}: </strong>
                        {renderValue(value)}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 mt-4">No details found.</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
