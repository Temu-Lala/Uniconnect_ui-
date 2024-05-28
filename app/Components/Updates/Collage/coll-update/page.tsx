"use client"


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Checkbox, DatePicker, Form, Input, Select, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Link from "next/link";
import moment from "moment";

const { Option } = Select;

type FileType = RcFile;

interface CollegeFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: FileType | null;
  background: FileType | null;
  number_of_lectures: number;
  number_of_departments: number;
  establishment_date: string;
  location: string;
  university_profile_id: string;
  campus_profile_id: string;
}

const initialCollegeFormData: CollegeFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar: null,
  background: null,
  number_of_lectures: 0,
  number_of_departments: 0,
  establishment_date: "",
  location: "",
  university_profile_id: "",
  campus_profile_id: ""
};

const CollUpdate: React.FC = () => {
  const [formData, setFormData] = useState<CollegeFormData>(initialCollegeFormData);
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [campuses, setCampuses] = useState<any[]>([]);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="251">
      <Select style={{ width: 70 }}>
        <Option value="251">+251</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  // Fetch universities from API
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/university-profiles/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setUniversities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching universities:", error);
      });
  }, []);

  // Fetch campuses when a university is selected
  useEffect(() => {
    if (selectedUniversityId) {
      const authToken = localStorage.getItem("token");
      axios
        .get(`http://127.0.0.1:8000/university-profiles/${selectedUniversityId}/campus-profiles/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setCampuses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching campuses:", error);
        });
    }
  }, [selectedUniversityId]);

  const handleUniversityChange = (value: string) => {
    console.log("Selected University ID:", value);
    setSelectedUniversityId(value);
    setFormData({ ...formData, university_profile_id: value });
    setCampuses([]);
  };

  const handleCampusChange = (value: string) => {
    console.log("Selected Campus ID:", value);
    setFormData({ ...formData, campus_profile_id: value });
  };

  const onChangeAvatar: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        avatar: file,
      });
    }
  };

  const onChangeBackground: UploadProps["onChange"] = ({ fileList }) => {
    if (fileList.length > 0) {
      const file: FileType = fileList[0].originFileObj as FileType;
      setFormData({
        ...formData,
        background: file,
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
    e: React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setFormData({ ...formData, establishment_date: date ? date.format('YYYY-MM-DD') : "" });
  };

  const handleSubmit = async () => {
    console.log("Form Data before submit:", formData);

    const data = new FormData();
    data.append("university_id", selectedUniversityId);
    data.append("campus_profile_id", formData.campus_profile_id);

    // Append other fields, excluding university and campus which are already added
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof CollegeFormData] !== null && key !== "university_profile_id" && key !== "campus_profile_id") {
        data.append(key, formData[key as keyof CollegeFormData] as any);
      }
    });

    console.log("FormData to be sent:", Array.from(data.entries()));

    try {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        const response = await axios.put(
          `http://127.0.0.1:8000/college_profiles/update/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        message.success("College profile updated successfully!");
        setFormData(initialCollegeFormData);
      }
    } catch (error) {
      message.error("Failed to update college profile. Please try again.");
      console.error("Error updating college profile:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchCollegeProfile = async () => {
      const collegeId = 1; // Replace with the actual college ID
      const authToken = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/college_profiles/${collegeId}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const profileData = response.data;
        setFormData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          avatar: null, // You can set this to the URL of the avatar if available
          background: null, // You can set this to the URL of the background if available
          number_of_lectures: profileData.number_of_lectures,
          number_of_departments: profileData.number_of_departments,
          establishment_date: profileData.establishment_date,
          location: profileData.location,
          university_profile_id: profileData.university,
          campus_profile_id: profileData.campus
        });
        setSelectedUniversityId(profileData.university);
        // Fetch campuses for the selected university
        if (profileData.university) {
          const campusResponse = await axios.get(`http://127.0.0.1:8000/university-profiles/${profileData.university}/campus-profiles/`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setCampuses(campusResponse.data);
        }
      } catch (error) {
        console.error("Error fetching college profile:", error);
      }
    };

    fetchCollegeProfile();
  }, []);

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form className="" layout="vertical" onFinish={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Update College Profile
            </h2>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <Form.Item
              label="University"
              name="university"
              rules={[
                { required: true, message: "Please select a university!" },
              ]}
              className="flex-1"
            >
              <Select
                value={formData.university_profile_id}
                onChange={handleUniversityChange}
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                options={universities.map((university) => ({
                  value: university.id,
                  label: university.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Campus"
              name="campus"
              rules={[{ required: true, message: "Please select campus!" }]}
              className="flex-1"
            >
              <Select
                value={formData.campus_profile_id}
                onChange={handleCampusChange}
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                disabled={!selectedUniversityId}
                options={campuses.map((campus) => ({
                  value: campus.id,
                  label: campus.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="College name"
              rules={[{ required: true, message: "Please input college name!" }]}
              name="name"
            >
              <Input
                type="text"
                name="name"
                placeholder="College name"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col gap-4 md:flex-row">
            <Form.Item label="Email" name="email" className="flex-1">
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
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
              tooltip="Little information or bio about the campus"
            >
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about the campus"
                showCount
                rows={5}
                maxLength={150}
                className="rounded-md border border-[#bfbfbf]"
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Establishment Date"
              name="establishment_date"
              rules={[{ required: true, message: "Please select the establishment date!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleDateChange}
                value={formData.establishment_date ? moment(formData.establishment_date) : null}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please input the location!" }]}
            >
              <Input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.location}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex ">
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
                      formData.background
                        ? [
                            {
                              uid: "1",
                              name: formData.background.name,
                              url: URL.createObjectURL(formData.background),
                            },
                          ]
                        : []
                    }
                    onChange={onChangeBackground}
                    onPreview={onPreview}
                    maxCount={1}
                  >
                    {formData.background ? null : "+ Upload Background"}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </div>
          </div>

          <div className="mb-5 flex gap-4">
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

          <div className="mb-5 h-5">
            <Checkbox>
              By creating a college profile on Uni-connect you're agreeing to our{" "}
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
              className="btn w-full rounded-md bg-blue-600 py-3 px-8 text-center text-base font-semibold text-white border-none"
            >
              Update college profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default CollUpdate;
