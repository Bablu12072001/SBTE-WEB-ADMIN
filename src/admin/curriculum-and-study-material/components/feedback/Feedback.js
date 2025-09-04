import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    designation: "",
    email: "",
    institute: "",
    branch: "",
    subject: "",
    topic: "",
    feedback: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) setToken(storedToken);
    fetchFeedbacks(storedToken);
  }, []);

  const fetchFeedbacks = async (tk = token) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/curriculam_feedback", {
        headers: {
          Authorization: `Bearer ${tk || token}`,
        },
      });
      if (res.data.status) setFeedbacks(res.data.body);
    } catch (err) {
      alert("Failed to fetch feedbacks.");
    }
    setLoading(false);
  };

  const postOnWebsite = async (id) => {
    try {
      await axios.put(
        "/api/admin/curriculam_feedback",
        { id, isAvailableForPosting: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to post feedback.");
    }
  };

  const togglePostOnWebsite = async (id, currentStatus) => {
    try {
      await axios.put(
        "/api/admin/curriculam_feedback",
        { id, isAvailableForPosting: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to update feedback posting status.");
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/curriculam_feedback", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForm({
        name: "",
        phone_number: "",
        designation: "",
        email: "",
        institute: "",
        branch: "",
        subject: "",
        topic: "",
        feedback: "",
      });
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to submit feedback.");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;
    try {
      await axios.delete("/api/admin/curriculam_feedback", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      });
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to delete feedback.");
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Curriculum Feedback</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-4 rounded shadow"
        onSubmit={handleFormSubmit}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleFormChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
          required
        />
        <input
          name="designation"
          value={form.designation}
          onChange={handleFormChange}
          placeholder="Designation"
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
          className="border p-2 rounded"
          required
        />
        <input
          name="institute"
          value={form.institute}
          onChange={handleFormChange}
          placeholder="Institute"
          className="border p-2 rounded"
          required
        />
        <input
          name="branch"
          value={form.branch}
          onChange={handleFormChange}
          placeholder="Branch"
          className="border p-2 rounded"
          required
        />
        <input
          name="subject"
          value={form.subject}
          onChange={handleFormChange}
          placeholder="Subject"
          className="border p-2 rounded"
          required
        />
        <input
          name="topic"
          value={form.topic}
          onChange={handleFormChange}
          placeholder="Topic"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="feedback"
          value={form.feedback}
          onChange={handleFormChange}
          placeholder="Feedback"
          className="border p-2 rounded md:col-span-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded md:col-span-2"
        >
          Submit Feedback
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Feedbacks</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded shadow p-4 relative">
              <div className="mb-2 font-bold">
                {fb.name} ({fb.designation})
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {fb.institute} | {fb.branch}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Subject:</span> {fb.subject}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Topic:</span> {fb.topic}
              </div>
              <div className="text-sm mb-2">
                <span className="font-semibold">Feedback:</span> {fb.feedback}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Email: {fb.email} | Phone: {fb.phone_number}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Created: {new Date(fb.created_at).toLocaleString()}
              </div>
              <div className="flex justify-between gap-2 mt-2">
                {fb.isAvailableForPosting ? (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() =>
                      togglePostOnWebsite(fb.id, fb.isAvailableForPosting)
                    }
                  >
                    REMOVE FROM WEBSITE
                  </button>
                ) : (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() =>
                      togglePostOnWebsite(fb.id, fb.isAvailableForPosting)
                    }
                  >
                    POST ON WEBSITE
                  </button>
                )}
                <button
                  className="bg-gray-200 text-red-700 px-3 py-1 rounded hover:bg-red-100"
                  onClick={() => handleDeleteFeedback(fb.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
