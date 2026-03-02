import AdminLayout from "@/layouts/AdminLayout";
import { Users, GraduationCap, School, AlertOctagon, BarChart3, ChevronDown, Flame, TrendingUp, Check } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";

export function AdminDashboard() {
    const [stats, setStats] = useState<{
        totalSiswa: number | null;
        totalGuru: number | null;
        totalKelas: number | null;
    }>({
        totalSiswa: null,
        totalGuru: null,
        totalKelas: null,
    });

    const [rawPelanggaranData, setRawPelanggaranData] = useState<any[]>([]);
    const [pelanggaranFilter, setPelanggaranFilter] = useState<'All Time' | 'Tahunan' | 'Bulanan' | 'Harian'>('All Time');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };

                const endpoints = [
                    { key: 'siswa', url: 'http://localhost:8000/api/siswa' },
                    { key: 'guru', url: 'http://localhost:8000/api/guru' },
                    { key: 'kelas', url: 'http://localhost:8000/api/kelas' },
                    { key: 'pelanggaran', url: 'http://localhost:8000/api/pelanggaran' }
                ];

                const fetchPromises = endpoints.map(ep =>
                    fetch(ep.url, { method: 'GET', headers })
                        .then(res => {
                            if (!res.ok) throw new Error("Fetch failed");
                            return res.json();
                        })
                        .then(result => ({ key: ep.key, result }))
                        .catch(() => ({ key: ep.key, result: { data: [] } }))
                );

                const results = await Promise.allSettled(fetchPromises);

                let totalSiswa: number | null = null;
                let totalGuru: number | null = null;
                let totalKelas: number | null = null;
                let dataPelanggaran: any[] = [];

                results.forEach((res) => {
                    if (res.status === 'fulfilled') {
                        const { key, result } = res.value;
                        let validData: any[] = [];

                        if (result && result.data && Array.isArray(result.data)) {
                            // Filter data to only include those where deleted_at is null
                            validData = result.data.filter((item: any) => !item.deleted_at);
                        }

                        if (validData.length > 0) {
                            if (key === 'siswa') {
                                totalSiswa = validData.length;
                            } else if (key === 'guru') {
                                totalGuru = validData.length;
                            } else if (key === 'kelas') {
                                totalKelas = validData.length;
                            } else if (key === 'pelanggaran') {
                                dataPelanggaran = validData;
                            }
                        }
                    }
                });

                setStats({
                    totalSiswa,
                    totalGuru,
                    totalKelas,
                });
                setRawPelanggaranData(dataPelanggaran);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredPelanggaranCount = useMemo(() => {
        if (!rawPelanggaranData.length) return null;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

        let count = 0;
        rawPelanggaranData.forEach((p: any) => {
            const dateStr = p.tanggal || p.created_at;
            if (dateStr) {
                const pDate = new Date(dateStr).getTime();
                if (pelanggaranFilter === 'All Time') {
                    count++;
                } else if (pelanggaranFilter === 'Tahunan' && pDate >= startOfYear) {
                    count++;
                } else if (pelanggaranFilter === 'Bulanan' && pDate >= startOfMonth) {
                    count++;
                } else if (pelanggaranFilter === 'Harian' && pDate >= startOfDay) {
                    count++;
                }
            }
        });

        return count;
    }, [rawPelanggaranData, pelanggaranFilter]);

    const daftarPantau = useMemo(() => {
        if (!rawPelanggaranData.length) return [];

        const map = new Map<string, { nama_siswa: string, kelas: string, total_poin: number }>();

        rawPelanggaranData.forEach(p => {
            const key = `${p.nama_siswa}-${p.kelas}`;
            if (!map.has(key)) {
                map.set(key, { nama_siswa: p.nama_siswa || 'Unknown', kelas: p.kelas || '-', total_poin: 0 });
            }
            map.get(key)!.total_poin += (Number(p.poin) || 0);
        });

        return Array.from(map.values())
            .filter(item => item.total_poin > 0)
            .sort((a, b) => b.total_poin - a.total_poin)
            .slice(0, 10);
    }, [rawPelanggaranData]);

    const statCards = [
        {
            title: "Total Siswa",
            value: stats.totalSiswa,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
            desc: "Jumlah seluruh siswa terdaftar",
        },
        {
            title: "Total Guru",
            value: stats.totalGuru,
            icon: GraduationCap,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            desc: "Jumlah seluruh pendidik",
        },
        {
            title: "Total Kelas",
            value: stats.totalKelas,
            icon: School,
            color: "text-purple-500",
            bg: "bg-purple-50",
            desc: "Jumlah kelas yang aktif",
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="flex flex-col gap-6 w-full min-h-min pb-2">
                {/* Top Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10 shrink-0">
                    {statCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col p-6 bg-white border border-neutral-100 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
                                    <div className="mt-3">
                                        {card.value !== null && card.value !== undefined ? (
                                            <h3 className="text-3xl font-bold text-neutral-800">{card.value}</h3>
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-md">
                                                    Data belum ada
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon className={`w-6 h-6 stroke-[1.5] ${card.color}`} />
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-neutral-100">
                                <p className="text-xs font-medium text-neutral-400">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Big Data Pelanggaran Card */}
                <div className={`bg-gradient-to-br from-white to-red-50/50 p-6 md:p-8 rounded-2xl border border-red-100 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative min-h-[160px] shrink-0 ${isDropdownOpen ? 'z-50' : 'z-20'}`}>
                    {/* Background graphic strictly contained without clipping absolute menus */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
                        <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] pointer-events-none">
                            <AlertOctagon className="w-80 h-80 text-red-600 transform rotate-12" />
                        </div>
                    </div>

                    <div className="flex-1 w-full relative z-[15] flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                        {/* Left: Text & Title */}
                        <div className="w-full xl:w-auto">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-800">Data Pelanggaran</h3>
                            </div>
                            <p className="text-neutral-500 text-sm md:text-base max-w-sm">
                                Total akumulasi data pelanggaran berdasarkan rentang waktu yang dipilih.
                            </p>
                        </div>

                        {/* Right: Filter & Data */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
                            <div className="relative w-full sm:w-[260px]" ref={dropdownRef}>
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center justify-between w-full bg-white border border-neutral-200 text-neutral-700 py-3 px-4 rounded-xl cursor-pointer shadow-sm hover:border-red-300 transition-all font-semibold text-sm"
                                >
                                    <span>
                                        {pelanggaranFilter === 'All Time' && 'All Time (Keseluruhan)'}
                                        {pelanggaranFilter === 'Tahunan' && 'Tahun Ini'}
                                        {pelanggaranFilter === 'Bulanan' && 'Bulan Ini'}
                                        {pelanggaranFilter === 'Harian' && 'Hari Ini'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {[
                                            { value: 'All Time', label: 'All Time (Keseluruhan)' },
                                            { value: 'Tahunan', label: 'Tahun Ini' },
                                            { value: 'Bulanan', label: 'Bulan Ini' },
                                            { value: 'Harian', label: 'Hari Ini' }
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    setPelanggaranFilter(option.value as any);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors text-sm font-medium ${pelanggaranFilter === option.value
                                                    ? 'bg-red-50 text-red-700'
                                                    : 'text-neutral-700 hover:bg-neutral-50'
                                                    }`}
                                            >
                                                {option.label}
                                                {pelanggaranFilter === option.value && <Check className="w-4 h-4 text-red-600" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center shrink-0">
                                {filteredPelanggaranCount !== null ? (
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-5xl md:text-7xl font-black text-red-600 tracking-tight">{filteredPelanggaranCount}</h2>
                                        <span className="text-base md:text-lg font-bold text-red-600/60 uppercase">Kasus</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-neutral-500 bg-white px-4 py-2 rounded-lg border border-neutral-200 shadow-sm">
                                        Data belum ada
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daftar Pantau (Bottom Card) */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col relative z-10 overflow-hidden shrink-0">
                    <div className="p-6 md:p-8 border-b border-neutral-100 bg-gradient-to-r from-orange-50 to-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl shadow-inner">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-800">Daftar Pantau</h3>
                                <p className="text-sm text-neutral-500 mt-1">Top 10 siswa dengan poin pelanggaran terbanyak di sekolah</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-0">
                        {daftarPantau.length > 0 ? (
                            <div className="divide-y divide-neutral-100 flex flex-col">
                                {daftarPantau.map((siswa, idx) => (
                                    <div key={idx} className="flex flex-row items-center justify-between p-4 md:px-8 md:py-5 hover:bg-orange-50/30 transition-colors gap-3">
                                        <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-black shadow-sm border shrink-0 ${idx === 0 ? 'bg-[#FFD700] text-yellow-900 border-yellow-300' :
                                                idx === 1 ? 'bg-[#C0C0C0] text-gray-800 border-gray-300' :
                                                    idx === 2 ? 'bg-[#cd7f32] text-amber-900 border-amber-700/30' :
                                                        'bg-neutral-50 text-neutral-500 border-neutral-200'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-neutral-800 text-sm md:text-lg tracking-tight truncate">{siswa.nama_siswa}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] md:text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md whitespace-nowrap">Kelas: {siswa.kelas}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2 bg-red-50/80 px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border border-red-100 shrink-0">
                                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                                            <span className="font-black text-red-600 text-[11px] md:text-base whitespace-nowrap">{siswa.total_poin} POIN</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                                    <AlertOctagon className="w-10 h-10 text-neutral-300" />
                                </div>
                                <h4 className="text-lg font-semibold text-neutral-700 mb-1">Daftar Pantau Kosong</h4>
                                <p className="text-neutral-500 font-medium max-w-sm">Belum ada siswa yang tercatat melakukan pelanggaran dalam sistem.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;