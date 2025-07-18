import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin/AdminPanel";
import Homepage from "./pages/user/Homepage";
import InterviewsPage from "./pages/user/InterviewPage";

import InterviewDetail from "./components/user/InterviewChat/InterviewDetail";

import UserProfilePage from "./pages/user/UserProfilePage";

// import Profile from "./pages/Profile"; 
import JobInterviewsPage from "./pages/admin/JobInterviewsPage";
import InterviewDetailPage from "./pages/admin/InterviewDetailPage";
import SessionManager from "./components/user/SessionManager";
import SavedJobsPage from "./pages/user/SavedJobsPage";


function App() {
  return (
    <Router>
      <SessionManager />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/user" element={<Homepage />} />
        <Route path="/interviews" element={<InterviewsPage />} />

        <Route path="/interview/:userId/:interviewId" element={<InterviewDetail />} />

        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/admin/interviews/:jobId" element={<JobInterviewsPage />} />
        <Route path="/admin/interviews/:jobId/:interviewId" element={<InterviewDetailPage />} />

        <Route path="/saved-jobs" element={<SavedJobsPage />} />


        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
