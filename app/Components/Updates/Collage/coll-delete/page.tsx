"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, message, Modal } from "antd";

const DeleteProfile: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("token");

    try {
      const response = await axios.delete("http://127.0.0.1:8000/college_profiles/update/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      message.success("Profile deleted successfully");
      setVisible(false);
    } catch (error) {
      message.error("Failed to delete profile. Please try again.");
      console.error("Error deleting profile:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" pt-24 delete-profile">
      <Button type="primary" danger onClick={showModal}>
        Delete Profile
      </Button>
      <Modal
        title="Delete Profile"
        visible={visible}
        onOk={handleDelete}
        confirmLoading={loading}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default DeleteProfile;
