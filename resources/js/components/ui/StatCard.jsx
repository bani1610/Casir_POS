export default function StatCard({ icon: Icon, label, value, trend, trendValue, iconBgColor = 'bg-blue-50', iconColor = 'text-blue-600' }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-[var(--color-text-muted)] font-medium mb-1">{label}</p>
                    <p className="text-3xl font-bold text-[var(--color-text)] mb-2">{value}</p>
                    {trend && (
                        <p className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </p>
                    )}
                </div>
                <div className={`${iconBgColor} ${iconColor} p-3 rounded-xl`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}
