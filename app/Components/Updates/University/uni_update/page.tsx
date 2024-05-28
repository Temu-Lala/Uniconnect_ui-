"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { UploadFile, UploadProps, RcFile } from "antd/lib/upload/interface";
import moment from "moment";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;

type FileType = RcFile;

type UniversityFormData = {
  id: number;
  email: string;
  name: string;
  phone: string;
  bio: string;
  profile_photo: File | string | null;
  cover_photo: File | string | null;
  link: string;
  category: string;
  establishment_date: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_campuses: number;
  number_of_colleges: number;
  number_of_libraries: number;
  number_of_laboratories: number;
  about: string;
  health_condition_support: string;
  region: string;
  city: string;
  pobox: string;
  specific_place: string;
  location: { lat: number; lng: number };
  group: number;
  status: string;
  user: string;
};

const initialUniversityFormData: UniversityFormData = {
  id: 0,
  email: "",
  name: "",
  phone: "",
  bio: "",
  profile_photo: null,
  cover_photo: null,
  link: "",
  category: "",
  establishment_date: "",
  number_of_lectures: 0,
  number_of_departments: 0,
  number_of_campuses: 0,
  number_of_colleges: 0,
  number_of_libraries: 0,
  number_of_laboratories: 0,
  about: "",
  health_condition_support: "",
  region: "",
  city: "",
  pobox: "",
  specific_place: "",
  location: { lat: 0, lng: 0 },
  group: 1,
  status: "",
  user: "",
};

const dateFormat = "YYYY-MM-DD";

