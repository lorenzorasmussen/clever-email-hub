
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AuthSetting {
  id: string;
  setting_name: string;
  setting_value: any;
  description: string;
  created_at: string;
  updated_at: string;
}

// Mock data until database types are updated
const mockSettings: AuthSetting[] = [
  {
    id: '1',
    setting_name: 'two_factor_auth',
    setting_value: 'enabled',
    description: 'Two-factor authentication',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useAuthSettings = () => {
  const [settings, setSettings] = useState<AuthSetting[]>(mockSettings);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    // Mock fetch - will be replaced when types are updated
    return settings;
  };

  const updateSetting = async (settingName: string, value: any) => {
    setSettings(prev => prev.map(setting => 
      setting.setting_name === settingName 
        ? { ...setting, setting_value: value, updated_at: new Date().toISOString() }
        : setting
    ));
    
    toast({
      title: "Success",
      description: "Setting updated successfully"
    });
  };

  const getSetting = (settingName: string) => {
    const setting = settings.find(s => s.setting_name === settingName);
    return setting?.setting_value;
  };

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
};
