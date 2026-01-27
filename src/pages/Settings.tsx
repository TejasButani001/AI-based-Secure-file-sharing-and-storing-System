import { Shield, Bell, Lock, Key } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your security preferences
          </p>
        </div>

        {/* Security Settings */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Security Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>
                <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Login Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new logins
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Encryption Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Encryption</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">File Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    AES-256 encryption for all files
                  </p>
                </div>
                <span className="secure-badge">Enabled</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">End-to-End Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    Encrypt data in transit
                  </p>
                </div>
                <span className="secure-badge">Active</span>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Critical security notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">File Activity</p>
                  <p className="text-sm text-muted-foreground">
                    Uploads, downloads, and shares
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Security summary emails
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">API Keys</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  API Key
                </label>
                <div className="flex gap-2">
                  <Input
                    value="sv_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <Button variant="outline">
                Generate New Key
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="glow">Save Changes</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
