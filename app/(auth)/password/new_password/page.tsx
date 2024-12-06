'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const PasswordResetForm: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validParams, setValidParams] = useState(true);
  
  const uidb64 = searchParams.get('uidb64');
  const token = searchParams.get('token');


 
  useEffect(() => {
    if (!uidb64 || !token) {
      notification.error({
        message: 'Error',
        description: 'Invalid password reset link. Please check your email for the correct link.',
      });
      setValidParams(false);
    }
  }, [uidb64, token]);

  const handleSubmit = async (values: { password: string; confirm_password: string }) => {
    const { password, confirm_password } = values;

    if (password !== confirm_password) {
      notification.error({
        message: 'Error',
        description: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://127.0.0.1:8000/reset/${uidb64}/${token}/`,
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      notification.success({
        message: 'Password Reset',
        description: 'Your password has been reset successfully.',
      });
      router.push('/Login');
    } catch (error) {
      console.error('Error:', error); // Debugging log
      notification.error({
        message: 'Error',
        description: error.response?.data?.error || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (rule: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter your new password');
    }
    if (value.length < 8) {
      return Promise.reject('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject('Password must contain at least one number');
    }
    return Promise.resolve();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">Reset Password</h1>
        {validParams && (
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, validator: validatePassword }]}
            >
              <Input.Password placeholder="Enter your new password" />
            </Form.Item>
            <Form.Item
              label="Confirm New Password"
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your new password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default PasswordResetForm;
