import React, { useEffect } from 'react';
import { CiCircleCheck } from "react-icons/ci";
import { notification } from 'antd';

interface ToastProps {
  title: string;
  description: string;
  activeState: boolean;
}

const Toast: React.FC<ToastProps> = ({ title, description, activeState }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (activeState) {
      openNotification();
    }
  }, [activeState]); // Run when activeState changes

  const openNotification = () => {
    api.open({
      message: title,
      description,
      duration: 3,
      icon: <CiCircleCheck style={{ color: '#4BB543' }} />,
    });
  };

  return (
    <>
      {contextHolder}
    </>
  );
};

export default Toast;
