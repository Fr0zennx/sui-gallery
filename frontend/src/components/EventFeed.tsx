import { useState, useEffect, useCallback } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { PACKAGE_ID, MODULE_NAME } from '../constants';

interface MarketEvent {
    id: string;
    type: 'listed' | 'sold';
    carId: string;
    price: string;
    address: string;
    timestamp: number;
}

export default function EventFeed() {
    const suiClient = useSuiClient();
    const [events, setEvents] = useState<MarketEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (PACKAGE_ID === '<PAKET_IDINIZ>') {
            setLoading(false);
            return;
        }

        try {
            const [listedEvents, boughtEvents] = await Promise.all([
                suiClient.queryEvents({
                    query: { MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarListed` },
                    limit: 10,
                    order: 'descending',
                }),
                suiClient.queryEvents({
                    query: { MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarBought` },
                    limit: 10,
                    order: 'descending',
                }),
            ]);

            const allEvents: MarketEvent[] = [];

            for (const event of listedEvents.data) {
                const data = event.parsedJson as any;
                allEvents.push({
                    id: event.id.txDigest + '-l',
                    type: 'listed',
                    carId: data.car_id || 'Unknown',
                    price: data.price || '0',
                    address: data.seller || 'Unknown',
                    timestamp: Number(event.timestampMs) || Date.now(),
                });
            }

            for (const event of boughtEvents.data) {
                const data = event.parsedJson as any;
                allEvents.push({
                    id: event.id.txDigest + '-b',
                    type: 'sold',
                    carId: data.car_id || 'Unknown',
                    price: data.price || '0',
                    address: data.buyer || 'Unknown',
                    timestamp: Number(event.timestampMs) || Date.now(),
                });
            }

            allEvents.sort((a, b) => b.timestamp - a.timestamp);
            setEvents(allEvents.slice(0, 15));
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }, [suiClient]);

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
    }, [fetchEvents]);

    const formatPrice = (priceMist: string) => {
        try {
            return (Number(BigInt(priceMist)) / Number(MIST_PER_SUI)).toFixed(2);
        } catch {
            return '0';
        }
    };

    const formatTime = (timestamp: number) => {
        const diff = Math.floor((Date.now() - timestamp) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    const shortenAddr = (addr: string) => addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Activity</h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />)}
                </div>
            ) : events.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6">No activity yet.</p>
            ) : (
                <div className="space-y-2">
                    {events.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                            <div className={`w-1.5 h-1.5 rounded-full ${event.type === 'listed' ? 'bg-accent-blue' : 'bg-green-500'}`} />
                            <span className="text-xs text-zinc-400 w-12">{event.type === 'listed' ? 'Listed' : 'Sold'}</span>
                            <span className="text-xs text-zinc-300 font-mono flex-1 truncate">{shortenAddr(event.carId)}</span>
                            <span className="text-xs text-white font-medium">{formatPrice(event.price)} SUI</span>
                            <span className="text-xs text-zinc-600 w-16 text-right">{formatTime(event.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
