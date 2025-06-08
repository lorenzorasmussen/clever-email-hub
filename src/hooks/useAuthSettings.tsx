
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthSetting {
  id: string;
  setting_name: string;
  setting_value: any;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useAuthSettings = () => {
  const [settings, setSettings] = useState<AuthSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('auth_settings')
        .select('*')
        .order('setting_name');

      if (error) throw error;
      setSettings(data || []);
    } catch (error: any) {
      console.error('Error fetching auth settings:', error);
      toast({
        title: "Error",
        description: "Failed to load auth settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingName: string, value: any) => {
    try {
      const { error } = await supabase
        .from('auth_settings')
        .update({ setting_value: value })
        .eq('setting_name', settingName);

      if (error) throw error;

      await fetchSettings();
      toast({
        title: "Success",
        description: "Setting updated successfully"
      });
    } catch (error: any) {
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
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
};
