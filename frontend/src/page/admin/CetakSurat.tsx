import { useState, useMemo, useEffect, useRef } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { IconPrinter, IconChevronDown, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

function SearchableSelect({ value, onChange, options, placeholder, name, disabled = false }: { value: string, onChange: (e: any) => void, options: { label: string, value: string }[], placeholder: string, name: string, disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selected = options.find((o) => o.value === value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter options based on search query
    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                onClick={() => {
                    if (!disabled) {
                        setOpen(!open);
                        setSearch(""); // reset search on toggle
                    }
                }}
                className={cn(
                    "w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white flex justify-between items-center transition-all",
                    disabled ? "opacity-50 cursor-not-allowed bg-neutral-50" : "cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                )}
            >
                <span className={selected ? "text-neutral-800" : "text-neutral-400"}>
                    {selected ? selected.label : placeholder}
                </span>
                <IconChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform duration-200", open && "rotate-180")} />
            </div>
            <AnimatePresence>
                {open && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 max-h-60 flex flex-col bg-white border border-neutral-100 rounded-xl shadow-xl"
                    >
                        <div className="p-2 border-b border-neutral-100 shrink-0">
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Ketik untuk mencari..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="overflow-y-auto overflow-x-hidden p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            onChange({ target: { name, value: opt.value } });
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "px-3 py-2 text-sm cursor-pointer rounded-md transition-colors",
                                            value === opt.value ? "bg-blue-50 text-blue-700 font-medium" : "text-neutral-700 hover:bg-neutral-50"
                                        )}
                                    >
                                        {opt.label}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-neutral-500 text-center">Data tidak ditemukan</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Dummy Siswa Data
const DUMMY_SISWA = [
    { id: 1, nis: "1002", nama: "Budi Santoso", kelas: "X RPL 1" },
    { id: 2, nis: "1001", nama: "Agus Pratama", kelas: "X RPL 1" },
    { id: 3, nis: "1005", nama: "Cici Amelia", kelas: "X RPL 2" },
    { id: 4, nis: "2003", nama: "Dodi Setiawan", kelas: "XI TKJ 1" },
    { id: 5, nis: "2001", nama: "Eka Wardhani", kelas: "XI TKJ 2" },
    { id: 6, nis: "3002", nama: "Faisal Tanjung", kelas: "XII MM 1" },
    { id: 7, nis: "3004", nama: "Gita Wirjawan", kelas: "XII MM 2" },
];

export function AdminCetakSurat() {
    const [jenisSurat, setJenisSurat] = useState("");
    const [kelas, setKelas] = useState("");
    const [siswa, setSiswa] = useState("");

    // For simulate fetching
    const [siswaLengkap] = useState<any[]>(DUMMY_SISWA);
    const [kelasList, setKelasList] = useState<{ id: number, nama_kelas: string }[]>([]);

    useEffect(() => {
        // Fetch data kelas from API
        const fetchKelas = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const response = await fetch("http://localhost:8000/api/kelas", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const result = await response.json();
                if (response.ok && result.data) {
                    setKelasList(result.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data kelas", error);
            }
        };
        fetchKelas();
    }, []);

    const [notification, setNotification] = useState<{ show: boolean, type: "success" | "error", message: string }>({ show: false, type: "success", message: "" });
    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    };

    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "jenisSurat") setJenisSurat(value);
        if (name === "kelas") {
            setKelas(value);
            setSiswa(""); // reset siswa if kelas changes
        }
        if (name === "siswa") setSiswa(value);
    };

    // Filter students by selected class and sort by NIS
    const filteredSiswaOptions = useMemo(() => {
        if (!kelas) return [];
        return siswaLengkap
            .filter(s => s.kelas === kelas)
            .sort((a, b) => a.nis.localeCompare(b.nis)) // Sort by NIS automatically
            .map(s => ({
                label: `${s.nis} - ${s.nama}`,
                value: s.id.toString()
            }));
    }, [kelas, siswaLengkap]);

    const handleCetak = () => {
        if (!jenisSurat) {
            showNotification("error", "Silakan pilih jenis surat terlebih dahulu");
            return;
        }
        if (!kelas) {
            showNotification("error", "Silakan pilih kelas");
            return;
        }
        if (!siswa) {
            showNotification("error", "Silakan pilih siswa yang akan dicetak suratnya");
            return;
        }

        const selectedStudent = siswaLengkap.find(s => s.id.toString() === siswa);
        const studentName = selectedStudent ? selectedStudent.nama : "Siswa";

        // Implement logic to print the letter. 
        // Here we just use window.print simulation.
        showNotification("success", `Menyiapkan cetakan ${jenisSurat} untuk ${studentName}...`);

        setTimeout(() => {
            window.print();
        }, 1000);
    };

    return (
        <AdminLayout title="Cetak Surat">
            <div className="max-w-3xl mx-auto w-full flex flex-col bg-white rounded-xl border border-neutral-100 shadow-sm mb-6">
                <div className="p-6 border-b border-neutral-100 bg-white rounded-t-xl">
                    <h2 className="text-lg font-semibold text-neutral-800">Cetak Surat Peringatan & Panggilan</h2>
                    <p className="text-sm text-neutral-500 mt-1">Pilih jenis surat dan murid berdasarkan urutan NIS.</p>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-visible">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Pilih Kelas</label>
                            <SearchableSelect
                                name="kelas"
                                value={kelas}
                                onChange={handleFormChange}
                                placeholder="-- Cari atau Pilih Kelas --"
                                options={kelasList.length > 0 ? kelasList.map(k => ({ label: k.nama_kelas, value: k.nama_kelas })) : [
                                    { label: "X RPL 1", value: "X RPL 1" },
                                    { label: "X RPL 2", value: "X RPL 2" },
                                    { label: "XI TKJ 1", value: "XI TKJ 1" },
                                    { label: "XI TKJ 2", value: "XI TKJ 2" },
                                    { label: "XII MM 1", value: "XII MM 1" },
                                    { label: "XII MM 2", value: "XII MM 2" },
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Pilih Siswa (Berdasarkan NIS)</label>
                            <SearchableSelect
                                name="siswa"
                                value={siswa}
                                onChange={handleFormChange}
                                placeholder={kelas ? "-- Cari atau Pilih Siswa --" : "Pilih kelas terlebih dahulu"}
                                disabled={!kelas}
                                options={filteredSiswaOptions}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                        <label className="text-sm font-medium text-neutral-700">Jenis Surat</label>
                        <SearchableSelect
                            name="jenisSurat"
                            value={jenisSurat}
                            onChange={handleFormChange}
                            placeholder="Pilih Jenis Surat"
                            options={[
                                { label: "Surat Panggilan Orang Tua", value: "Surat Panggilan Orang Tua" },
                                { label: "Surat Peringatan 1 (SP 1)", value: "SP1" },
                                { label: "Surat Peringatan 2 (SP 2)", value: "SP2" },
                                { label: "Surat Peringatan 3 (SP 3)", value: "SP3" },
                            ]}
                        />
                    </div>

                    {/* Preview or Information Card */}
                    {siswa && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-4"
                        >
                            <h4 className="font-semibold text-blue-900 text-sm mb-2">Ringkasan Surat:</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p><strong>Jenis Surat:</strong> {jenisSurat || "-"}</p>
                                <p><strong>Kelas:</strong> {kelas}</p>
                                <p><strong>Siswa Penerima:</strong> {siswaLengkap.find(s => s.id.toString() === siswa)?.nama} ({siswaLengkap.find(s => s.id.toString() === siswa)?.nis})</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3 shrink-0 rounded-b-xl">
                    <button
                        onClick={handleCetak}
                        className="cursor-pointer px-6 py-2.5 flex items-center gap-2 text-sm font-medium text-white bg-[#151829] hover:bg-[#1e2238] rounded-lg transition-colors shadow-sm"
                    >
                        <IconPrinter className="h-4 w-4" />
                        Cetak Surat Sekarang
                    </button>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={cn(
                            "fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md",
                            notification.type === "success"
                                ? "bg-green-500/90 text-white border-green-600/50"
                                : "bg-red-500/90 text-white border-red-600/50"
                        )}
                    >
                        {notification.type === "success" ? <IconCheck className="h-5 w-5" /> : <IconAlertCircle className="h-5 w-5" />}
                        <span className="text-sm font-semibold tracking-wide">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}

export default AdminCetakSurat;
