import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Typography, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const { Header, Content } = Layout;
const { Title } = Typography;

const mockOrders = [
    {
        id: 'D001',
        createdAt: '2025-05-28',
        status: 'Đang xử lý',
        lastUpdate: '2025-05-29',
    },
    {
        id: 'D002',
        createdAt: '2025-05-20',
        status: 'Hoàn thành',
        lastUpdate: '2025-05-25',
    },
];

const CustomerHome: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>(''); // để lưu fullName lấy từ Firestore
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = sessionStorage.getItem('uid');
                if (!uid) {
                    navigate('/login');
                    return;
                }
                console.log(uid);

                const customersRef = collection(db, 'customers');
                const q = query(customersRef, where('uid', '==', uid));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setUserName('Khách hàng');
                } else {
                    const customerData = querySnapshot.docs[0].data();
                    setUserName(customerData.fullName || 'Khách hàng');
                }
            } catch (error) {
                console.error('Lỗi lấy thông tin khách hàng:', error);
                setUserName('Khách hàng');
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'text-blue-600';
                if (status === 'Hoàn thành') color = 'text-green-600 font-semibold';
                else if (status === 'Đang xử lý') color = 'text-yellow-600 font-semibold';
                return <span className={color}>{status}</span>;
            },
        },
        {
            title: 'Cập nhật cuối',
            dataIndex: 'lastUpdate',
            key: 'lastUpdate',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    onClick={() => alert(`Xem chi tiết đơn ${record.id}`)}
                    className="!p-0 !text-blue-600 hover:underline"
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen bg-gray-100">
            <Header className="bg-white shadow-md flex justify-between items-center px-6 py-4">
                <Title level={3} className="flex items-center gap-3 select-none" style={{ marginBottom: 0 }}>
                    Ship <span className="text-blue-600">Master</span>
                </Title>
                <div className="flex items-center gap-3 select-none text-xl font-bold">
                    <Avatar icon={<UserOutlined />} />
                    {loadingUser ? <Spin size="small" /> : <span>{userName}</span>}
                </div>
            </Header>

            <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
                <Button
                    type="primary"
                    size="large"
                    className="mb-5 bg-blue-600 hover:bg-blue-700 border-none"
                    onClick={() => navigate('/create')}
                >
                    Tạo đơn sửa chữa mới
                </Button>
                <Title level={4}>Danh sách đơn sửa chữa</Title>
                <Table
                    columns={columns}
                    dataSource={mockOrders}
                    rowKey="id"
                    pagination={false}
                    bordered
                    className="shadow-sm"
                />
            </Content>
        </Layout>
    );
};

export default CustomerHome;
