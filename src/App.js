import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./components/page/home";
import About from "./components/page/About/about";
import Navbar from "./components/page/Navbar";
import Footer from "./components/page/Footer";
import SplashScreen from "./components/page/SplashScreen";
import Gallery from "./components/page/Gallery/gallery";
import Autonomash from "./components/page/SBTE/anonamous";
import Branchwise from "./components/page/SBTE/branchwise";

import Government from "./components/page/SBTE/government";
import Private from "./components/page/SBTE/private";
import EOA from "./components/page/SBTE/eoa";
import Office from "./components/page/Documents/official";
import Sops from "./components/page/Documents/sops";
import Downloads from "./components/page/Documents/downloads";
import Academic from "./components/page/Student/academic";
import Registration from "./components/page/Student//registration";
import Enrollments from "./components/page/Student/enrollments";
import ExamResult from "./components/page/Student/exam-result";
import PreviousYear from "./components/page/Student/previous-year-questions";
import QuestionAns from "./components/page/Student/question-answer-key";
import Curriculam from "./components/page/Curriculamitem/curriculam";
import CurriculamFeedback from "./components/page/Curriculamitem/CurriculumFeedbackPage";
import AddCourses from "./components/page/Curriculamitem/add-on-courses";
import AvailableCourses from "./components/page/Curriculamitem/available-course";
import Award from "./components/page/Curriculamitem/award";
import DocVerification from "./components/page/Docverification/verification";
import Acts from "./components/page/Documents/acts";
import DSTTE from "./components/page/Documents/dstte";
import FaqSection from "./components/page/Faq/faq";
// import Career from "./components/page/Training/career";
// import Training from "./components/page/Training/trarning";
import Login from "./components/page/Training/login";
import Mission from "./components/page/SBTE/mission";
import Orgnagetion from "./components/page/SBTE/orgnagation";
import Download from "./components/Download/download";
import Alljobs from "./components/page/Training/alljobs";
import AllNews from "./components/page/allnewspages";
import Mou from "./components/page/collebration/mou&moa";
import Acadmic1 from "./components/page/collebration/acadmic";
import Crm from "./components/page/collebration/crs";
import Notification from "./components/page/notifications";
import Annousment from "./components/page/announcement";

import RegistrationForm from "./components/page/Training/registration";
import ProtectedRoute from "./components/page/Training/ProtectedRoute";
import Lab from "./components/page/Student/lab";
import Privacy from "./components/page/privacy";
import External from "./components/page/externallink";
import AdminLogin from "./admin/login/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import NewsBanner from "./admin/news-banner/NewsBanner";
import Documents from "./admin/documents-downloads/DocumentsDownloadsPage";
import CurriculamSyllabus from "./admin/curriculum-and-study-material/SyllabusAndStudyMaterial";
import NewsAndAnnouncements from "./admin/news-and-announcements/NewsAndAnnouncements";
import CircularsAndNotifications from "./admin/circulars-and-notifications/CircularsAndNotifications";
import AcademicCalendar from "./admin/academic-calendar/AcademicCalendar";
import Awards from "./admin/awards/Awards";
import JobsAndInternships from "./admin/jobs-and-internships/JobsAndInternships";
import Approvals from "./admin/approvals/Approvals";
import AddOns from "./admin/add-ons/AddOns";
import ExternalLinks from "./admin/external-links/ExternalLinks";
import AboutUs from "./admin/about-us/AboutUs";
import GalleryPage from "./admin/gallery/Gallery";
import EoaLoaPage from "./admin/eoa-loa/EoaLoa";
import FAQs from "./admin/faqs/FAQs";
import Collaboration from "./admin/collaboration/CategoryPage";

import CollaborationWeb from "./components/page/collebration/collebration";
import FormBuilder from "./admin/formbuilder/FromBuilder";
import Placements from "./admin/placements/Placements";
import Logs from "./admin/logs/Logs";
// import GlobalSearchDropdown from "./components/page/GlobalSearchDropdown";
import UserPortalLayout from "./UserPortalLayout";

