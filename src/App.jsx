import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin/AdminPanel";
import Homepage from "./pages/user/Homepage";
import InterviewsPage from "./pages/user/InterviewPage";
import InterviewDetail from "./components/user/InterviewDetail";
// import Profile from "./pages/Profile"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/user" element={<Homepage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/interview/:id" element={<InterviewDetail />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
