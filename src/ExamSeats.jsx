import { useEffect, useState } from "react";
import axios from "axios";
import LoadingBar from "./LoadingBar"; // Import the LoadingBar component

export default function ExamSeats({ user }) {
  const [examSeats, setExamSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamSeats = async () => {
      try {
        const response = await axios.get("http://161.35.203.118/exam_seats", {
          params: { username: user.username, password: user.password },
        });
        setExamSeats(response.data);
      } catch (err) {
        setError("Failed to load exam seat details");
      } finally {
        setLoading(false);
      }
    };
    fetchExamSeats();
  }, [user]);

  if (loading) return <LoadingBar />; // Show the loading bar while loading

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Exam Seat Details</h2>
      <div className="space-y-4">
        {examSeats.map((exam, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{exam.Course}</h3>
            <p><strong>Exam Day:</strong> {exam.Exam_Day}</p>
            <p><strong>Date:</strong> {exam.Date}</p>
            <p><strong>Time:</strong> {exam.Start_Time} - {exam.End_Time}</p>
            <p><strong>Hall:</strong> {exam.Hall}</p>
            <p><strong>Seat:</strong> {exam.Seat}</p>
            <p><strong>Type:</strong> {exam.Exam_Type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
