import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import LoadingBar from "./LoadingBar"; // Import the LoadingBar component

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(
          `http://161.35.203.118/notifications?username=${user.username}&password=${user.password}`
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedMessage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) return <LoadingBar />; // Show the loading bar while loading

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold">{notification.Title}</h3>
                <button
                  className="mt-2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition flex items-center gap-2"
                  onClick={() => setSelectedMessage(notification.Full_Message)}
                  aria-label="Show message"
                >
                  <MessageCircle size={18} /> Show Message
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No notifications available.</p>
          )}
        </div>
      )}

      {/* Modal for Full Message */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Message:</h3>
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{selectedMessage}</p>
            <button
              className="mt-4 bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition"
              onClick={() => setSelectedMessage(null)}
              aria-label="Close message"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
