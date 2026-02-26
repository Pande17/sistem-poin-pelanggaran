import AdminLayout from "@/layouts/AdminLayout";

export function AdminSiswa() {
    return (
        <AdminLayout title="Data Siswa">
            <div className="flex gap-4">
                {[...new Array(4)].map((idx) => (
                    <div
                        key={"first-array-demo-" + idx}
                        className="h-24 w-full animate-pulse rounded-xl bg-white shadow-sm border border-neutral-100"
                    ></div>
                ))}
            </div>
            <div className="flex flex-1 gap-4">
                {[...new Array(2)].map((idx) => (
                    <div
                        key={"second-array-demo-" + idx}
                        className="h-full w-full animate-pulse rounded-xl bg-white border border-neutral-100 shadow-sm"
                    ></div>
                ))}
            </div>
        </AdminLayout>
    );
}

export default AdminSiswa;
