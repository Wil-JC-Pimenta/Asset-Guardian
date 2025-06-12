
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Settings, 
  Package, 
  Calendar, 
  AlertTriangle,
  Wrench,
  Building2
} from 'lucide-react';
import { NavigationItem } from './MaintenanceApp';

const menuItems = [
  {
    id: 'dashboard' as NavigationItem,
    title: 'Dashboard',
    icon: BarChart3,
    description: 'Visão geral e KPIs'
  },
  {
    id: 'equipment' as NavigationItem,
    title: 'Equipamentos',
    icon: Settings,
    description: 'Gestão de ativos'
  },
  {
    id: 'inventory' as NavigationItem,
    title: 'Inventário',
    icon: Package,
    description: 'Sobressalentes'
  },
  {
    id: 'maintenance' as NavigationItem,
    title: 'Manutenção',
    icon: Calendar,
    description: 'Planos e ordens'
  },
  {
    id: 'analysis' as NavigationItem,
    title: 'Análise de Falhas',
    icon: AlertTriangle,
    description: 'FMEA e histórico'
  },
];

interface AppSidebarProps {
  activeSection: NavigationItem;
  onSectionChange: (section: NavigationItem) => void;
}

export const AppSidebar = ({ activeSection, onSectionChange }: AppSidebarProps) => {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">MainTech CRM</h1>
            <p className="text-sm text-sidebar-foreground/70">Gestão da Manutenção</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 mb-2">
            Módulos Principais
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeSection === item.id}
                    className="w-full justify-start text-left hover:bg-sidebar-accent/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <button 
                      onClick={() => onSectionChange(item.id)}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 text-sidebar-foreground/70">
          <Wrench className="h-4 w-4" />
          <div className="text-sm">
            <div className="font-medium">Sistema v2.1.0</div>
            <div className="text-xs">Conforme ABNT NBR 5462</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
