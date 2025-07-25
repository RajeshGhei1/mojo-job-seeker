import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Activity, Users, ArrowLeft, TestTube, Monitor } from 'lucide-react';
import UserActivityDashboard from '@/components/superadmin/user-activity/UserActivityDashboard';
import UserSessionViewer from '@/components/superadmin/user-activity/UserSessionViewer';
import ActiveUsersWidget from '@/components/superadmin/user-activity/ActiveUsersWidget';
import AuditLogTest from '@/components/superadmin/user-activity/AuditLogTest';
import ComprehensiveUserTracking from '@/components/superadmin/user-activity/ComprehensiveUserTracking';

const UserActivity: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  const handleBackToDashboard = () => {
    navigate('/superadmin/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">User Activity</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to BI Dashboard
          </Button>
        </div>
        <p className="text-muted-foreground">
          Monitor user sessions, track login patterns, and manage active connections
        </p>
      </div>

      <Tabs defaultValue="comprehensive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="comprehensive" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Comprehensive
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="active-users" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Active Users
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive" className="space-y-6">
          <ComprehensiveUserTracking tenantId={selectedTenantId} />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <UserActivityDashboard selectedTenantId={selectedTenantId} />
        </TabsContent>

        <TabsContent value="active-users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveUsersWidget tenantId={selectedTenantId} />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Real-time User Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Monitor active users across all tenants with real-time updates. 
                The widget automatically refreshes every 30 seconds to show current online users.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Real-time active user count</li>
                  <li>• Auto-refresh every 30 seconds</li>
                  <li>• Tenant-specific filtering</li>
                  <li>• Last 24 hours activity</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <UserSessionViewer 
            selectedTenantId={selectedTenantId} 
            onTenantChange={setSelectedTenantId}
          />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <AuditLogTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserActivity;
