export default function StatCardItem({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
    return (
        <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{title}</div>
            </div>
        </div>
    );
}