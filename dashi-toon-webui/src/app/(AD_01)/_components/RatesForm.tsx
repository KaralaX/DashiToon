import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, DollarSign, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getCommissionRates,
    getKanaExchangeRates,
    updateCommissionRate,
    updateKanaExchangeRate,
} from "@/utils/api/admin";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useLocalStorage } from "usehooks-ts";
import UwU from "@/components/UwU";

export interface Rates {
    kanaToVnd: number;
    commissionRate: number;
}

export function RatesForm(): React.ReactElement {
    const [kanaToVnd, setKanaToVnd] = useState<number>(0);
    const [commissionRate, setcommissionRate] = useState<number>(0);

    const [ratesLoading, setRatesLoading] = useState<boolean>(true);
    const [ratesUpdating, setRatesUpdating] = useState<boolean>(false);

    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useLocalStorage("time", new Date());

    useEffect(() => {
        async function work() {
            const [cr, cerr] = await getCommissionRates(1); // 1: Kana
            if (cerr) {
                toast.error("Không thể tải tỷ giá và tỷ lệ chia sẻ");
                return;
            }

            setcommissionRate(cr.rate);

            const [asr, asrerr] = await getKanaExchangeRates();
            if (asrerr) {
                toast.error("Không thể tải tỷ giá và tỷ lệ chia sẻ");
                return;
            }

            setKanaToVnd(asr.rate);
            setRatesLoading(false);
        }
        work();
    }, [setDate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRatesUpdating(true);
        try {
            const [_, err] = await updateCommissionRate({
                rate: commissionRate,
                type: 1, // 1: Kana
            });

            if (err) {
                toast.error("Không thể cập nhật tỷ lệ chia sẻ");
                return;
            }

            const [__, asrerr] = await updateKanaExchangeRate(kanaToVnd);
            if (asrerr) {
                toast.error("Không thể cập nhật tỷ giá");
                return;
            }

            toast.success("Cập nhật tỷ giá và tỷ lệ chia sẻ thành công");
            setTime(date);
        } finally {
            setRatesUpdating(false);
        }
    };

    if (ratesLoading) {
        return <RatesSkeleton />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Cài đặt tỷ giá và tỷ lệ chia sẻ
                    <UwU>
                        <p className="text-sm text-muted-foreground">
                            Có hiệu lực vào {new Date(time)?.toLocaleDateString?.("vi-VN")}
                        </p>
                    </UwU>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="kanaToVnd">
                            <DollarSign className="mr-2 inline h-4 w-4" />
                            Tỷ giá Kana sang VND
                        </Label>
                        <Input
                            id="kanaToVnd"
                            type="number"
                            value={kanaToVnd}
                            onChange={(e) => setKanaToVnd(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="commissionRate">
                            <BookOpen className="mr-2 inline h-4 w-4" />
                            Tỷ lệ chia sẻ cho tác giả
                        </Label>
                        <Input
                            id="commissionRate"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={commissionRate}
                            onChange={(e) => setcommissionRate(Number(e.target.value))}
                            required
                        />
                    </div>
                    <UwU>
                        <div>
                            <Label htmlFor="date">Chọn ngày</Label>
                            <div className="flex gap-2">
                                <DateTimePicker value={date} onChange={(b) => setDate(b!)} />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setDate(new Date());
                                    }}
                                >
                                    Chọn ngày hôm nay
                                </Button>
                            </div>
                        </div>
                    </UwU>
                    <Button type="submit">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Cập nhật
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function RatesSkeleton(): React.ReactElement {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/4" />
                </div>
            </CardContent>
        </Card>
    );
}