import React, { useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, Search, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import screenfull from 'screenfull';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { EnhancedSidebar } from '@/components/common/EnhancedSidebar';
import { useCurrentUser } from '@/hooks/redux';
import { useLogoutMutation } from '@/store/api/authApi';
import { cn } from '@/utils';
import { RenderIcon } from '@/components/common/RenderIcon';
import { TelgramRedirect } from '@/components/icons';
import ResetPasswordModal from '@/components/common/ResetPaswordModal';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/store';

export function DashboardLayout() {
  const user = useCurrentUser();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const ref = useRef<HTMLDivElement>(null);

  // const toggleFullScreen = () => {
  //   if (screenfull.isEnabled && ref.current) {
  //     screenfull.toggle(ref.current);
  //     screenfull.toggle(ref.current);
  //   }
  // };

  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
const tzLabel = `${Intl.DateTimeFormat('en-IN', { timeZoneName: 'short' }).format(new Date()).split(' ').pop()} (GMT ${-new Date().getTimezoneOffset() / 60 >= 0 ? '+' : '-'}${String(Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60)).padStart(2, '0')}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, '0')})`;

return (
  <div ref={ref} className="min-h-screen bg-white">
    {/* Enhanced Sidebar */}
    <EnhancedSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

    {/* Main Content */}
    <div className={cn('transition-all duration-300 h-full', sidebarOpen && 'lg:ml-80')}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur bg-white">
        <div className="flex h-16 items-center px-4 justify-between">
          {/* Mobile menu button */}
          <Button
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-black bg-transparent hover:bg-transparent"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* <ThemeSwitcher /> */}
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* <p className="text-primary">Reports in IST (GMT +5:30)</p> */}
            <p className="text-primary">Reports in  {tzLabel}</p>
            {/* Telegram */}
            <Button variant="ghost" size="icon">
              <RenderIcon src={TelgramRedirect} />
              <span className="sr-only">Full Screen</span>
            </Button>
            {/* Full Screen toggle */}
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              <Expand className="h-5 w-5 hover:text-white" />
              <span className="sr-only">Full Screen</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 hover:text-white" />
              <span className="sr-only">Notifications</span>
            </Button>
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <User className="h-5 w-5 hover:text-white" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  {/* <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div> */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)}>
                  <span>Reset Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onUpdate={() => {}}
      />
    </div>
  </div>
);
}
