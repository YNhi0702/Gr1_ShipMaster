import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [isOfficer, setIsOfficer] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            sessionStorage.setItem('uid', user.uid);
            // Lấy thông tin role từ Firestore
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                message.error('Không tìm thấy thông tin người dùng.');
                setLoading(false);
                return;
            }

            const userData = docSnap.data();
            const role = userData?.role || 'customer';

            message.success(`Đăng nhập thành công ${role === 'customer' ? '(Khách hàng)' : '(Cán bộ)'}`);

            // Điều hướng theo role
            if (role === 'customer') {
                navigate('/');
            } else {
                navigate('/officer');   // hoặc trang dashboard của cán bộ
            }
        } catch (error: any) {
            message.error("Đăng nhập thất bại: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={'container-login'}>
            <div className={'card'}>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 400, margin: 'auto', marginTop: '10%' }}
                >
                    <h2>Đăng nhập</h2>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked={isOfficer} onChange={e => setIsOfficer(e.target.checked)}>
                            Tôi là cán bộ
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
