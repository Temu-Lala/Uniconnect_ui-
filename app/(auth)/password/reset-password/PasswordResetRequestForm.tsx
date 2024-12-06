'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


const PasswordResetRequestForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();



  useEffect(() => {
    const fetchCsrfToken = () => {
      const token = Cookies.get('csrftoken');
      setCsrfToken(token || null);
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async () => {
    try {
      
      await axios.post(
        'http://127.0.0.1:8000/api/password_reset/',
        { email },
        {
          headers: {
            'X-CSRFToken': csrfToken || '', // Include the CSRF token in the request headers
            'Content-Type': 'application/json',
          },
        }
      );
      notification.success({
        message: 'Password Reset',
        description: 'Password reset link has been sent to your email.',
      });
      router.push('reset-password/PasswordResetDone');
    } catch (error) {
      console.error('Error:', error); // Debugging log
      notification.error({
        message: 'Error',
        description: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <h1 style={{ textAlign: 'center', paddingBottom: '20px' }}>Reset Password</h1>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default PasswordResetRequestForm;


