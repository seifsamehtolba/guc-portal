import { useState, useEffect } from "react";
import LoadingBar from "./LoadingBar"; // Assuming you created the LoadingBar component

export default function AttendancePage({ user }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await fetch(
          `http://161.35.203.118/attendance?username=${user.username}&password=${user.password}`
        );

        if (!response.ok) throw new Error("Failed to fetch attendance data");

        const data = await response.json();

        // Filter out sessions that don't have attendance data
        const filteredAttendance = Object.entries(data).reduce((acc, [course, sessions]) => {
          const validSessions = sessions.filter(
            (session) => session.Attendance !== null
          );
          if (validSessions.length > 0) {
            acc[course] = validSessions;
          }
          return acc;
        }, {});

        setAttendanceData(filteredAttendance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
  }, [user]);

  // Function to extract date from SessionDsc
  const extractDate = (sessionDsc) => {
    const match = sessionDsc.match(/@(\d{4}\.\d{2}\.\d{2})/);
    return match ? match[1] : null;
  };

  // Function to remove date from SessionDsc
  const removeDateFromSession = (sessionDsc) => {
    return sessionDsc.replace(/ @\d{4}\.\d{2}\.\d{2}/, "");
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Show loading bar when loading */}
      {loading && <LoadingBar />}

      {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {Object.keys(attendanceData).length > 0 ? (
            Object.entries(attendanceData).map(([course, sessions]) => (
              <div key={course} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg text-blue-500 dark:text-yellow-400 mb-2">{course}</h3>
                {sessions.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b dark:border-gray-600">
                        <th className="p-2 text-left">Session</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session, index) => {
                        const date = extractDate(session.SessionDsc);
                        const sessionDescWithoutDate = removeDateFromSession(session.SessionDsc);
                        return (
                          <tr key={index} className="border-b dark:border-gray-700">
                            <td className="p-2">{sessionDescWithoutDate || "-"}</td>
                            <td className="p-2">{date || "-"}</td>
                            <td className={`p-2 ${session.Attendance === "Attended" ? "text-green-500" : "text-red-500"}`}>
                              {session.Attendance}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No attendance data available for this course.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No attendance found.</p>
          )}
        </div>
      )}
    </div>
  );
}
