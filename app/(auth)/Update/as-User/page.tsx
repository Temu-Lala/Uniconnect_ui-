"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Link from "next/link";

const { Option } = Select;

type FileType = RcFile;

export interface UserFormData {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone: string;
  bio: string;
  avatar: File | null;
  cover: File | null;
}

const initialUserFormData: UserFormData = {
  first_name: '',
  last_name: '',
  gender: '',
  email: '',
  phone: '',
  bio: '',
  avatar: null,
  cover: null,
};

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>(initialUserFormData);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="251">
      <Select style={{ width: 70 }}>
        <Option value="251">+251</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  const onChangeAvatar: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        avatar: file,
      });
    }
  };

  const onChangeCover: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        cover: file,
      });
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        const response = await axios.post(
          "http://127.0.0.1:8000/user_profiles/",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("User profile request sent successfully:", response.data);
        setFormData(initialUserFormData);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form className="" layout="vertical" onFinish={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a User Profile
            </h2>
          </div>

          <div className="mb-5 flex flex-col gap-4 md:flex-row">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please input first name!" }]}
              className="flex-1"
            >
              <Input
                type="text"
                name="first_name"
                placeholder="First name"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please input last name!" }]}
              className="flex-1"
            >
              <Input
                type="text"
                name="last_name"
                placeholder="Last name"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: value })}
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col gap-4 md:flex-row">
            <Form.Item label="Email" name="email" className="flex-1">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Item>

            <div className="phone flex-1">
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  addonBefore={prefixSelector}
                  className="w-full h-12 rounded-md border border-[#bfbfbf]"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Bio"
              name="bio"
              tooltip="Little information or bio about the user"
            >
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about the user"
                showCount
                rows={5}
                maxLength={150}
                className="rounded-md border border-[#bfbfbf]"
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex">
            <div className="w-full sm:w-1/2">
              <Form.Item label="Profile picture">
                <ImgCrop rotationSlider>
                  <Upload
                    className="w-fit border border-dotted border-[#bfbfbf] rounded-lg"
                    listType="picture-card"
                    fileList={
                      formData.avatar
                        ? [
                            {
                              uid: "1",
                              name: formData.avatar.name,
                              url: URL.createObjectURL(formData.avatar),
                            },
                          ]
                        : []
                    }
                    onChange={onChangeAvatar}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {formData.avatar ? null : "+ Upload Avatar"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </div>

            <div className="w-full sm:w-1/2">
              <Form.Item label="Cover photo">
                <ImgCrop aspect={16 / 9} rotationSlider>
                  <Upload
                    className="w-fit border border-dotted border-[#bfbfbf] rounded-lg"
                    listType="picture-card"
                    fileList={
                      formData.cover
                        ? [
                            {
                              uid: "1",
                              name: formData.cover.name,
                              url: URL.createObjectURL(formData.cover),
                            },
                          ]
                        : []
                    }
                    onChange={onChangeCover}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {formData.cover ? null : "+ Upload Cover"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </div>
          </div>

          <div className="mb-5 h-5">
            <Checkbox>
              By creating a user profile on Uni-connect you're agreeing to our{" "}
              <Link href="#" className="text-blue-600">
                terms and conditions
              </Link>
              .
            </Checkbox>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="btn w-full rounded-md bg-blue-500 py-3 px-5 text-base text-white hover:bg-blue-600"
            >
              Create Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default UserForm;
