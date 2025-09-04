"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CalendarTableAddModal({ isOpen, setIsOpen }) {
  const [title, setTitle] = useState("");
  const [session, setSession] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [token, setToken] = useState("");

  const [events, setEvents] = useState([
    {
      event: "",
      semesters: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
    },
  ]);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        jwtDecode(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleEventChange = (index, field, value) => {
    const updated = [...events];
    updated[index][field] = value;
    setEvents(updated);
  };

  const handleSemesterChange = (index, semester, value) => {
    const updated = [...events];
    updated[index].semesters[semester] = value;
    setEvents(updated);
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        event: "",
        semesters: {
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        },
      },
    ]);
  };

  const removeEvent = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
  };

  const handleSubmit = async () => {
    const formattedEvents = events.map((e) => ({
      event: e.event,
      semesters: {
        1: e.semesters[1] || null,
        2: e.semesters[2] || null,
        3: e.semesters[3] || null,
        4: e.semesters[4] || null,
        5: e.semesters[5] || null,
        6: e.semesters[6] || null,
      },
    }));

    const payload = {
      title,
      session,
      institution_type: institutionType,
      events: formattedEvents,
      created_by: "admin",
    };

    try {
      const response = await axios.post("/api/admin/academic", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Calendar saved:", response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert("Failed to submit. Check console.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              Add Academic Calendar
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Session (e.g., 2021-22)"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Institution Type"
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
            />

            {events.map((evt, idx) => (
              <div key={idx} className="border rounded p-4 relative">
                <input
                  className="w-full border-b mb-2 px-2 py-1"
                  placeholder="Event Name"
                  value={evt.event}
                  onChange={(e) =>
                    handleEventChange(idx, "event", e.target.value)
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                  {Object.entries(evt.semesters).map(([sem, semVal]) => (
                    <div key={sem} className="space-y-1">
                      <input
                        className="border px-2 py-1 rounded w-full"
                        placeholder={`Sem ${sem} Date`}
                        value={semVal}
                        onChange={(e) =>
                          handleSemesterChange(idx, sem, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                {events.length > 1 && (
                  <button
                    onClick={() => removeEvent(idx)}
                    className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addEvent}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              + Add More Event
            </button>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
