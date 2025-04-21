import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [timingMode, setTimingMode] = useState(() => localStorage.getItem("timingMode") || "ramadan");

  const handleTimingChange = (e) => {
    const mode = e.target.value;
    setTimingMode(mode);
    localStorage.setItem("timingMode", mode);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Settings</h2>
        <label className="block text-lg mb-2">Select Timing Mode:</label>
        <select
          className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
          value={timingMode}
          onChange={handleTimingChange}
        >
          <option value="ramadan">Ramadan Slots</option>
          <option value="normal">Normal Slots</option>
        </select>
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
