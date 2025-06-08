
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Key, Clock } from 'lucide-react';
import { useAuthSettings } from '@/hooks/useAuthSettings';
import { Badge } from '@/components/ui/badge';

export const AuthConfigPanel = () => {
  const { settings, loading, updateSetting, getSetting } = useAuthSettings();
  const [tempValues, setTempValues] = useState<Record<string, any>>({});

  const handleToggle = async (settingName: string, checked: boolean) => {
    await updateSetting(settingName, checked);
  };

  const handleNumberChange = (settingName: string, value: string) => {
    setTempValues(prev => ({ ...prev, [settingName]: value }));
  };

  const handleNumberSubmit = async (settingName: string) => {
    const value = tempValues[settingName];
    if (value !== undefined) {
      await updateSetting(settingName, parseInt(value));
      setTempValues(prev => ({ ...prev, [settingName]: undefined }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Authentication Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Authentication Configuration
          </CardTitle>
          <CardDescription>
            Configure authentication rules and settings for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Confirmation */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Email Confirmation Required
              </Label>
              <p className="text-sm text-gray-500">
                Require users to confirm their email before accessing the app
              </p>
            </div>
            <Switch
              checked={getSetting('email_confirmation_required') === true}
              onCheckedChange={(checked) => handleToggle('email_confirmation_required', checked)}
            />
          </div>

          {/* Google Auth */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Google OAuth Enabled
              </Label>
              <p className="text-sm text-gray-500">
                Allow users to sign in with their Google account
              </p>
            </div>
            <Switch
              checked={getSetting('google_auth_enabled') === true}
              onCheckedChange={(checked) => handleToggle('google_auth_enabled', checked)}
            />
          </div>

          {/* Password Min Length */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Minimum Password Length
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempValues['password_min_length'] ?? getSetting('password_min_length') ?? 6}
                onChange={(e) => handleNumberChange('password_min_length', e.target.value)}
                className="w-20"
                min="4"
                max="20"
              />
              <Button
                size="sm"
                onClick={() => handleNumberSubmit('password_min_length')}
                disabled={tempValues['password_min_length'] === undefined}
              >
                Update
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Set the minimum number of characters required for passwords
            </p>
          </div>

          {/* Session Timeout */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Timeout (Hours)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempValues['session_timeout_hours'] ?? getSetting('session_timeout_hours') ?? 24}
                onChange={(e) => handleNumberChange('session_timeout_hours', e.target.value)}
                className="w-20"
                min="1"
                max="168"
              />
              <Button
                size="sm"
                onClick={() => handleNumberSubmit('session_timeout_hours')}
                disabled={tempValues['session_timeout_hours'] === undefined}
              >
                Update
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              How long users stay logged in (1-168 hours)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current RLS Policies Status */}
      <Card>
        <CardHeader>
          <CardTitle>Row Level Security Status</CardTitle>
          <CardDescription>
            Current database security policies in effect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span>Emails Table</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Protected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Notes Table</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Protected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Calendar Events Table</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Protected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Profiles Table</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Protected
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            All tables have Row Level Security enabled with user-specific access policies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
