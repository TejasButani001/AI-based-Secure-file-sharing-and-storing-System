import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DatabaseMonitor() {
    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Database Monitor</h1>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <p className="text-muted-foreground">Database health and performance metrics will go here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
