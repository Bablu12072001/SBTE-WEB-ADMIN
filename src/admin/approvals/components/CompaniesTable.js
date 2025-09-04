"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ApproveCompanyModal from "./ApproveModal";
import RejectCompanyModal from "./RejectModal";

export default function CompaniesTable() {
  const [companiesData, setCompaniesData] = useState([]);
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
        fetchCompanies(storedToken);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchCompanies = async (token) => {
    try {
      const response = await axios.get("/api/admin/registration", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.status) {
        setCompaniesData(response.data.body);
      } else {
        console.error("Invalid response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching companies: ", error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto h-[70vh]">
        <div className="min-w-full border border-gray-300 rounded-lg text-sm text-left bg-white flex flex-col h-full">
          <div className="overflow-y-auto grow">
            <table className="min-w-full table-fixed">
              <thead className="bg-blue-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border w-16">SL NO</th>
                  <th className="px-3 py-2 border w-40">Company Name</th>
                  <th className="px-3 py-2 border w-32">Username</th>
                  <th className="px-3 py-2 border w-48">Email</th>
                  <th className="px-3 py-2 border w-32">Phone</th>
                  <th className="px-3 py-2 border w-48">Contact Person</th>
                  <th className="px-3 py-2 border w-40">Reg. No.</th>
                  <th className="px-3 py-2 border w-32">Company Phone</th>
                  <th className="px-3 py-2 border w-56">Website</th>
                  <th className="px-3 py-2 border w-48">Company Email</th>
                  <th className="px-3 py-2 border w-24">Approved</th>
                  <th className="px-3 py-2 border w-32">Approved By</th>
                  <th className="px-3 py-2 border w-40">Reg. Time</th>
                  <th className="px-3 py-2 border w-30">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...companiesData]
                  .sort((a, b) => (a.approved ? 1 : 0) - (b.approved ? 1 : 0))
                  .map((item, index) => (
                    <tr key={item.id} className="even:bg-blue-50">
                      <td className="px-3 py-2 border">{index + 1}.</td>
                      <td className="px-3 py-2 border">{item.company_name}</td>
                      <td className="px-3 py-2 border">{item.username}</td>
                      <td className="px-3 py-2 border break-all">
                        {item.email}
                      </td>
                      <td className="px-3 py-2 border">{item.phone_number}</td>
                      <td className="px-3 py-2 border">
                        {item.contact_person_name}
                      </td>
                      <td className="px-3 py-2 border">
                        {item.company_registration_number}
                      </td>
                      <td className="px-3 py-2 border">
                        {item.company_phone_number}
                      </td>
                      <td className="px-3 py-2 border break-all">
                        <a
                          href={item.company_official_website}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.company_official_website}
                        </a>
                      </td>
                      <td className="px-3 py-2 border break-all">
                        {item.company_email}
                      </td>
                      <td className="px-3 py-2 border">
                        {item.approved ? (
                          <span className="text-green-600 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2 border">{item.approved_by}</td>
                      <td className="px-3 py-2 border">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border">
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
                                "Are you sure you want to remove this company?"
                              )
                            ) {
                              try {
                                await axios.delete("/api/admin/registration", {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  data: { id: item.id },
                                });
                                setCompaniesData((prev) =>
                                  prev.filter(
                                    (company) => company.id !== item.id
                                  )
                                );
                              } catch (error) {
                                alert("Failed to remove company.");
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
        <ApproveCompanyModal
          isOpen={isApproveOpen}
          setIsOpen={setIsApproveOpen}
          item={approveTarget}
          token={token}
          onApproveSuccess={(approvedId) => {
            setCompaniesData((prev) =>
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
        <RejectCompanyModal
          isOpen={isRejectOpen}
          setIsOpen={setIsRejectOpen}
          item={rejectTarget}
          token={token}
          onRejectSuccess={(rejectId) => {
            setCompaniesData((prev) =>
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
