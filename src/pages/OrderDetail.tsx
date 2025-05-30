import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Layout, Typography, Descriptions, Image, Button, Spin, message } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const { Header, Content } = Layout;
const { Title } = Typography;

const OrderDetail: React.FC = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState<any>(state || null);
    const [loading, setLoading] = useState(!state);
    const [shipName, setShipName] = useState('');
    const [workshopName, setWorkshopName] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    //Lấy dữ liệu 
    useEffect(() => {
        const fetchOrder = async () => {
            if (!state && id) { /*Chưa có state truyền*/
                try {
                    setLoading(true);
                    const orderRef = doc(db, 'repairOrder', id);
                    const orderSnap = await getDoc(orderRef);
                    if (orderSnap.exists()) {
                        const data = orderSnap.data();
                        setOrderData({
                            id,
                            ...data,
                            createdAt: data?.StartDate?.toDate().toLocaleDateString('vi-VN'),
                        });
                    } else {
                        message.error('Không tìm thấy đơn hàng.');
                        navigate('/');
                    }
                } catch (error) {
                    message.error('Lỗi tải đơn hàng.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrder();
    }, [state, id, navigate]);

    useEffect(() => {
        const fetchNames = async () => {
            if (!orderData) return;

            try {
                console.log(orderData);
                const [shipSnap, workshopSnap, employeeSnap] = await Promise.all([
                    getDoc(doc(db, 'ship', orderData.shipId)),
                    getDoc(doc(db, 'workShop', orderData.workshopId)),
                    getDoc(doc(db, 'employees', orderData.inspectorId)),
                ]);

                setShipName(shipSnap.exists() ? shipSnap.data().name : 'Không xác định');
                setWorkshopName(workshopSnap.exists() ? workshopSnap.data().name : 'Không xác định');
                setEmployeeName(employeeSnap.exists() ? employeeSnap.data().fullName : orderData.inspectorId);
            } catch (error) {
                console.error('Lỗi lấy tên:', error);
            }
        };

        fetchNames();
    }, [orderData]);

    if (loading || !orderData) {
        return <div className="p-6"><Spin /> Đang tải dữ liệu...</div>;
    }

    const {
        createdAt,
        Status,
        invoiceId,
        totalCostId,
        imageList = {},
    } = orderData;

    return (
        <Layout className="min-h-screen bg-gray-100">
            <Header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <Title level={3} className="m-0">Chi tiết đơn sửa chữa</Title>
                <Button onClick={() => navigate(-1)}>Quay lại</Button>
            </Header>

            <Content className="m-6 p-6 bg-white rounded-lg shadow">
                <Descriptions title="Thông tin đơn" bordered column={1}>
                    <Descriptions.Item label="Mã đơn">{id}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{createdAt}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{Status}</Descriptions.Item>
                    <Descriptions.Item label="Tàu">{shipName}</Descriptions.Item>
                    <Descriptions.Item label="Cán bộ giám định">{employeeName}</Descriptions.Item>
                    <Descriptions.Item label="Xưởng">{workshopName}</Descriptions.Item>
                    <Descriptions.Item label="Hóa đơn">{invoiceId}</Descriptions.Item>
                    <Descriptions.Item label="Tổng chi phí">{totalCostId.toLocaleString()} VND</Descriptions.Item>
                </Descriptions>

                <div className="mt-6">
                    <Title level={4}>Hình ảnh</Title>
                    <div className="flex gap-4 flex-wrap">
                        {Object.values(imageList as { [key: string]: string }).map((url, index) => (
                            <Image key={index} width={200} src={url} alt={`img-${index}`} />
                        ))}
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default OrderDetail;
