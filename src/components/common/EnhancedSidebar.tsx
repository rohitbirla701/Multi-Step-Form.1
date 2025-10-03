import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RenderIcon } from '@/components/common/RenderIcon';
import { cn } from '@/utils';
import { useCurrentUser } from '@/hooks/redux';
import { UserRole } from '@/types';
import {
  UserLogin,
  GameReport,
  PlayerReport,
  SupplierReport,
  DailyReport,
  RoundReport,
  SummaryReport,
  BetList,
  FailedBets,
  BetStatus,
  OpenBets,
  TransactionSummary,
  Transactions,
  GameManagement,
  NotificationManagement,
  ProviderManagement,
  TestCases,
  UserManagement,
  UserInfo,
} from '@/components/icons';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon?: string | undefined;
  adminOnly?: boolean;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'REPORTS',
    children: [
      { name: 'Game Report', href: '/reports/games', icon: GameReport },
      { name: 'Player Report', href: '/reports/players', icon: PlayerReport },
      { name: 'Supplier Report', href: '/reports/suppliers', icon: SupplierReport },
      { name: 'Summary Report', href: '/reports/summary', icon: SummaryReport },
      { name: 'Daily Report', href: '/reports/daily-report', icon: DailyReport },
      { name: 'Round Report', href: '/reports/round-report', icon: RoundReport },
    ],
  },
  {
    name: 'TRANSACTION',
    // adminOnly: true,
    children: [
      { name: 'Transactions', href: '/transaction/transactions', icon: Transactions },
      { name: 'Summary', href: '/transaction/summary', icon: TransactionSummary },
      { name: 'User Info', href: '/transaction/user-info', icon: UserInfo },
      { name: 'Bet List', href: '/transaction/bet-list', icon: BetList },
      { name: 'Open Bets', href: '/transaction/open-bets', icon: OpenBets },
      { name: 'Bet Status', href: '/transaction/bet-status', icon: BetStatus },
      { name: 'Failed Bets', href: '/transaction/failed-bets', icon: FailedBets },
    ],
  },
  {
    name: 'ADMINISTRATION',
    children: [
      { name: 'User Management', href: '/administration/users', icon: UserManagement },
      { name: 'Game Management', href: '/administration/games', icon: GameManagement },
      {
        name: 'Provider Management',
        href: '/administration/provider-management',
        icon: ProviderManagement,
      },
      {
        name: 'Notifications',
        href: '/administration/notifications',
        icon: NotificationManagement,
      },
      { name: 'Test Cases', href: '/administration/test-cases', icon: TestCases },
    ],
  },
  {
    name: 'TOOLS',
    children: [{ name: 'Game List', href: '/tools/gamelist', icon: Transactions }],
  },
];

interface NavItemComponentProps {
  item: NavItem;
  isOpen: boolean;
  level?: number;
  expandedItem: string | null;
  onToggleExpand: (itemName: string) => void;
}

function NavItemComponent({
  item,
  isOpen,
  level = 0,
  expandedItem,
  onToggleExpand,
}: NavItemComponentProps) {
  const location = useLocation();
  const user = useCurrentUser();
  // const isAdmin = user?.role === UserRole.ADMIN;

  // Don't render admin-only items for non-admin users
  // if (item.adminOnly && !isAdmin) {
  //   return null;
  // }

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? location.pathname === item.href : false;
  const hasActiveChild = item.children?.some(
    (child) => child.href && location.pathname.startsWith(child.href)
  );
  const isExpanded = expandedItem === item.name;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(item.name);
    }
  };

  const Icon = item.icon;
  const indent = level * 16;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            'text-primary flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            !isOpen && 'justify-center'
          )}
          style={{ paddingLeft: isOpen ? `${12 + indent}px` : undefined }}
          title={!isOpen ? item.name : undefined}
        >
          {/* <Icon className={cn('h-5 w-5', isOpen && 'mr-3')} /> */}
          {isOpen && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
                  {item.badge}
                </span>
              )}
              {isExpanded ? (
                <ChevronDown className="ml-2 h-4 w-4 text-white" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4 text-white" />
              )}
            </>
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isExpanded && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.name}
                item={child}
                isOpen={isOpen}
                level={level + 1}
                expandedItem={expandedItem}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular nav item
  return (
    <NavLink
      to={item.href!}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-accent text-white' : 'text-gray-500 hover:text-white hover:bg-gray-600',
          !isOpen && 'justify-center'
        )
      }
      style={{ paddingLeft: isOpen ? `${12 + indent}px` : undefined }}
      title={!isOpen ? item.name : undefined}
    >
      <RenderIcon
        className={cn(
          'transition-opacity',
          isActive ? 'opacity-100' : 'group-hover:opacity-100 opacity-60'
        )}
        src={item?.icon || ''}
      />
      {isOpen && (
        <>
          <span>{item.name}</span>
          {item.badge && (
            <span className="ml-auto inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function EnhancedSidebar({ isOpen, onToggle }: SidebarProps) {
  const user = useCurrentUser();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Auto-expand menu item that contains the active route
  useEffect(() => {
    if (isOpen) {
      const activeMenuItem = navigation.find((item) =>
        item.children?.some((child) => child.href && location.pathname.startsWith(child.href))
      );

      if (activeMenuItem) {
        setExpandedItem(activeMenuItem.name);
      }
    }
  }, [location.pathname, isOpen]);

  // Close all menus when sidebar is collapsed
  useEffect(() => {
    if (!isOpen) {
      setExpandedItem(null);
    }
  }, [isOpen]);

  const handleToggleExpand = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 overflow-hidden bg-sidebar-bg',
          isOpen ? 'w-80 translate-x-0' : 'w-16 -translate-x-full'
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center px-4 my-8">
          <Button
            size="icon"
            onClick={onToggle}
            className="text-white bg-transparent hover:bg-transparent lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className={cn('flex items-center', isOpen ? 'w-full' : 'justify-center')}>
            {isOpen && (
              <div className="ml-3 flex-1 text-center my-8">
                <span className="text-lg font-semibold text-primary text-[48px]">CASS-INNO</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              isOpen={isOpen}
              expandedItem={expandedItem}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
