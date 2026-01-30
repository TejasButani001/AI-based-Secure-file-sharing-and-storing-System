import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function MlDashboard() {
    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">ML Dashboard</h1>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <p className="text-muted-foreground">Machine Learning metrics and intrusion detection stats will go here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
