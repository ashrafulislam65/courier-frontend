'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchShipmentByCode, getShipmentTracking } from '@/lib/api/shipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/shared/StatusBadge';
import { Search, Loader2, PackageSearch } from 'lucide-react';
import { ShipmentStatusHistoryItem, Shipment } from '@/types';
import { toast } from 'sonner';
import TrackingTimeline from '@/components/shared/TrackingTimeline';

export default function TrackPage() {
    const [code, setCode] = useState('');
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [history, setHistory] = useState<ShipmentStatusHistoryItem[]>([]);

    const searchMutation = useMutation({
        mutationFn: async (trackingCode: string) => {
            const found = await searchShipmentByCode(trackingCode);
            const trackingHistory = await getShipmentTracking(found.id);
            return { found, trackingHistory };
        },
        onSuccess: (data) => {
            setShipment(data.found);
            setHistory(data.trackingHistory);
        },
        onError: () => {
            setShipment(null);
            setHistory([]);
            toast.error('No shipment found with that tracking code');
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        searchMutation.mutate(code.trim());
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
                <PackageSearch className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
                <p className="text-gray-500">Enter your tracking code to see live status.</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-3 mb-10">
                <Input
                    placeholder="e.g. CR-015490-EW8VZW"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button type="submit" disabled={searchMutation.isPending}>
                    {searchMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Track</span>
                </Button>
            </form>

            {shipment && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-400">Tracking Code</p>
                                <p className="font-mono font-semibold">{shipment.trackingCode}</p>
                            </div>
                            <StatusBadge status={shipment.status} />
                        </div>

                        <TrackingTimeline history={history} showActor={false} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}