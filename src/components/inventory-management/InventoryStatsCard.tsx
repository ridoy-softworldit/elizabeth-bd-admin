import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
    title: string
    value: string
    subtitle: string
    icon: string
    color: string
}

const stats: StatItem[] = [
    { title: "Total Products", value: "1,234", subtitle: "+12% from last month", icon: "💎", color: "text-purple-600" },
    { title: "Low Stock Items", value: "24", subtitle: "Needs restocking", icon: "⚠️", color: "text-yellow-600" },
    { title: "Out of Stock", value: "8", subtitle: "-3 from yesterday", icon: "🚨", color: "text-red-600" },
    { title: "Total Value", value: "$2.4M", subtitle: "+6% from last month", icon: "📈", color: "text-green-600" },
]

const InventoryStatsCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card key={index} className="p-4">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.subtitle}</p>
                            </div>
                            <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default InventoryStatsCard
