"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ConfigProvider, Button, Table, Modal } from "antd";
import type { TableColumnsType } from "antd";
import { customDarkTheme } from "@/app/theme";
import { LecturerFormData, initialLectureFormData } from "@/app/types/types";
import Image from "next/image";
interface DataType {
  key: number;
  name: string;
  avatar: string | null;
  fullDetails: LecturerFormData;
}

export default function Page() {
  const [lectureData, setLectureData] = useState<DataType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LecturerFormData | null>(null);
  const [userRole, setUserRole] = useState<string>("normal"); // Example role, set this based on actual user role

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/files/lecturesData.json ");
      const fetchedData = response.data.map((item: any) => ({
        key: item.id,
        name: `${item.first_name} ${item.last_name}`,
        avatar: item.avatar,
        fullDetails: item, // Store full details for modal display
      }));
      setLectureData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      dataIndex: "avatar",
      render: (avatar: string | null) => (
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={avatar || "/images/lectures/default-avatar.webp"}
            alt="Avatar"
            className="w-full h-full object-contain"
          />
        </div>
      ),
    },
    {
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      render: (text: string, record: DataType) => (
        <Button
          onClick={() => viewDetails(record)}
          className="btn min-h-[2rem] h-[2rem] bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          View CV
        </Button>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const viewDetails = (record: DataType) => {
    setSelectedRow(record.fullDetails);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  // Check if selectedRow.avatar is a string (URL) before rendering the image
  const renderAvatar = () => {
    if (selectedRow?.avatar && typeof selectedRow.avatar === "string") {
      return (
        <img
          src={selectedRow.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-6"
        />
      );
    } else {
      return null; // Handle the case where selectedRow.avatar is not a string (e.g., File) or selectedRow is null
    }
  };

  const components = {
    header: {
      wrapper: () => null, // Removes the default header
    },
  };

  return (
    <ConfigProvider theme={customDarkTheme}>
      <div className="w-full p-3">
        <Table
          className=""
          pagination={{ pageSize: 8 }}
          title={() => (
            <div className="ml-4 py-2">
              <h3 className="font-bold text-lg">Lecturers</h3>
            </div>
          )}
          components={components}
          rowSelection={
            userRole === "admin"
              ? {
                  type: "checkbox",
                  ...rowSelection,
                }
              : undefined
          }
          columns={columns}
          dataSource={lectureData}
        />

        {selectedRow && (
          <Modal
            title="Lecturer CV"
            visible={showModal}
            onCancel={closeModal}
            footer={null}
          >
            <div className="shadow-md p-8 rounded-lg w-">
              {/* Profile Section */}
              <div className="flex items-center mb-8">
                {renderAvatar()}
                <div>
                  <h1 className="text-2xl font-bold">{`${selectedRow.first_name} ${selectedRow.last_name}`}</h1>
                  <p className="text-gray-600">{selectedRow.title}</p>
                  <p className="text-gray-600">{selectedRow.field}</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Contact Details</h2>
                <p className="text-gray-600 mb-2">{selectedRow.phone}</p>
                <p className="text-gray-600">{selectedRow.email}</p>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Education Background</h2>
                {selectedRow.education_background.map((education, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="font-bold">
                      {education.degree} in {education.fieldOfStudy}
                    </h3>
                    <p className="text-gray-600">
                      {education.school} - {education.year_finished}
                    </p>
                  </div>
                ))}
              </div>

              {/* Professional Experience Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">
                  Professional Experience
                </h2>
                {selectedRow.professional_experience.map(
                  (experience, index) => (
                    <div key={index} className="mb-2">
                      <h3 className="font-bold">{experience.positionName}</h3>
                      <p className="text-gray-600">
                        {experience.company} - {experience.start_date} to{" "}
                        {experience.end_date}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Skills</h2>
                <div className="flex flex-wrap">
                  {selectedRow.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 px-3 py-1 mr-2 mb-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Publications Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-2">Publications</h2>
                  {selectedRow.publications.map((publication, index) => (
                    <p key={index} className="text-gray-600">
                      {publication}
                    </p>
                  ))}
                </div>

                {/* Awards Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-2">Awards</h2>
                  {selectedRow.awards.map((award, index) => (
                    <p key={index} className="text-gray-600">
                      {award}
                    </p>
                  ))}
                </div>

                {/* Languages Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-2">Languages</h2>
                  {selectedRow.languages.map((language, index) => (
                    <p key={index} className="text-gray-600">
                      {language}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ConfigProvider>
  );
}
