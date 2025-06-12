
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Dashboard } from './Dashboard';
import { EquipmentManagement } from './EquipmentManagement';
import { InventoryManagement } from './InventoryManagement';
import { MaintenancePlans } from './MaintenancePlans';
import { FailureAnalysis } from './FailureAnalysis';

export type NavigationItem = 'dashboard' | 'equipment' | 'inventory' | 'maintenance' | 'analysis';

export const MaintenanceApp = () => {
  const [activeSection, setActiveSection] = useState<NavigationItem>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'maintenance':
        return <MaintenancePlans />;
      case 'analysis':
        return <FailureAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