const UniversityProfileForm = () => {
  const [formData, setFormData] = useState<UniversityFormData>(
    initialUniversityFormData
  );

  const onChangeAvatar: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        profile_photo: file,
      });
    }
  };

  const onChangeBackground: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        cover_photo: file,
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

  useEffect(() => {
    const fetchUniversityProfile = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (authToken) {
          const response = await axios.get(
            "http://127.0.0.1:8000/university-profile/",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const profileData = response.data;
          setFormData({
            ...profileData,
            establishment_date: profileData.establishment_date,
            profile_photo: profileData.profile_photo,
            cover_photo: profileData.cover_photo,
          });
        }
      } catch (error) {
        console.error("Error fetching university profile:", error);
      }
    };

    fetchUniversityProfile();
  }, []);

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

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      health_condition_support: value,
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof UniversityFormData] !== null) {
        data.append(key, formData[key as keyof UniversityFormData] as any); // Type assertion to any
      }
    });

    try {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        const response = await axios.put(
          `http://127.0.0.1:8000/university-profile/update/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("University profile updated:", response.data);
        setFormData(initialUniversityFormData);
      }
    } catch (error) {
      console.error("Error updating university profile:", error);
    }
  };

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form
          className="w-full sm:w-11/12"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Update University Profile
            </h2>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Name of university "
              name="name"
              rules={[
                { required: true, message: "Please input university name!" },
              ]}
            >
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="University name"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <Form.Item label="Email" name="email" className="flex-1">
              <Input
                name="email"
                value={formData.email}
                className="rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              />
            </Form.Item>

            <div className="flex-1 phone">
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input phone number!",
                  },
                ]}
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-12 rounded-md border border-[#bfbfbf]"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Bio"
              name="bio"
              tooltip="Little information or bio about the campus"
            >
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about the university"
                showCount
                rows={5}
                maxLength={150}
                className="rounded-md border border-[#bfbfbf]"
                style={{ resize: "none" }}
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
                      formData.profile_photo
                        ? [
                            {
                              uid: "1",
                              name: "Profile Photo",
                              url:
                                typeof formData.profile_photo === "string"
                                  ? formData.profile_photo
                                  : URL.createObjectURL(formData.profile_photo),
                            },
                          ]
                        : []
                    }
                    onChange={onChangeAvatar}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {formData.profile_photo ? null : "+ Upload Avatar"}
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
                      formData.cover_photo
                        ? [
                            {
                              uid: "1",
                              name: "Cover Photo",
                              url:
                                typeof formData.cover_photo === "string"
                                  ? formData.cover_photo
                                  : URL.createObjectURL(formData.cover_photo),
                            },
                          ]
                        : []
                    }
                    onChange={onChangeBackground}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {formData.cover_photo ? null : "+ Upload Background"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </div>
          </div>

          <div className="mb-5 url">
            <Form.Item label="Website URL">
              <Input
                type="text"
                name="link"
                style={{ height: "100%" }}
                className="w-full !h-full text-[#6B7280] rounded-md border border-[#bfbfbf] outline-none focus:border-blue-600 focus:shadow-md"
                placeholder="Please enter url"
                value={formData.link}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <Form.Item label="Category" className="flex-1">
              <Select
                placeholder="Category"
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                value={formData.category}
                onChange={(value) => handleSelectChange(value, "category")}
                options={[
                  { value: "Applied", label: "Applied" },
                  { value: "Engineering", label: "Engineering" },
                  { value: "Comprehensive", label: "Comprehensive" },
                  { value: "Research", label: "Research" },
                  { value: "Science and Technology", label: "Science and Technology" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Establishment Date" className="flex-1">
              <DatePicker
                name="establishment_date"
                id="establishment_date"
                placeholder="Establishment date"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={moment(formData.establishment_date, dateFormat)}
                format={dateFormat}
                onChange={(date, dateString) => {
                  setFormData({
                    ...formData,
                    establishment_date: dateString.toString(),
                  });
                }}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <Form.Item label="Number of campuses" className="flex-1">
              <Input
                type="number"
                name="number_of_campuses"
                id="number_of_campuses"
                placeholder="Number of campuses"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_campuses}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Number of colleges" className="flex-1">
              <Input
                type="number"
                name="number_of_colleges"
                id="number_of_colleges"
                placeholder="Number of colleges"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_colleges}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Number of departments" className="flex-1">
              <Input
                type="number"
                name="number_of_departments"
                id="number_of_departments"
                placeholder="Number of departments"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_departments}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item label="Number of lectures" className="flex-1">
              <Input
                type="number"
                name="number_of_lectures"
                id="number_of_lectures"
                placeholder="Number of lectures"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_lectures}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Does the university support disabled students?">
              <Radio.Group
                onChange={handleRadioChange}
                name="health_condition_support"
                value={formData.health_condition_support}
              >
                <Radio value="yes">
                  Yes we support and have the facility/courses
                </Radio>
                <Radio value="no">No we don't support</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="More about">
              <TextArea
                name="about"
                value={formData.about}
                showCount
                onChange={handleChange}
                maxLength={500}
                placeholder="More details about the university"
                className="rounded-md border border-[#bfbfbf]"
                style={{ height: 220, resize: "none" }}
              />
            </Form.Item>
          </div>

          <div className="mb-5 pt-3">
            <label className="mb-5 block text-base font-semibold text-[#06060f] sm:text-xl">
              Address Details
            </label>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <Select
                    value={formData.region}
                    placeholder="Select a region"
                    className="w-full h-12 rounded-md border border-[#bfbfbf]"
                    onChange={(value) => handleSelectChange(value, "region")}
                    options={[
                      { value: "Addis Abeba", label: "Addis Abeba" },
                      { value: "Dire Dawa", label: "Dire Dawa" },
                      { value: "Oromia", label: "Oromia" },
                      { value: "Amhara", label: "Amhara" },
                      { value: "Tigray", label: "Tigray" },
                      { value: "Afar", label: "Afar" },
                      { value: "Somali", label: "Somali" },
                      { value: "Benishangul-Gumuz", label: "Benishangul-Gumuz" },
                      { value: "SNNPR", label: "SNNPR" },
                      { value: "Harari", label: "Harari" },
                      { value: "Gambella", label: "Gambella" },
                    ]}
                  />
                </div>
              </div>

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#bfbfbf] bg-transparent py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  />
                </div>
              </div>

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <Input
                    type="text"
                    name="pobox"
                    id="pobox"
                    placeholder="Po Box"
                    value={formData.pobox}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  />
                </div>
              </div>

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <Input
                    type="text"
                    name="specific_place"
                    id="specific_place"
                    placeholder="Specific Place"
                    value={formData.specific_place}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 h-5">
            <Checkbox>
              By creating a university profile on Uni-connect you're agreeing to
              the{" "}
              <Link href="#" className="text-blue-600">
                terms and conditions
              </Link>
              .
            </Checkbox>
          </div>

          <div>
            <Button
              htmlType="submit"
              className="btn w-full rounded-md bg-blue-600 py-3 px-8 text-center text-base font-semibold text-white border-none"
            >
              Update university profile
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default UniversityProfileForm;
