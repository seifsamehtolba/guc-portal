import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./Navbar";
import StudentDetails from "./StudentDetails";
import Notifications from "./Notifications";
import Schedule from "./Schedule";
import ExamSeats from "./ExamSeats";
import FinancialBalance from "./FinancialBalance";
import Settings from "./Settings";
import Login from "./Login";
import Grades from "./Grades"; // ✅ Import the Grades component
import AttendancePage from "./Attendance"; // ✅ Import the AttendancePage component
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setLoading(true);
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
          {user && <Navbar setUser={handleLogout} />}
          <Routes>
            <Route path="/" element={!user ? <Login setUser={handleLogin} /> : <Navigate to="/welcome" />} />
            <Route path="/welcome" element={user ? (loading ? <LoadingScreen /> : <StudentDetails user={user} />) : <Navigate to="/" />} />
            <Route path="/grades" element={user ? <Grades user={user} /> : <Navigate to="/" />} />
            <Route path="/attendance" element={user ? <AttendancePage user={user} /> : <Navigate to="/" />} />
            <Route path="/notifications" element={user ? <Notifications user={user} /> : <Navigate to="/" />} />
            <Route path="/schedule" element={user ? <Schedule user={user} /> : <Navigate to="/" />} />
            <Route path="/exam-seats" element={user ? <ExamSeats user={user} /> : <Navigate to="/" />} />
            <Route path="/financial-balance" element={user ? <FinancialBalance user={user} /> : <Navigate to="/" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={user ? "/welcome" : "/"} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 dark:bg-gray-800">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
}
