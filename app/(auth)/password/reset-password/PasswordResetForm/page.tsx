'use client'

import { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams instead of useRouter

const PasswordResetForm: React.FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams(); // Use useSearchParams instead of useRouter
  const uidb64 = searchParams.get('uidb64');
  const token = searchParams.get('token');

  console.log('Received uidb64:', uidb64); // Console log the received uidb64
  console.log('Received token:', token); // Console log the received token

  const handleSubmit = async (values: { password: string; confirm_password: string }) => {
    const { password, confirm_password } = values;

    console.log('Received password:', password); // Log the received password
    console.log('Received confirm password:', confirm_password);
    
    if (password !== confirm_password) {
      notification.error({
        message: 'Error',
        description: 'Passwords do not match.',
      });
      
      return;
    }

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
      router.push('/login');
    } catch (error) {
      console.error('Error:', error); // Debugging log
      notification.error({
        message: 'Error',
        description: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', paddingBottom: '20px' }}>Reset Password</h1>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your new password' }]}
        >
          <Input.Password placeholder="Enter your new password" />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirm_password"
          rules={[{ required: true, message: 'Please confirm your new password' }]}
        >
          <Input.Password placeholder="Confirm your new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordResetForm;
