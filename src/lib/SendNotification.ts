import { supabase } from '../components/auth/supabaseClient'

export const SendNotification = async ({ userId, title, message, type = 'general' }) => {
  if (!userId || !title || !message) return;

  const { error } = await supabase.from('notifications').insert([
    {
      user_id: userId,
      title,
      message,
      type,
    }
  ]);

  if (error) {
    console.error('Failed to send notification:', error.message);
  }
};
