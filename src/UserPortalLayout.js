// ✅ UserPortalLayout.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/page/Training/trainings"; // Adjust path as needed
import Footer from "./components/page/Training/Footers"; // Adjust path as needed

import UserDashboard from "./components/page/Training/homeTraining";
import Why from "./components/page/Training/allpages/why";
import Msg from "./components/page/Training/allpages/msg";
import Req from "./components/page/Training/allpages/requirement";
import Contact from "./components/page/Training/allpages/contactpage";
import Brochure from "./components/page/Training/allpages/placement";
import Career from "./components/page/Training/career";
import Login from "./components/page/Training/allpages/logins";
import Procedure from "./components/page/Training/allpages/procedure";
import Achievement from "./components/page/Training/allpages/achivement";
import Sucess from "./components/page/Training/allpages/stories";
import Placement from "./components/page/Training/allpages/placment";
import StudentDashboard from "./components/page/Training/allpages/StudentDashboard";

function UserPortalLayout() {
  return (
    <>
      <Navbar /> {/* ✅ Navbar on top */}
      <Routes>
        <Route path="/user-portal/trainings" element={<UserDashboard />} />
        <Route path="/user-portal/why" element={<Why />} />
        <Route path="/user-portal/msg" element={<Msg />} />
        <Route path="/user-portal/recruitment-process" element={<Req />} />
        <Route path="/user-portal/contact" element={<Contact />} />
        <Route path="/user-portal/brochure" element={<Brochure />} />
        <Route path="/user-portal/career" element={<Career />} />
        <Route path="/user-portal/login" element={<Login />} />
        <Route path="/user-portal/procedure" element={<Procedure />} />
        <Route path="/user-portal/achievement" element={<Achievement />} />
        <Route path="/user-portal/success-stories" element={<Sucess />} />
        <Route
          path="/user-portal/placement-statistics"
          element={<Placement />}
        />
        <Route
          path="/user-portal/student-dashboard"
          element={<StudentDashboard />}
        />
      </Routes>
      <Footer /> {/* ✅ Footer on bottom */}
    </>
  );
}

export default UserPortalLayout;
