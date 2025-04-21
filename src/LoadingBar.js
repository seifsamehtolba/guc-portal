import { useState, useEffect } from "react";

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8; // Increase progress by random value for a smooth effect
      });
    }, 300);

    return () => clearInterval(interval); // Clear interval when the component is unmounted
  }, []);

  return (
    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
      <div
        className="h-full bg-blue-500 dark:bg-yellow-400 rounded-full"
        style={{ width: `${progress}%`, transition: "width 0.3s ease-out" }}
      ></div>
    </div>
  );
}
