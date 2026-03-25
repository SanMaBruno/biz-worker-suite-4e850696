import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAvatarUpload() {
  const { user } = useAuth();

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('No autenticado');

    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Add cache buster
    const url = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return url;
  }, [user]);

  const removeAvatar = useCallback(async (): Promise<void> => {
    if (!user) throw new Error('No autenticado');

    // List and delete all files in user folder
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(user.id);

    if (files && files.length > 0) {
      await supabase.storage
        .from('avatars')
        .remove(files.map(f => `${user.id}/${f.name}`));
    }

    await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('user_id', user.id);
  }, [user]);

  return { uploadAvatar, removeAvatar };
}
