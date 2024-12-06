// Update/layout.tsx
import { Layout } from "antd";
import React from "react";
import AdvertisementsPage from "@/app/Components/Ad/page";

const { Sider } = Layout;

const UpdateLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="h-screen pt-[64px] bg-white flex">
      <div className="w-full sm:w-10/12 flex flex-col items-center">
        {children}
      </div>
      <div className="fixed top-0 right-0 hidden w-2/12 sm:flex flex-col bg-gray-100 border-l border-gray-300 p-2 gap-2  h-[100vh] overflow-hidden">
        <h2 className="my-4 text-center">Advertisement</h2>
        <AdvertisementsPage />
      </div>
    </div>

  
  );
};

export default UpdateLayout;
