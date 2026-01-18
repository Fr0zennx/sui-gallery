import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { PACKAGE_ID, MODULE_NAME } from '../constants';

interface DashboardStats {
    totalMinted: number;
    activeListings: number;
    userCars: number;
    totalVolume: string;
}

export default function Dashboard() {
    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
    const [stats, setStats] = useState<DashboardStats>({
        totalMinted: 0,
        activeListings: 0,
        userCars: 0,
        totalVolume: '0',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (PACKAGE_ID === '<PAKET_IDINIZ>') {
            setLoading(false);
            return;
        }
        fetchStats();
    }, [currentAccount]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const listedEvents = await suiClient.queryEvents({
                query: { MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarListed` },
                limit: 100,
                order: 'descending',
            });

            const boughtEvents = await suiClient.queryEvents({
                query: { MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarBought` },
                limit: 100,
                order: 'descending',
            });

            let totalVolume = BigInt(0);
            const soldCarIds = new Set<string>();
            for (const event of boughtEvents.data) {
                const data = event.parsedJson as any;
                if (data.price) totalVolume += BigInt(data.price);
                if (data.car_id) soldCarIds.add(data.car_id);
            }

            const listedCarIds = new Set<string>();
            for (const event of listedEvents.data) {
                const data = event.parsedJson as any;
                if (data.car_id) listedCarIds.add(data.car_id);
            }

            let userCarsCount = 0;
            if (currentAccount?.address) {
                try {
                    const userCars = await suiClient.getOwnedObjects({
                        owner: currentAccount.address,
                        filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Car` },
                        limit: 100,
                    });
                    userCarsCount = userCars.data.length;
                } catch { }
            }

            setStats({
                totalMinted: listedCarIds.size + soldCarIds.size + userCarsCount,
                activeListings: Math.max(0, listedCarIds.size - soldCarIds.size),
                userCars: userCarsCount,
                totalVolume: (Number(totalVolume) / 1_000_000_000).toFixed(2),
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string | number; suffix?: string }) => (
        <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    {icon}
                </div>
                <span className="text-sm text-zinc-500">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                {loading ? (
                    <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                ) : (
                    <>
                        <span className="text-2xl font-bold text-white">{value}</span>
                        {suffix && <span className="text-sm text-zinc-500">{suffix}</span>}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17v-4m8 4v-4m-8 0H5a1 1 0 01-1-1V7a1 1 0 011-1h14a1 1 0 011 1v5a1 1 0 01-1 1h-3" /></svg>}
                label="Total Minted"
                value={stats.totalMinted}
            />
            <StatCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
                label="Active Listings"
                value={stats.activeListings}
            />
            <StatCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
                label="Your Cars"
                value={stats.userCars}
            />
            <StatCard
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Volume"
                value={stats.totalVolume}
                suffix="SUI"
            />
        </div>
    );
}