// 👇 Wrapper component to access route
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = /^\/admin/.test(location.pathname);

  const isUserPortalRoute = /^\/user-portal/.test(location.pathname);

  if (isUserPortalRoute) {
    // No Navbar/Footer for user portal
    return <UserPortalLayout />;
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/government-institute" element={<Government />} />
        <Route path="/private-institutes" element={<Private />} />
        <Route path="/eoa-loa" element={<EOA />} />
        <Route path="/official-letters" element={<Office />} />
        <Route path="/sops-usermanual" element={<Sops />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/academic-calendar" element={<Academic />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/enrollments" element={<Enrollments />} />
        <Route path="/exam-result" element={<ExamResult />} />
        <Route path="/previous-year-questions" element={<PreviousYear />} />
        <Route path="/question-answer-key" element={<QuestionAns />} />
        <Route path="/curriculum" element={<Curriculam />} />
        <Route path="/add-on-courses" element={<AddCourses />} />
        <Route path="/available-courses" element={<AvailableCourses />} />
        <Route path="/award" element={<Award />} />
        <Route path="/document-verification" element={<DocVerification />} />
        <Route path="/sbtenorms-documents" element={<Acts />} />
        <Route path="/dsttenorms-documents" element={<DSTTE />} />
        <Route path="/faq" element={<FaqSection />} />
        {/* <Route path="/career" element={<Career />} /> */}
        {/* <Route path="/training" element={<Training />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/curriculum-feedback" element={<CurriculamFeedback />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/organisation" element={<Orgnagetion />} />
        <Route path="/download" element={<Download />} />
        <Route path="/registrationform" element={<RegistrationForm />} />
        <Route path="/e-content-virtual-labs" element={<Lab />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/external-links" element={<External />} />
        <Route path="/collaboration" element={<CollaborationWeb />} />
        <Route path="/all-news" element={<AllNews />} />
        <Route path="/mou-moa" element={<Mou />} />
        <Route path="/academic" element={<Acadmic1 />} />
        <Route path="/autonomous-institute" element={<Autonomash />} />
        <Route path="/branch-wise-intake" element={<Branchwise />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/announcements" element={<Annousment />} />
        <Route path="/csr" element={<Crm />} />
        <Route
          path="/alljobs"
          element={
            <ProtectedRoute>
              <Alljobs />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/news" element={<NewsBanner />} />
        <Route path="/admin/documents-downloads" element={<Documents />} />
        <Route
          path="/admin/curriculum-and-study-material"
          element={<CurriculamSyllabus />}
        />
        <Route path="/admin/academic-calendar" element={<AcademicCalendar />} />
        <Route path="/admin/awards" element={<Awards />} />
        <Route
          path="/admin/jobs-and-internships"
          element={<JobsAndInternships />}
        />
        <Route path="/admin/approvals" element={<Approvals />} />
        <Route path="/admin/add-ons" element={<AddOns />} />
        <Route path="/admin/external-links" element={<ExternalLinks />} />
        <Route
          path="/admin/news-and-announcements"
          element={<NewsAndAnnouncements />}
        />
        <Route
          path="/admin/circulars-and-notifications"
          element={<CircularsAndNotifications />}
        />
        <Route path="/admin/about-us" element={<AboutUs />} />
        <Route path="/admin/gallery" element={<GalleryPage />} />
        <Route path="/admin/eoa-loa" element={<EoaLoaPage />} />
        <Route path="/admin/faqs" element={<FAQs />} />
        <Route path="/admin/collaboration" element={<Collaboration />} />
        <Route path="/admin/placements" element={<Placements />} />
        <Route path="/admin/logs" element={<Logs />} />
        {/* <Route path="/admin/builder" element={<FormBuilder />} /> */}
        {/* <Route path="/student/form/:formId" element={<RenderForm />} /> */}
      </Routes>

      {!isAdminRoute && (
        <Box sx={{ mt: { xs: 4, sm: 8, md: 12 } }}>
          <Footer />
        </Box>
      )}
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
