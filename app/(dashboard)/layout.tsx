import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col min-h-screen">

                {/* Main Content */}
                <main className="flex-1 bg-base-200">
                    {children}
                </main>
            </div>

            {/* Sidebar */}
            <Sidebar />
        </div>
    );
}
