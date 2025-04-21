import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import LoadingBar from "./LoadingBar"; // Import the LoadingBar component

const normalTimings = {
  Pharmacy: ["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "12:00 PM - 1:30 PM", "1:45 PM - 3:15 PM", "3:45 PM - 5:15 PM"],
  Engineering: ["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "11:45 AM - 1:15 PM", "1:45 PM - 3:15 PM", "3:45 PM - 5:15 PM"],
};

const ramadanTimings = ["8:30 AM - 9:40 AM", "9:45 AM - 10:55 AM", "11:00 AM - 12:10 PM", "12:20 PM - 1:30 PM", "1:35 PM - 2:45 PM"];

export default function Schedule({ user }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [timingMode] = useState(() => localStorage.getItem("timingMode") || "ramadan");
  const [faculty] = useState(() => localStorage.getItem("faculty") || "Engineering");

  useEffect(() => {
    const savedSchedule = localStorage.getItem("schedule");
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
      setLoading(false);
    } else {
      async function fetchSchedule() {
        try {
          const response = await fetch(`http://161.35.203.118/schedule?username=${user.username}&password=${user.password}`);
          if (!response.ok) throw new Error("Failed to fetch schedule");
          const data = await response.json();
          setSchedule(data);

          // Save schedule to localStorage
          localStorage.setItem("schedule", JSON.stringify(data));
          console.log("Saved schedule to localStorage:", data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchSchedule();
    }
  }, [user]);

  const cleanCourseName = (name) => name.replace(/\(.*?\)|\b2ENG\s[TPL]\d{3}\b/g, "").trim();

  const getPeriodTiming = (index) => {
    return timingMode === "ramadan" ? ramadanTimings[index] : normalTimings[faculty]?.[index] || "N/A";
  };

  if (loading) return <LoadingBar />; // Show the loading bar while loading

  return (
    <div className={`p-6 min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-3xl font-bold mb-6">Your Schedule</h2>

      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && schedule.length === 0 && !error && <p className="text-center text-lg text-gray-500">No schedule available.</p>}

      <div className="space-y-6">
        {schedule.map((day) => (
          <div key={day.day} className={`p-6 rounded-lg shadow-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{day.day}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="p-3 text-left">Period</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(day.periods).map(([period, details], index) => (
                  <tr
                    key={index}
                    className={details.course === "Free" ? (darkMode ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500") : darkMode ? "bg-gray-900" : "bg-white"}
                  >
                    <td className="p-3 border-b">{period}</td>
                    <td className="p-3 border-b font-semibold">{getPeriodTiming(index)}</td>
                    <td className={`p-3 border-b ${details.course === "Free" ? "italic" : "font-medium"}`}>
                      {details.course === "Free" ? "Free Period" : cleanCourseName(details.course)}
                    </td>
                    <td className="p-3 border-b">{details.location !== "None" ? <span className={`px-3 py-1 rounded-full ${darkMode ? "bg-blue-400 text-gray-900" : "bg-blue-500 text-white"}`}>{details.location}</span> : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
