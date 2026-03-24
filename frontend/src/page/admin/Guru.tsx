import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { IconEdit, IconTrash, IconX, IconChevronDown, IconAlertCircle, IconInbox, IconLoader2, IconCheck, IconInfoCircle, IconTrashX, IconSearch, IconFilter, IconArrowsSort } from "@tabler/icons-react";
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
                <span className={cn("truncate pr-2 block w-full", selected ? "text-neutral-800" : "text-neutral-400")}>
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
                            className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-xl shadow-xl overflow-hidden"
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


interface GuruRecord {
    id: number;
    username: string;
    nama: string;
    kode_guru: string;
    email: string;
    jenis_kelamin: string;
    role: string;
}

export function AdminGuru() {
    const [data, setData] = useState<GuruRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    // Filter and Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [sortOrder, setSortOrder] = useState(""); // "" | "asc" | "desc"

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "filterRole") setFilterRole(value);
        if (name === "filterGender") setFilterGender(value);
        if (name === "sortOrder") setSortOrder(value);
    };

    // Form state
    const initialFormState = {
        id: 0,
        username: "",
        password: "",
        nama: "",
        kode_guru: "",
        email: "",
        jenis_kelamin: "",
        role: ""
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

    const openModal = (mode: "add" | "edit", guru?: GuruRecord) => {
        setModalMode(mode);
        if (mode === "edit" && guru) {
            let formattedKode = guru.kode_guru || "";
            if (formattedKode && !formattedKode.startsWith("0021.")) {
                formattedKode = `0021.${formattedKode}`;
            }
            setFormData({ ...guru, kode_guru: formattedKode, password: "" }); // Reset password field for edit
        } else {
            // Set initial kode_guru explicitly to 0021. prefix
            setFormData({ ...initialFormState, kode_guru: "0021." });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { ...formData };
        if (modalMode === "add" && !payload.password) {
            showNotification("error", "Password is required for new Guru");
            return;
        }

        // Validasi format kode_guru
        if (!/^0021\.\d{3}$/.test(payload.kode_guru)) {
            showNotification("error", "Kode Guru tidak valid, harus 3 angka lengkap (contoh: 0021.123)!");
            return;
        }

        const isEdit = modalMode === "edit";
        const normalizeKode = (k: string) => k?.startsWith("0021.") ? k : `0021.${k}`;

        // Cek duplicate kode_guru lokal
        const isKodeGuruTaken = data.some((item) => normalizeKode(item.kode_guru) === payload.kode_guru && (isEdit ? item.id !== payload.id : true));
        if (isKodeGuruTaken) {
            showNotification("error", `Kode Guru ${payload.kode_guru} sudah digunakan oleh guru lain!`);
            return;
        }

        // Cek duplicate kepala sekolah lokal
        if (payload.role === "kepala sekolah") {
            const isKepsekTaken = data.some((item) => item.role === "kepala sekolah" && (isEdit ? item.id !== payload.id : true));
            if (isKepsekTaken) {
                showNotification("error", "Jabatan Kepala Sekolah hanya boleh satu orang!");
                return;
            }
        }

        if (!payload.jenis_kelamin || !payload.role) {
            showNotification("error", "Mohon pilih Jenis Kelamin dan Role!");
            return;
        }

        setSaveConfirm(true);
    };

    const executeSave = async () => {
        setSaveConfirm(false);
        setFormLoading(true);

        try {
            const token = localStorage.getItem("token") || "";
            const url = "http://localhost:8000/api/guru";
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
                fetchGuru();
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

    const fetchGuru = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/guru", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (response.ok && result.data) {
                // Ensure data is array before setting
                if (Array.isArray(result.data)) {
                    // filter out deleted records if logical delete is used
                    const activeRecords = result.data.filter((r: any) => !r.deleted_at);
                    setData(activeRecords);
                } else {
                    setData([]);
                }
            } else {
                setError(result.message || "Gagal mengambil data Guru");
            }
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan pada server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            const response = await fetch("http://localhost:8000/api/guru", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: idToDelete })
            });
            const result = await response.json();

            if (response.ok) {
                fetchGuru();
                showNotification("success", "Data Berhasil Dihapus!");
            } else {
                showNotification("error", result.message || "Gagal menghapus data guru");
            }
        } catch (error: any) {
            showNotification("error", error.message || "Terjadi kesalahan");
        }
    };

    const filteredData = data.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.kode_guru && item.kode_guru.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchRole = filterRole ? item.role === filterRole : true;
        const matchGender = filterGender ? item.jenis_kelamin === filterGender : true;
        return matchSearch && matchRole && matchGender;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortOrder) return 0;
        const kodeA = a.kode_guru || "";
        const kodeB = b.kode_guru || "";

        if (sortOrder === "asc") {
            return kodeA.localeCompare(kodeB);
        } else {
            return kodeB.localeCompare(kodeA);
        }
    });

    return (
        <AdminLayout title="Data Guru">
            <div className="flex flex-col flex-1 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-semibold text-neutral-800">Daftar Guru</h2>
                    <button
                        onClick={() => openModal("add")}
                        className="cursor-pointer bg-[#151829] hover:bg-[#1e2238] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Tambah Guru
                    </button>
                </div>

                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center w-full">
                        {/* Grup Filter (Kiri) */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
                            {/* Sort Code */}
                            <div className="relative w-full sm:w-[190px]">
                                <IconArrowsSort className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
                                <div className="pl-7">
                                    <CustomSelect
                                        name="sortOrder"
                                        value={sortOrder}
                                        onChange={handleFilterChange}
                                        placeholder="Urutkan"
                                        options={[
                                            { label: "Urutkan (Default)", value: "" },
                                            { label: "Kode: Terendah", value: "asc" },
                                            { label: "Kode: Tertinggi", value: "desc" }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Filter Role */}
                            <div className="relative w-full sm:w-[190px]">
                                <IconFilter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
                                <div className="pl-7">
                                    <CustomSelect
                                        name="filterRole"
                                        value={filterRole}
                                        onChange={handleFilterChange}
                                        placeholder="Semua Role"
                                        options={[
                                            { label: "Semua Role", value: "" },
                                            { label: "Admin", value: "admin" },
                                            { label: "Kepala Sekolah", value: "kepala sekolah" },
                                            { label: "Wakasek", value: "wakasek" },
                                            { label: "Guru Mapel", value: "guru mapel" }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Filter Gender */}
                            <div className="relative w-full sm:w-[170px]">
                                <IconFilter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
                                <div className="pl-7">
                                    <CustomSelect
                                        name="filterGender"
                                        value={filterGender}
                                        onChange={handleFilterChange}
                                        placeholder="Semua Gender"
                                        options={[
                                            { label: "Semua Gender", value: "" },
                                            { label: "Laki-Laki", value: "L" },
                                            { label: "Perempuan", value: "P" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Grup Search (Kanan) */}
                        <div className="relative w-full lg:max-w-xs group">
                            <IconSearch className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari Guru..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-sm border-b border-neutral-100">
                                <th className="px-6 py-4 font-medium">No</th>
                                <th className="px-6 py-4 font-medium">Kode Guru</th>
                                <th className="px-6 py-4 font-medium">Nama</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Jenis Kelamin</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-neutral-700 divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center h-48">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconLoader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                            <p className="text-neutral-500 font-medium">Memuat data guru...</p>
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
                            ) : sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center h-64 bg-neutral-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-white rounded-full shadow-sm border border-neutral-100">
                                                <IconInbox className="h-12 w-12 text-neutral-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-neutral-800 font-semibold text-lg">Tidak ada data ditemukan</h3>
                                                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                                                    Data guru tidak tersedia atau tidak ada yang cocok dengan pencarian dan filter Anda.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-neutral-900">
                                            {item.kode_guru?.startsWith('0021.') ? item.kode_guru : (item.kode_guru ? `0021.${item.kode_guru}` : '-')}
                                        </td>
                                        <td className="px-6 py-4">{item.nama}</td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">
                                            {item.jenis_kelamin === 'L' ? 'Laki-Laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-600">
                                            {item.role ? item.role.toUpperCase() : '-'}
                                        </td>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                            <h3 className="text-lg font-semibold text-neutral-800">
                                {modalMode === "add" ? "Tambah Data Guru" : "Edit Data Guru"}
                            </h3>
                            <button onClick={closeModal} className="cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors">
                                <IconX className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-neutral-700">Kode Guru</label>
                                <div className={cn(
                                    "flex flex-row items-stretch border rounded-lg overflow-hidden transition-all text-sm",
                                    modalMode === "edit" ? "bg-neutral-100 border-neutral-200" : "bg-white border-neutral-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
                                )}>
                                    <div className="flex items-center justify-center px-3 bg-neutral-100 text-neutral-600 border-r border-neutral-200 select-none">
                                        0021.
                                    </div>
                                    <input
                                        type="text"
                                        name="kode_guru"
                                        value={formData.kode_guru?.replace(/^0021\./, '') || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setFormData((prev: any) => ({ ...prev, kode_guru: `0021.${val}` }));
                                        }}
                                        required
                                        placeholder="001"
                                        maxLength={3}
                                        readOnly={modalMode === "edit"}
                                        className={cn(
                                            "w-full px-3 py-2 outline-none",
                                            modalMode === "edit" ? "bg-neutral-100 text-neutral-500 cursor-not-allowed" : "bg-transparent text-neutral-800"
                                        )}
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 mt-1">Masukkan 3 angka (contoh: untuk input 001 maka hasil kode adalah 0021.001)</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-neutral-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Jenis Kelamin</label>
                                    <CustomSelect
                                        name="jenis_kelamin"
                                        value={formData.jenis_kelamin}
                                        onChange={handleFormChange}
                                        placeholder="Pilih Jenis Kelamin"
                                        options={[
                                            { label: "Laki-Laki", value: "L" },
                                            { label: "Perempuan", value: "P" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Role</label>
                                    <CustomSelect
                                        name="role"
                                        value={formData.role}
                                        onChange={handleFormChange}
                                        placeholder="Pilih Role"
                                        options={[
                                            { label: "Admin", value: "admin" },
                                            { label: "Kepala Sekolah", value: "kepala sekolah" },
                                            { label: "Wakasek", value: "wakasek" },
                                            { label: "Guru Mapel", value: "guru mapel" }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-neutral-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="example@sekolah.com"
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Username Login</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFormChange}
                                        required
                                        autoComplete="new-username"
                                        placeholder="Username"
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-neutral-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        required={modalMode === "add"}
                                        autoComplete="new-password"
                                        placeholder={modalMode === "edit" ? "Kosongkan jika tak diubah" : "Password"}
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-[#151829] hover:bg-[#1e2238] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {formLoading ? "Menyimpan..." : "Simpan Data"}
                                </button>
                            </div>
                        </form>
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

export default AdminGuru;
