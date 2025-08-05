import { useEffect, useState, useContext } from 'react';
import { supabase } from '../../components/auth/supabaseClient'
import { useAuth } from '../../contexts/AuthContext';

export default function Notification() {
//   const { user } = useContext(AuthContext);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState();

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchNotifications();
  }, [user]);

  // MARK SINGLE NOTIFICATION AS READ
  const markAsRead = async (id) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    fetchNotifications();
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    fetchNotifications();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Your Notifications</h1>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`p-4 rounded border shadow-sm cursor-pointer transition ${
                n.is_read
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-blue-50 dark:bg-blue-900'
              }`}
            >
              <strong className="block">{n.title}</strong>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
