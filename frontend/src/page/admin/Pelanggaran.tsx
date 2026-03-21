import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { IconEdit, IconTrash, IconX, IconChevronDown, IconAlertCircle, IconInbox, IconLoader2, IconCheck, IconInfoCircle, IconTrashX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

function CustomSelect({ value, onChange, options, placeholder, name }: { value: string, onChange: (e: any) => void, options: { label: string, value: string }[], placeholder: string, name: string }) {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);

    return (
        <div className="relative">
            <div
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
                <span className={selected ? "text-neutral-800" : "text-neutral-400"}>
                    {selected ? selected.label : placeholder}
                </span>
                <IconChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform duration-200", open && "rotate-180")} />
            </div>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-neutral-100 rounded-xl shadow-xl"
                        >
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange({ target: { name, value: opt.value } });
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "px-4 py-2.5 text-sm cursor-pointer transition-colors",
                                        value === opt.value ? "bg-blue-50 text-blue-700 font-medium" : "text-neutral-700 hover:bg-neutral-50"
                                    )}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

interface PelanggaranRecord {
    id: number;
    created_at: string;
    nama_siswa: string;
    kelas: string;
    nama_pelanggaran: string;
    keterangan: string;
    poin: number;
    id_siswa: number | string;
    id_jenis_pelanggaran: number | string;
}

