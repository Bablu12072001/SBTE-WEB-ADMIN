"use client";

import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CalendarTableEditModal({
  isOpen,
  setIsOpen,
  data,
  onSave,
}) {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    session: "",
    institution_type: "",
    events: [],
    created_by: "",
    created_at: "",
  });

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

    if (data) {
      setFormData({
        id: data.id ?? "",
        title: data.title ?? "",
        session: data.session ?? "",
        institution_type: data.institution_type ?? "",
        events: data.events ?? [],
        created_by: data.created_by ?? "",
        created_at: data.created_at ?? "",
      });
    }
  }, [data]);

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...formData.events];
    if (field === "event") {
      updatedEvents[index].event = value;
    } else {
      updatedEvents[index].semesters[field] = value;
    }
    setFormData({ ...formData, events: updatedEvents });
  };

  const addEvent = () => {
    const newEvent = {
      event: "",
      semesters: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
      },
    };
    setFormData({ ...formData, events: [...formData.events, newEvent] });
  };

  const removeEvent = (index) => {
    if (formData.events.length <= 1) {
      alert("At least one event is required.");
      return;
    }
    const updatedEvents = [...formData.events];
    updatedEvents.splice(index, 1);
    setFormData({ ...formData, events: updatedEvents });
  };

  const handleSubmit = async () => {
    const formattedEvents = formData.events.map((event) => ({
      event: event.event,
      semesters: {
        1: event.semesters[1] || null,
        2: event.semesters[2] || null,
        3: event.semesters[3] || null,
        4: event.semesters[4] || null,
        5: event.semesters[5] || null,
        6: event.semesters[6] || null,
      },
    }));

    const payload = {
      id: formData.id,
      title: formData.title,
      session: formData.session,
      institution_type: formData.institution_type,
      events: formattedEvents,
    };

    try {
      const response = await axios.put("/api/admin/academic", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        onSave(response.data.body);
        setIsOpen(false);
      } else {
        alert("Failed to update calendar. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating. Check console for details.");
    }
  };

  if (!data) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-blue-900">
              Edit Academic Calendar Table
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Created By</label>
                <input
                  type="text"
                  value={formData.created_by}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Created At</label>
                <input
                  type="text"
                  value={new Date(formData.created_at).toLocaleString()}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Session</label>
                <input
                  name="session"
                  type="text"
                  value={formData.session}
                  onChange={(e) =>
                    setFormData({ ...formData, session: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Institution Type
                </label>
                <input
                  name="institution_type"
                  type="text"
                  value={formData.institution_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      institution_type: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="border rounded p-4 mt-4">
              <h3 className="text-md font-semibold mb-3 flex items-center justify-between">
                Events
                <button
                  onClick={addEvent}
                  className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-500"
                >
                  + Add Event
                </button>
              </h3>

              {formData.events.map((eventItem, index) => (
                <div key={index} className="border rounded p-3 mb-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      placeholder="Event Name"
                      value={eventItem.event}
                      onChange={(e) =>
                        handleEventChange(index, "event", e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeEvent(index)}
                      className="text-red-600 hover:text-red-800 ml-3"
                      title="Remove Event"
                    >
                      🗑
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["1", "2", "3", "4", "5", "6"].map((sem) => (
                      <div key={sem} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Sem {sem}
                        </label>
                        <input
                          type="text"
                          placeholder="Date"
                          className="border rounded px-2 py-1"
                          value={eventItem.semesters[sem] || ""}
                          onChange={(e) => {
                            const updatedEvents = [...formData.events];
                            updatedEvents[index].semesters[sem] =
                              e.target.value;
                            setFormData({
                              ...formData,
                              events: updatedEvents,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
