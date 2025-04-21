import { useState, useEffect } from "react";
import LoadingBar from "./LoadingBar"; // Import the LoadingBar component

export default function Grades({ user }) {
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const response = await fetch(
          `http://161.35.203.118/grades?username=${user.username}&password=${user.password}`
        );
        if (!response.ok) throw new Error("Failed to fetch grades");

        const data = await response.json();

        // Filter out assignments that have no grade or instructor
        const filteredGrades = Object.entries(data).reduce((acc, [course, assignments]) => {
          const validAssignments = assignments.filter(
            (assignment) =>
              assignment.grade && assignment.grade.trim() !== "/ 5" && assignment.instructor
          );
          if (validAssignments.length > 0) {
            acc[course] = validAssignments;
          }
          return acc;
        }, {});

        setGrades(filteredGrades);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, [user]);

  if (loading) return <LoadingBar />; // Show the loading bar while loading

  if (error) return <p className="text-red-500 dark:text-red-400 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Grades</h2>

      <div className="space-y-6">
        {Object.keys(grades).length > 0 ? (
          Object.entries(grades).map(([course, assignments]) => (
            <div key={course} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg text-blue-500 dark:text-yellow-400 mb-2">{course}</h3>
              {assignments.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b dark:border-gray-600">
                      <th className="p-2 text-left">Quiz/Assignment</th>
                      <th className="p-2 text-left">Element</th>
                      <th className="p-2 text-left">Grade</th>
                      <th className="p-2 text-left">Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="p-2">{assignment.quiz_name || "-"}</td>
                        <td className="p-2">{assignment.element_name}</td>
                        <td className="p-2">{assignment.grade}</td>
                        <td className="p-2">{assignment.instructor || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No grades available for this course.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No grades found.</p>
        )}
      </div>
    </div>
  );
}
