import { useEffect, useState } from "react";

export default function StudentDetails({ user }) {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  // eslint-disable-next-line
  const [nextClass, setNextClass] = useState(null);
  const [progress, setProgress] = useState(0);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState(null);

  const fetchAndSaveSchedule = async () => {
    try {
      const response = await fetch(`http://161.35.203.118/schedule?username=${user.username}&password=${user.password}`);
      if (!response.ok) throw new Error("Failed to fetch schedule");
      const scheduleData = await response.json();
      localStorage.setItem("schedule", JSON.stringify(scheduleData));
      console.log("✅ Schedule saved to localStorage:", scheduleData);
    } catch (err) {
      console.error("❌ Error fetching schedule:", err.message);
    }
  };

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await fetch(`http://161.35.203.118/student?username=${user.username}&password=${user.password}`);
        if (!response.ok) throw new Error("Failed to fetch student details");
        const data = await response.json();
        setStudent(data);

        // 🚀 Check if schedule exists in localStorage, if not, fetch & save it
        if (!localStorage.getItem("schedule")) {
          await fetchAndSaveSchedule();
        }
      } catch (err) {
        setError(err.message);
      }
    }
    fetchStudent();
  // eslint-disable-next-line
  }, [user]);


  useEffect(() => {
    const storedSchedule = JSON.parse(localStorage.getItem("schedule") || "[]");
    if (storedSchedule.length === 0) return;

    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const todaySchedule = storedSchedule.find((d) => d.day === today);
    if (!todaySchedule || !todaySchedule.periods) return;

    const periodNames = ["First Period", "Second Period", "Third Period", "Fourth Period", "Fifth Period"];
    const normalTimings = {
      Pharmacy: ["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "12:00 PM - 1:30 PM", "1:45 PM - 3:15 PM", "3:45 PM - 5:15 PM"],
      Engineering: ["8:15 AM - 9:45 AM", "10:00 AM - 11:30 AM", "11:45 AM - 1:15 PM", "1:45 PM - 3:15 PM", "3:45 PM - 5:15 PM"],
    };
    const ramadanTimings = ["8:30 AM - 9:40 AM", "9:45 AM - 10:55 AM", "11:00 AM - 12:10 PM", "12:20 PM - 1:30 PM", "1:35 PM - 2:45 PM"];
    const timingMode = localStorage.getItem("timingMode") || "ramadan";
    const faculty = localStorage.getItem("faculty") || "Engineering";
    const timings = timingMode === "ramadan" ? ramadanTimings : normalTimings[faculty];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    let foundCurrent = false;

    for (let i = 0; i < periodNames.length; i++) {
      const periodKey = periodNames[i];
      const periodDetails = todaySchedule.periods[periodKey];
      const [start, end] = timings[i].split(" - ").map((t) => {
        const [hour, minute] = t.match(/\d+/g).map(Number);
        const isPM = t.includes("PM") && hour !== 12;
        return (hour + (isPM ? 12 : 0)) * 60 + minute;
      });

      if (currentTime >= start && currentTime <= end) {
        setCurrentClass(periodDetails);
        setTimeLeft(end - currentTime);
        setProgress(((currentTime - start) / (end - start)) * 100);
        foundCurrent = true;
        break;
      }

      if (!foundCurrent && start > currentTime && periodDetails.course !== "Free") {
        setUpcomingClass(periodDetails);
        setTimeUntilNext(start - currentTime);
        break;
      }
    }
  }, []);

  if (error) {
    return <div className="text-center mt-10 text-xl text-red-500 dark:text-red-400">{error}</div>;
  }

  if (!student) {
    return <div className="text-center mt-10 text-xl text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md transition-all">
        <h2 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white">
          🎓 Welcome, {student["Student Name"]}!
        </h2>

        <div className="text-gray-600 dark:text-gray-400 space-y-2">
          <p className="text-lg"><span className="font-semibold">📌 Student ID:</span> {student["Student ID"]}</p>
          <p className="text-lg"><span className="font-semibold">📧 Email:</span> {student["Student Mail"]}</p>
          <p className="text-lg"><span className="font-semibold">📚 Study Group:</span> {student["Study Group"]}</p>
        </div>

        {currentClass ? (
          <>
            <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-300">📌 Currently in:</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{currentClass.course} ({currentClass.location})</p>
              <p className="text-lg text-gray-700 dark:text-gray-400">⏳ Ends in {timeLeft} mins</p>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4">
              <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        ) : (
          upcomingClass ? (
            <p className="text-xl text-gray-500 mt-4 font-medium">🕒 Next class: {upcomingClass.course} ({upcomingClass.location}) in {timeUntilNext} mins</p>
          ) : (
            <p className="text-xl text-gray-500 mt-4 font-medium">No more classes today</p>
          )
        )}
      </div>
    </div>
  );
}
