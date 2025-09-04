import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AllLogs() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        const res = await axios.get("/api/log/files", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (res.data?.status) {
          setFiles(res.data.files || []);
        } else {
          setError("No log files found");
        }
      } catch (err) {
        console.error("Error fetching log files:", err);
        setError("Failed to load log files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const openFile = async (filename) => {
    try {
      setSelectedFile(filename);
      setLogs([]);
      setLogsLoading(true);
      setLogsError(null);
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`/api/log/${filename}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (res.data?.status) {
        setLogs(res.data.logs || []);
      } else {
        setLogsError("This log file contains no logs.");
      }
    } catch (err) {
      console.error("Error opening log file:", err);
      setLogsError("Failed to load log file");
    } finally {
      setLogsLoading(false);
    }
  };

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
    hours = hours % 12 || 12;

    return `${dd}-${MMM}-${yyyy} • ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">All Logs</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin w-4 h-4" /> Loading log files...
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && files.length === 0 && (
        <p className="text-gray-500 text-sm">No log files found.</p>
      )}

      <ul className="divide-y divide-gray-200 border rounded-md bg-white">
        {files.map((filename, idx) => (
          <li
            key={idx}
            className="p-3 hover:bg-gray-50 cursor-pointer text-blue-600 text-sm font-medium"
            onClick={() => openFile(filename)}
          >
            {filename}
          </li>
        ))}
      </ul>

      <Dialog
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <Dialog.Panel className="relative bg-white w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-lg font-semibold">Log File: {selectedFile}</h3>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          {logsLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="animate-spin w-4 h-4" /> Loading logs...
            </div>
          )}

          {logsError && <p className="text-red-500">{logsError}</p>}

          {!logsLoading && !logsError && logs.length > 0 && (
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span className="font-mono">
                      {formatTimestamp(log.timestamp)}
                    </span>
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
                      <span className="font-semibold">User:</span>{" "}
                      {log.user
                        ? `${log.user.Name} (${log.user.Email})`
                        : "System"}
                    </p>
                    <p>
                      <span className="font-semibold">Role:</span>{" "}
                      {log.user?.Role?.toUpperCase() || "-"}
                    </p>
                  </div>

                  {["POST", "PUT", "DELETE"].includes(log.method) && (
                    <div className="mt-3">
                      <button
                        onClick={() =>
                          setOpenIndex(openIndex === idx ? null : idx)
                        }
                        className="text-blue-600 text-xs font-medium hover:underline"
                      >
                        {openIndex === idx ? "Hide Body" : "Show Body"}
                      </button>
                      {openIndex === idx && (
                        <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.body, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
