import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function RecentLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        const res = await axios.get("/api/log/latest/log", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (res.data?.status) {
          setLogs(res.data.logs || []);
        } else {
          setError("No logs found");
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const parseLogTimestamp = (ts) => {
    if (!ts || typeof ts !== "string") return null;
    const m = ts.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2})-(\d{2})-(\d{2})$/);
    if (m) {
      const [, y, mo, d, h, mi, s] = m;
      return new Date(
        Number(y),
        Number(mo) - 1,
        Number(d),
        Number(h),
        Number(mi),
        Number(s)
      );
    }
    const d2 = new Date(ts);
    return isNaN(d2.getTime()) ? null : d2;
  };

  const formatTimestamp = (ts) => {
    const dateObj = parseLogTimestamp(ts);
    if (!dateObj) return ts || "Invalid Date";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const MMM = months[dateObj.getMonth()];
    const yyyy = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${dd}-${MMM}-${yyyy} • ${hours}:${minutes} ${ampm}`;
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="animate-spin w-4 h-4" /> Loading recent logs...
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {logs.map((log, idx) => (
        <div
          key={idx}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span className="font-mono">{formatTimestamp(log.timestamp)}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                log.type === "REQUEST"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {log.type}
            </span>
          </div>

          <p className="text-sm">
            <span className="font-semibold">{log.method}</span>{" "}
            <span className="text-gray-700">{log.url}</span>
          </p>

          {log.status !== null && (
            <p className="flex items-center gap-1 text-xs mt-1">
              {log.status >= 200 && log.status < 300 ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              Status: {log.status}
            </p>
          )}

          <div className="mt-2 text-xs text-gray-700">
            <p>
              <span className="font-semibold">User:</span> {log.user?.Name} (
              {log.user?.Email})
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {log.user?.Role?.toUpperCase()}
            </p>
          </div>

          {["POST", "PUT", "DELETE"].includes(log.method) && (
            <div className="mt-3">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="text-blue-600 text-xs font-medium hover:underline"
              >
                {openIndex === idx ? "Hide Body" : "Show Body"}
              </button>
              {openIndex === idx && (
                <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                  {JSON.stringify(log.body, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
