
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

export type AuthSetting = Tables<'auth_settings'>;

export const useAuthSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AuthSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('auth_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching auth settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingName: string, value: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('auth_settings')
        .upsert({
          user_id: user.id,
          setting_name: settingName,
          setting_value: value,
          description: `Setting for ${settingName}`
        });

      if (error) throw error;
      
      await fetchSettings();
      toast({
        title: "Success",
        description: "Setting updated successfully"
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const getSetting = (settingName: string) => {
    const setting = settings.find(s => s.setting_name === settingName);
    return setting?.setting_value;
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
};
