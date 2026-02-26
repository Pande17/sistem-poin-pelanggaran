import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { IconEdit, IconTrash, IconX, IconChevronDown, IconAlertCircle, IconInbox, IconLoader2 } from "@tabler/icons-react";
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

    const openModal = (mode: "add" | "edit", guru?: GuruRecord) => {
        setModalMode(mode);
        if (mode === "edit" && guru) {
            setFormData({ ...guru, password: "" }); // Reset password field for edit
        } else {
            // Generate a random code for guru (e.g. GURU-XXXX) as default layout
            // or let the user type one since DB seems to need it from frontend
            const randomCode = `GURU-${Math.floor(1000 + Math.random() * 9000)}`;
            setFormData({ ...initialFormState, kode_guru: randomCode });
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
        setFormLoading(true);

        try {
            const token = localStorage.getItem("token") || "";
            const url = "http://localhost:8000/api/guru";
            const method = modalMode === "add" ? "POST" : "PUT";

            const payload = { ...formData };
            if (modalMode === "add" && !payload.password) {
                alert("Password is required for new Guru");
                setFormLoading(false);
                return;
            }
            if (!payload.jenis_kelamin || !payload.role) {
                alert("Mohon pilih Jenis Kelamin dan Role!");
                setFormLoading(false);
                return;
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
                fetchGuru();
            } else {
                alert(result.message || `Gagal ${modalMode === "add" ? "menambahkan" : "mengupdate"} data`);
            }
        } catch (err: any) {
            alert(err.message || "Terjadi kesalahan koneksi");
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

    const handleDelete = async (id: number) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) return;

        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch("http://localhost:8000/api/guru", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
            const result = await response.json();

            if (response.ok) {
                fetchGuru();
            } else {
                alert(result.message || "Gagal menghapus data guru");
            }
        } catch (error: any) {
            alert(error.message || "Terjadi kesalahan");
        }
    };

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

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-sm border-b border-neutral-100">
                                <th className="px-6 py-4 font-medium">No</th>
                                <th className="px-6 py-4 font-medium">Kode Guru</th>
                                <th className="px-6 py-4 font-medium">Nama</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Jenis Kelamin</th>
                                <th className="px-6 py-4 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-neutral-700 divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center h-48">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconLoader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                            <p className="text-neutral-500 font-medium">Memuat data guru...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center h-48 bg-red-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <IconAlertCircle className="h-10 w-10 text-red-500" />
                                            <p className="text-red-600 font-medium">{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center h-64 bg-neutral-50/50">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 bg-white rounded-full shadow-sm border border-neutral-100">
                                                <IconInbox className="h-12 w-12 text-neutral-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-neutral-800 font-semibold text-lg">Belum ada data guru</h3>
                                                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                                                    Klik tombol "Tambah Guru" di sudut kanan atas untuk mulai memasukkan data guru baru ke dalam sistem.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-neutral-900">{item.kode_guru}</td>
                                        <td className="px-6 py-4">{item.nama}</td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">
                                            {item.jenis_kelamin === 'L' ? 'Laki-Laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
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
                                <input
                                    type="text"
                                    name="kode_guru"
                                    value={formData.kode_guru}
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-500 text-sm outline-none"
                                    readOnly
                                />
                                <p className="text-xs text-neutral-400 mt-1">Kode digenerate otomatis</p>
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
                                            { label: "ADMIN", value: "admin" },
                                            { label: "BK", value: "bk" },
                                            { label: "GURU", value: "guru" }
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
        </AdminLayout>
    );
}

export default AdminGuru;
