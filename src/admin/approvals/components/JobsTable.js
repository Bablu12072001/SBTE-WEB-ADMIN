"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ApproveJobsModal from "./ApproveJobModal";
import RejectJobModal from "./RejectJobModal";

export default function JobsTable({ refreshFlag }) {
  const [jobsData, setJobsData] = useState([]);
  const [token, setToken] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token: ", decodedToken);
        fetchJobs(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, [refreshFlag]);

  const fetchJobs = async (token) => {
    try {
      const response = await axios.get("/api/admin/job_post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        setJobsData(response.data.body);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto h-[80vh]">
        <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
          <div className="overflow-y-auto grow">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    S.No.
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Company Name
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Job Title
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Job Role
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Location
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Salary
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Qualification
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Application Start Date
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Application End Date
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Eligible Streams
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Skills Required
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Other Criteria
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Remarks
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Apply Link
                  </th>
                  <th className="px-3 py-2 border text-wrap break-words whitespace-normal">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {jobsData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.company_name}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.job_title}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.job_role}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.location}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.salary}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.qualification}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.application_start_date}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.application_end_date}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.eligible_streams}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.skills_required}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.other_criterias}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.remarks}
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      <a
                        href={item.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Apply
                      </a>
                    </td>
                    <td className="px-3 py-2 border text-wrap break-words whitespace-normal">
                      {item.approved ? (
                        <button
                          className="bg-red-100 text-red-600 px-3 py-1 rounded border border-red-300 hover:bg-red-200 w-full"
                          onClick={() => {
                            setRejectTarget(item);
                            setIsRejectOpen(true);
                          }}
                        >
                          Reject
                        </button>
                      ) : (
                        <button
                          className="bg-green-100 text-green-600 px-3 py-1 rounded border border-green-300 hover:bg-green-200 w-full"
                          onClick={() => {
                            setApproveTarget(item);
                            setIsApproveOpen(true);
                          }}
                        >
                          Approve
                        </button>
                      )}

                      <button
                        className="bg-red-50 text-red-700 px-3 py-1 rounded border border-red-300 hover:bg-red-200 w-full mt-1"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove this job post?"
                            )
                          ) {
                            try {
                              await axios.delete("/api/company/job_post", {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                                data: { id: item.id },
                              });
                              setJobsData((prev) =>
                                prev.filter((job) => job.id !== item.id)
                              );
                            } catch (error) {
                              alert("Failed to remove job post.");
                              console.error(error);
                            }
                          }
                        }}
                      >
                        Reject/Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {approveTarget && (
        <ApproveJobsModal
          isOpen={isApproveOpen}
          setIsOpen={setIsApproveOpen}
          item={approveTarget}
          token={token}
          onApproveSuccess={(approvedId) => {
            setJobsData((prev) =>
              prev.map((company) =>
                company.id === approvedId
                  ? { ...company, approved: !company.approved }
                  : company
              )
            );
            setApproveTarget(null);
          }}
        />
      )}
      {rejectTarget && (
        <RejectJobModal
          isOpen={isRejectOpen}
          setIsOpen={setIsRejectOpen}
          item={rejectTarget}
          token={token}
          onRejectSuccess={(rejectId) => {
            setJobsData((prev) =>
              prev.map((company) =>
                company.id === rejectId
                  ? { ...company, approved: !company.approved }
                  : company
              )
            );
            setRejectTarget(null);
          }}
        />
      )}
    </div>
  );
}
