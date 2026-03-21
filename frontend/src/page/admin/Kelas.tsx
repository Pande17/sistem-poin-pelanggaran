import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { IconEdit, IconTrash, IconX, IconAlertCircle, IconInbox, IconLoader2, IconCheck, IconInfoCircle, IconTrashX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface KelasRecord {
    id: number;
    tingkat: string;
    jurusan: string;
    kelas: string;
    wali_kelas: number | string;
    wali_kelas_nama: string;
    nama_kelas?: string;
}

export function AdminKelas() {
    const [data, setData] = useState<KelasRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    // Form state
    const initialFormState = {
        id: 0,
        tingkat: "",
        jurusan: "",
        kelas: "",
        wali_kelas: "",
    };
    const [guruData, setGuruData] = useState<any[]>([]);
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

    const openModal = (mode: "add" | "edit", kelas?: KelasRecord) => {
        setModalMode(mode);
        if (mode === "edit" && kelas) {
            setFormData({ ...kelas });
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
        setSaveConfirm(true);
    };

    const executeSave = async () => {
        setSaveConfirm(false);
        setFormLoading(true);

        try {
            const token = localStorage.getItem("token") || "";
            const url = "http://localhost:8000/api/kelas";
            const method = modalMode === "add" ? "POST" : "PUT";

            const payload = { ...formData };

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
                fetchKelas();
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

    const fetchKelas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/kelas", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                showNotification("error", result.message || "Gagal mengambil data kelas");
            }
        } catch (error) {
            showNotification("error", "Terjadi kesalahan koneksi");
        } finally {
            setLoading(false);
        }
    };

    const fetchGuru = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/guru", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setGuruData(result.data || []);
            }
        } catch (error) {
            console.error("Gagal mengambil data guru:", error);
        }
    };

    useEffect(() => {
        fetchKelas();
        fetchGuru();
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
            const response = await fetch("http://localhost:8000/api/kelas", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: idToDelete })
            });
            const result = await response.json();

            if (response.ok) {
                fetchKelas();
                showNotification("success", "Data Berhasil Dihapus!");
            } else {
                showNotification("error", result.message || "Gagal menghapus data kelas");
            }
        } catch (error: any) {
            showNotification("error", error.message || "Terjadi kesalahan");
        }
    };

    return (
        <AdminLayout title="Data Kelas">
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-semibold text-neutral-800">Daftar Kelas</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="cursor-pointer bg-[#151829] hover:bg-[#1e2238] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Tambah Kelas
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-sm border-b border-neutral-100">
                                <th className="px-6 py-4 font-medium whitespace-nowrap w-24">No</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Nama Kelas</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Wali Kelas</th>
                                <th className="px-6 py-4 font-medium text-center whitespace-nowrap w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-neutral-700 divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center h-48">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconLoader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                            <p className="text-neutral-500 font-medium">Memuat data kelas...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center h-48 bg-red-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconAlertCircle className="h-10 w-10 text-red-500" />
                                            <p className="text-red-600 font-medium">{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center h-64 bg-neutral-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-white rounded-full shadow-sm border border-neutral-100">
                                                <IconInbox className="h-12 w-12 text-neutral-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-neutral-800 font-semibold text-lg">Belum ada data kelas</h3>
                                                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                                                    Klik tombol "Tambah Kelas" di sudut kanan atas untuk mulai memasukkan data kelas baru ke dalam sistem.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{item.nama_kelas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.wali_kelas_nama || "-"}</td>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50 shrink-0">
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {modalMode === "add" ? "Tambah Data Kelas" : "Edit Data Kelas"}
                            </h3>
                            <button type="button" onClick={closeModal} className="cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors">
                                <IconX className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="kelasForm" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Tingkat</label>
                                    <select
                                        name="tingkat"
                                        value={formData.tingkat}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">Pilih Tingkat</option>
                                        <option value="X">X (10)</option>
                                        <option value="XI">XI (11)</option>
                                        <option value="XII">XII (12)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Jurusan</label>
                                    <input
                                        type="text"
                                        name="jurusan"
                                        value={formData.jurusan}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Misal: RPL"
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Kelas</label>
                                    <input
                                        type="text"
                                        name="kelas"
                                        value={formData.kelas}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Misal: 1"
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Wali Kelas</label>
                                    <select
                                        name="wali_kelas"
                                        value={formData.wali_kelas}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">-- Pilih Wali Kelas --</option>
                                        {guruData.map((guru) => (
                                            <option key={guru.id} value={guru.id}>{guru.nama}</option>
                                        ))}
                                    </select>
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
                                form="kelasForm"
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

export default AdminKelas;