export function AdminPelanggaran() {
    const [data, setData] = useState<PelanggaranRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    const [siswaOptions, setSiswaOptions] = useState<any[]>([]);
    const [kelasOptions, setKelasOptions] = useState<any[]>([]);
    const [jenisOptions, setJenisOptions] = useState<any[]>([]);

    // Form state
    const initialFormState = {
        id: 0,
        kelas: "",
        id_siswa: "",
        id_jenis_pelanggaran: "",
        keterangan: ""
    };
    const [formData, setFormData] = useState<any>(initialFormState);
    const [formLoading, setFormLoading] = useState(false);

    // Dialog & Toaster states
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [saveConfirm, setSaveConfirm] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean, type: "success" | "error", message: string }>({ show: false, type: "success", message: "" });

    const showNotification = (type: "success" | "error", message: string) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    };

    const openModal = (mode: "add" | "edit", item?: PelanggaranRecord) => {
        setModalMode(mode);
        if (mode === "edit" && item) {
            setFormData({
                id: item.id,
                kelas: item.kelas || "",
                id_siswa: item.id_siswa?.toString() || "",
                id_jenis_pelanggaran: item.id_jenis_pelanggaran?.toString() || "",
                keterangan: item.keterangan || ""
            });
        } else {
            setFormData({ ...initialFormState });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id_siswa || !formData.id_jenis_pelanggaran) {
            showNotification("error", "Mohon pilih Nama Siswa dan Jenis Pelanggaran!");
            return;
        }

        setSaveConfirm(true);
    };

    const executeSave = async () => {
        setSaveConfirm(false);
        setFormLoading(true);

        try {
            const token = localStorage.getItem("token") || "";
            const url = "http://localhost:8000/api/pelanggaran";
            const method = modalMode === "add" ? "POST" : "PUT";

            const payload = { ...formData };

            const selectedJenis = jenisOptions.find(opt => opt.value === payload.id_jenis_pelanggaran);
            if (selectedJenis) {
                payload.poin = selectedJenis.poin;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                closeModal();
                fetchData();
                showNotification("success", `Data berhasil ${modalMode === "add" ? "ditambahkan" : "diedit"}!`);
            } else {
                showNotification("error", result.message || `Gagal ${modalMode === "add" ? "menambahkan" : "mengupdate"} data`);
            }
        } catch (err: any) {
            showNotification("error", err.message || "Terjadi kesalahan koneksi");
        } finally {
            setFormLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

            const [siswaRes, jenisRes] = await Promise.all([
                fetch("http://localhost:8000/api/siswa", { headers }),
                fetch("http://localhost:8000/api/jenis-pelanggaran", { headers })
            ]);

            const siswaData = await siswaRes.json();
            const jenisData = await jenisRes.json();

            if (siswaRes.ok && Array.isArray(siswaData.data)) {
                const sData = siswaData.data.map((s: any) => ({ label: `${s.nama} - ${s.kelas}`, value: s.id.toString(), kelas: s.kelas }));
                setSiswaOptions(sData);

                const uniqueKelas = Array.from(new Set(sData.map((s: any) => s.kelas))).filter(Boolean).sort();
                setKelasOptions(uniqueKelas.map(k => ({ label: k as string, value: k as string })));
            }
            if (jenisRes.ok && Array.isArray(jenisData.data)) {
                setJenisOptions(jenisData.data.map((j: any) => ({ label: `${j.nama_pelanggaran} - Poin ${j.poin}`, value: j.id.toString(), poin: j.poin })));
            }
        } catch (err) {
            console.error("Gagal mengambil opsi:", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/pelanggaran", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (response.ok && result.data) {
                if (Array.isArray(result.data)) {
                    const activeRecords = result.data.filter((r: any) => !r.deleted_at);
                    setData(activeRecords);
                } else {
                    setData([]);
                }
            } else {
                setError(result.message || "Gagal mengambil data Pelanggaran");
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan pada server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
        fetchData();
    }, []);

    const handleDelete = (id: number) => {
        setDeleteConfirmId(id);
    };

    const executeDelete = async () => {
        if (deleteConfirmId === null) return;
        const idToDelete = deleteConfirmId;
        setDeleteConfirmId(null);

        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/pelanggaran", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: idToDelete })
            });
            const result = await response.json();

            if (response.ok) {
                fetchData();
                showNotification("success", "Data Berhasil Dihapus!");
            } else {
                showNotification("error", result.message || "Gagal menghapus data");
            }
        } catch (error: any) {
            showNotification("error", error.message || "Terjadi kesalahan");
        }
    };

    return (
        <AdminLayout title="Daftar Pelanggaran">
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-semibold text-neutral-800">Daftar Pelanggaran Siswa</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="cursor-pointer bg-[#151829] hover:bg-[#1e2238] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Tambah Pelanggaran
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-sm border-b border-neutral-100">
                                <th className="px-6 py-4 font-medium whitespace-nowrap">No</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Tanggal</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Nama Siswa</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Kelas</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Jenis Pelanggaran</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Poin</th>
                                <th className="px-6 py-4 font-medium text-center whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-neutral-700 divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center h-48">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconLoader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                            <p className="text-neutral-500 font-medium">Memuat data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center h-48 bg-red-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconAlertCircle className="h-10 w-10 text-red-500" />
                                            <p className="text-red-600 font-medium">{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center h-64 bg-neutral-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-white rounded-full shadow-sm border border-neutral-100">
                                                <IconInbox className="h-12 w-12 text-neutral-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-neutral-800 font-semibold text-lg">Belum ada riwayat pelanggaran</h3>
                                                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                                                    Klik tombol "Catat Pelanggaran" di sudut kanan atas untuk mulai menginput pelanggaran terhadap siswa.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-neutral-500">{item.created_at ? item.created_at.slice(0, 10) : '-'}</td>
                                        <td className="px-6 py-4 font-medium text-neutral-900">{item.nama_siswa}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-neutral-500">{item.kelas}</td>
                                        <td className="px-6 py-4 text-neutral-800 max-w-xs truncate" title={item.nama_pelanggaran}>{item.nama_pelanggaran}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600 text-center">+{item.poin}</td>
                                        <td className="px-6 py-4 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openModal("edit", item)}
                                                className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <IconEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Popup for Add / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mb-8 animate-in fade-in zoom-in duration-200 flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50 shrink-0 rounded-t-2xl">
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {modalMode === "add" ? "Input Catatan Pelanggaran" : "Edit Catatan Pelanggaran"}
                            </h3>
                            <button type="button" onClick={closeModal} className="cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors">
                                <IconX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-visible">
                            <form id="pelanggaranForm" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-neutral-700">Pilih Kelas</label>
                                        <CustomSelect
                                            name="kelas"
                                            value={formData.kelas}
                                            onChange={(e) => {
                                                handleFormChange(e);
                                                setFormData((prev: any) => ({ ...prev, id_siswa: "" }));
                                            }}
                                            placeholder="Pilih Kelas..."
                                            options={kelasOptions}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-neutral-700">Nama Siswa</label>
                                        <CustomSelect
                                            name="id_siswa"
                                            value={formData.id_siswa}
                                            onChange={handleFormChange}
                                            placeholder={formData.kelas ? "Pilih Siswa..." : "Pilih Kelas Dulu"}
                                            options={formData.kelas ? siswaOptions.filter(s => s.kelas === formData.kelas) : []}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Jenis Pelanggaran</label>
                                    <CustomSelect
                                        name="id_jenis_pelanggaran"
                                        value={formData.id_jenis_pelanggaran}
                                        onChange={handleFormChange}
                                        placeholder="Pilih Pelanggaran..."
                                        options={jenisOptions}
                                    />
                                </div>

                                <div className="space-y-1 border-t border-neutral-100 pt-3 mt-1">
                                    <label className="text-sm font-medium text-neutral-700">Keterangan Tambahan <span className="text-neutral-400 font-normal">(Opsional)</span></label>
                                    <textarea
                                        name="keterangan"
                                        value={formData.keterangan || ""}
                                        onChange={handleFormChange}
                                        rows={3}
                                        placeholder="Keterangan detail pelanggaran (Jika kosong, akan otomatis disamakan dengan jenis pelanggaran)"
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                            </form>
                        </div>

                        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="pelanggaranForm"
                                disabled={formLoading}
                                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-[#151829] hover:bg-[#1e2238] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            >
                                {formLoading ? "Menyimpan..." : "Simpan Data"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId !== null && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center mx-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <IconTrashX className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Konfirmasi Hapus</h3>
                            <p className="text-neutral-500 text-sm mb-6">Anda Yakin Ingin Menghapus Data ini?</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                                >
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Save Confirmation Modal */}
            <AnimatePresence>
                {saveConfirm && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center mx-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <IconInfoCircle className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">Konfirmasi Simpan</h3>
                            <p className="text-neutral-500 text-sm mb-6">Anda Yakin Ingin Menyimpan Data ini?</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSaveConfirm(false)}
                                    className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeSave}
                                    className="cursor-pointer flex-1 py-2.5 text-sm font-medium text-white bg-[#151829] hover:bg-[#1e2238] rounded-xl transition-colors shadow-sm"
                                >
                                    Simpan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}

export default AdminPelanggaran;