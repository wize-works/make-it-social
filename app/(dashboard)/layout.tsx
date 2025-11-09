import { ContextSwitcher } from '@/components/context-switcher';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content bg-base-200">

                {/* Main Content */}
                {children}
            </div>

            {/* Sidebar */}
            <div className='drawer-side is-drawer-close:overflow-visible'>
                <Sidebar />
            </div>
        </div>
    );
}
