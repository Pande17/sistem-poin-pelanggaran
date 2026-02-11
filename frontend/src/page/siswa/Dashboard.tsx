import { useState, useEffect } from 'react';
import { Breadcrumb, Modal, Button, Spin, Descriptions, Col, Row, Dropdown, Space} from 'antd';
import type { DescriptionsProps, MenuProps } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '@/utils/auth';
import { LoadingOutlined } from '@ant-design/icons';

function SiswaDashboard() {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token')

                const res = await fetch('http://localhost:8000/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    throw new Error('Gagal mengambil data user')
                }

                const data = await res.json()
                setUser(data.data)
            } catch (error) {
                console.error(error)
                logout()
                navigate('/', { replace: true })
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            });
        }catch (error) {
            console.error('Logout failed:', error);
        }finally {
            logout()
            navigate('/', { replace: true });
        }
    }

    const ItemBreadcum = [
        {
            title: 'Dashboard'
        },
        // {
        //     title: 'Dashboard',
        //     href: ''
        // },
    ]

    const ShowModal = () => {
        setIsPopupOpen(true);
    }

    const CloseModal = () => {
        setIsPopupOpen(false);
    }

    const ModalOK = () => {
        setIsPopupOpen(false);
        handleLogout()
    }

    const ListData : DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'NIS',
            children: user?.nis || <Spin indicator={<LoadingOutlined spin />} size="small" />
        },
        {
            key: '2',
            label: 'Email',
            children: user?.email || <Spin indicator={<LoadingOutlined spin />} size="small" />,
        }, 
        {
            key: '3',
            label: 'Jenis Kelamin',
            children: user ? (user.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan') : (<Spin indicator={<LoadingOutlined spin />} size="small" />)
        },
        {
            key: '4',
            label: 'No Telp',
            children: user?.no_telp || <Spin indicator={<LoadingOutlined spin />} size="small" />
        },
        {
            key: '5',
            label: 'Kelas',
            children: user?.kelas || <Spin indicator={<LoadingOutlined spin />} size="small" />
        },
        // {
        //     key: '6',
        //     label: 'Poin Pelanggaran',
        //     children: user?.poin || <Spin indicator={<LoadingOutlined spin />} size="small" />
        // },
    ]

    const NavbarItem : MenuProps['items'] = [
        {
            label: (
                <NavLink to="/siswa/dashboard">
                    Dashboard
                </NavLink>
            ),
            key: '0',
        },
        {
            label: (
                <NavLink to="/siswa/datadiri">
                    Data Diri
                </NavLink>
            ),
            key : '1',
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm px-10 py-4 md:px-20 lg:px-32">
                <div className="flex items-center justify-between">
                    {/* Center Section - Logo */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <img src="https://smkti-baliglobal.sch.id/gambar/icon.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>

                    {/* Left Section - Hamburger Menu (Mobile) */}
                    <div className='md:hidden cursor-pointer'>
                        <Dropdown menu={{ items: NavbarItem }} trigger={['click']} >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </Space>
                            </a>
                        </Dropdown>
                    </div>

                    {/* Center Section - Navigation (Desktop) */}
                    <nav className="hidden md:flex gap-8 text-gray-700 font-semibold">
                        <NavLink to="/siswa/dashboard" className="hover:text-blue-500 transition">Dashboard</NavLink>
                        <NavLink to="/siswa/datadiri" className="hover:text-blue-500 transition">Data Diri</NavLink>
                    </nav>

                    {/* Right Section - Notification Button */}
                    <button className="p-2 hidden lg:block hover:bg-gray-100 rounded-lg transition">
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-10 py-5 md:px-20 lg:px-32">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    {/* Breadcrumb */}
                    <Breadcrumb
                        separator="/"
                        items={ItemBreadcum}
                    />

                    {/* Page Title */}
                    <p className="text-lg md:text-lg font-semibold text-gray-800">Yuk Lihat Pelanggaranmu</p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 h-fit">
                    {/* Card Left */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-100 h-fit overflow-hidden">

                        {/* HEADER */}
                        <div className="flex items-center gap-4 p-6 border-b">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                                <span className="text-lg font-semibold text-white">
                                    {user?.nama?.slice(0, 2).toUpperCase()}
                                </span>
                            </div>

                            {/* Identity */}
                            <div>
                                {loading ? (
                                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                                ) : (
                                    <>
                                        <p className="font-semibold text-gray-900 leading-tight">
                                            {user?.nama}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            {user?.kelas}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-6 text-sm text-gray-700">
                            {loading ? (
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {ListData.map((item) => (
                                        <Col key={item.key} span={12}>
                                            <div className="rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
                                                <Descriptions layout="vertical" items={[item]} />
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 pb-6">
                            <Button
                                onClick={ShowModal}
                                variant="outlined"
                                color="danger"
                                className="
                                    h-10 w-full rounded-xl
                                    flex items-center justify-center
                                    border border-red-500
                                    text-red-600 font-medium
                                    hover:bg-red-50
                                    transition
                                "
                            >
                                Logout
                            </Button>

                            <Modal
                                title="Konfirmasi Logout"
                                open={isPopupOpen}
                                onOk={ModalOK}
                                onCancel={CloseModal}
                            >
                                <p>Apakah Anda yakin ingin logout?</p>
                            </Modal>
                        </div>

                    </div>

                    {/* Card Right */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                        <div className="py-3 px-6 font-semibold text-gray-800">
                            Data Pelanggaran Siswa
                        </div>
                        <div className="bg-gray-300 h-64 md:h-103 overflow-y-auto">
                            {/* Content will go here */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SiswaDashboard;  