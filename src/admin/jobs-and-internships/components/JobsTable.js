"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import EditJobModal from "./EditJobModal";
import DeleteJobModal from "./DeleteJobModal";
import FormBuilder from "../../formbuilder/FromBuilder";
import ApplicationsReceived from "./applications/ApplicationsReceived";

export default function JobsTable({ refreshFlag }) {
  const [jobsData, setJobsData] = useState([]);
  const [token, setToken] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formJobData, setFormJobData] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
    fetchJobs(token);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode(storedToken);
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
        console.log("Jobs data fetched: ", response.data.body);
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
                  <th className="px-3 py-2 border">S.No.</th>
                  <th className="px-3 py-2 border">Company Name</th>
                  <th className="px-3 py-2 border">Company Reg. No</th>
                  <th className="px-3 py-2 border">Job Title</th>
                  <th className="px-3 py-2 border">Job Role</th>
                  <th className="px-3 py-2 border">Location</th>
                  <th className="px-3 py-2 border">Salary</th>
                  <th className="px-3 py-2 border">Qualification</th>
                  <th className="px-3 py-2 border">Service Agreement</th>
                  <th className="px-3 py-2 border">Year of Passing</th>
                  <th className="px-3 py-2 border">Application Start Date</th>
                  <th className="px-3 py-2 border">Application End Date</th>
                  <th className="px-3 py-2 border">Interview Rounds</th>
                  <th className="px-3 py-2 border">Interview Date</th>
                  <th className="px-3 py-2 border">Working Shift</th>
                  <th className="px-3 py-2 border">Eligible Streams</th>
                  <th className="px-3 py-2 border">Gender Preference</th>
                  <th className="px-3 py-2 border">Min. Required %</th>
                  <th className="px-3 py-2 border">Skills Required</th>
                  <th className="px-3 py-2 border">Blocking Period</th>
                  <th className="px-3 py-2 border">Other Criteria</th>
                  <th className="px-3 py-2 border">Notes</th>
                  <th className="px-3 py-2 border">Remarks</th>
                  <th className="px-3 py-2 border">Apply Link</th>
                  <th className="px-3 py-2 border">Applications Received</th>
                  <th className="px-3 py-2 border">File</th>
                  <th className="px-3 py-2 border">Posted On</th>
                  <th className="px-3 py-2 border">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {jobsData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{index + 1}</td>
                    <td className="px-3 py-2 border">{item.company_name}</td>
                    <td className="px-3 py-2 border">
                      {item.company_registration_number}
                    </td>
                    <td className="px-3 py-2 border">{item.job_title}</td>
                    <td className="px-3 py-2 border">{item.job_role}</td>
                    <td className="px-3 py-2 border">{item.location}</td>
                    <td className="px-3 py-2 border">{item.salary}</td>
                    <td className="px-3 py-2 border">{item.qualification}</td>
                    <td className="px-3 py-2 border">
                      {item.service_agreement}
                    </td>
                    <td className="px-3 py-2 border">{item.year_of_passing}</td>
                    <td className="px-3 py-2 border">
                      {formatDate(item.application_start_date)}
                    </td>
                    <td className="px-3 py-2 border">
                      {formatDate(item.application_end_date)}
                    </td>
                    <td className="px-3 py-2 border">
                      {item.interview_rounds}
                    </td>
                    <td className="px-3 py-2 border">
                      {formatDate(item.interview_date)}
                    </td>
                    <td className="px-3 py-2 border">{item.working_shift}</td>
                    <td className="px-3 py-2 border">
                      {item.eligible_streams}
                    </td>
                    <td className="px-3 py-2 border">
                      {item.gender_preference}
                    </td>
                    <td className="px-3 py-2 border">
                      {item.min_required_percentage}
                    </td>
                    <td className="px-3 py-2 border">{item.skills_required}</td>
                    <td className="px-3 py-2 border">{item.blocking_period}</td>
                    <td className="px-3 py-2 border">{item.other_criterias}</td>
                    <td className="px-3 py-2 border">{item.notes}</td>
                    <td className="px-3 py-2 border">{item.remarks}</td>
                    <td className="px-3 py-2 border space-y-1 items-center ">
                      {item.apply_link ? (
                        <a
                          href={item.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Apply
                        </a>
                      ) : (
                        <button
                          className="bg-green-900 text-white px-3 py-1 rounded-lg text-xs"
                          onClick={() => {
                            setFormJobData({
                              id: item.id,
                              company_name: item.company_name,
                            });
                            setShowFormBuilder(true);
                          }}
                        >
                          Create Form
                        </button>
                      )}
                    </td>

                    <td className="px-3 py-2 border text-center">
                      <button
                        className="bg-blue-900 text-white px-3 py-1 rounded-lg text-xs"
                        onClick={() => {
                          setSelectedFormId(item.apply_link);
                          setShowApplications(true);
                        }}
                      >
                        View
                      </button>
                    </td>

                    <td className="px-3 py-2 border">
                      <a
                        href={item.job_description_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        File
                      </a>
                    </td>
                    <td className="px-3 py-2 border">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="px-3 py-2 border">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setEditJob(item);
                            setIsEditOpen(true);
                          }}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editJob && (
        <EditJobModal
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          jobData={editJob}
          onEditSuccess={() => {
            fetchJobs(token);
            setEditJob(null);
          }}
        />
      )}

      {selectedItem && (
        <DeleteJobModal
          isOpen={showDeleteModal}
          setIsOpen={setShowDeleteModal}
          item={selectedItem}
          token={token}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}

      {showFormBuilder && (
        <FormBuilder
          isOpen={showFormBuilder}
          onClose={() => setShowFormBuilder(false)}
          jobId={formJobData?.id}
          companyName={formJobData?.company_name}
        />
      )}

      {showApplications && selectedFormId && (
        <ApplicationsReceived
          isOpen={showApplications}
          setIsOpen={setShowApplications}
          formId={selectedFormId}
        />
      )}
    </div>
  );
}
