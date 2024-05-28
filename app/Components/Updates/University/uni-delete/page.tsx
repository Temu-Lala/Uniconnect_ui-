// pages/deleteProfile.js

"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "antd";

const DeleteUniversityProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("token");

    try {
      await axios.delete("http://127.0.0.1:8000/university-profile/delete/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setLoading(false);
      setIsModalVisible(false);
      // Optionally, you can redirect the user or show a success message here
      console.log("University profile deleted successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error deleting university profile:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Button type="danger" onClick={showModal}>
          Delete University Profile
        </Button>
        <Modal
          title="Confirm Deletion"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={loading}
        >
          <p>Are you sure you want to delete this university profile?</p>
        </Modal>
      </div>
    </div>
  );
};

export default DeleteUniversityProfile;
