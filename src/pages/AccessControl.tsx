import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AccessControl() {
    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Access Control</h1>
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <p className="text-muted-foreground">Permissions and roles management will go here.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
