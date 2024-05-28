"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Checkbox, message, Form, Input, Select, Upload, DatePicker } from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Link from "next/link";
import moment from "moment";

const { Option } = Select;

type FileType = RcFile;

export type DepartmentFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: FileType | null;
  background: FileType | null;
  number_of_lectures: number;
  establishment_date: string;
  location: string;
  university_profile_id: string;
  campus_profile_id: string;
  college_profile_id: string;
  group: string;
};

const initialDepartmentFormData: DepartmentFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar: null,
  background: null,
  number_of_lectures: 0,
  establishment_date: "",
  location: "",
  university_profile_id: "",
  campus_profile_id: "",
  college_profile_id: "",
  group: "4",
};

const DepartmentForm: React.FC = () => {
  const [formData, setFormData] = useState<DepartmentFormData>(initialDepartmentFormData);
  const [universities, setUniversities] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payload = JSON.parse(decodedPayload);
        setUserId(payload.user_id);
      }
    }
  }, []);

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
    if (formData.university_profile_id) {
      axios
        .get(
          `http://127.0.0.1:8000/university-profiles/${formData.university_profile_id}/campus-profiles/`
        )
        .then((response) => {
          setCampuses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching campuses:", error);
        });
    }
  }, [formData.university_profile_id]);

  // Fetch colleges when a campus is selected
  useEffect(() => {
    if (formData.campus_profile_id) {
      axios
        .get(
          `http://127.0.0.1:8000/campus-profiles/${formData.campus_profile_id}/college-profiles/`
        )
        .then((response) => {
          setColleges(response.data);
        })
        .catch((error) => {
          console.error("Error fetching colleges:", error);
        });
    }
  }, [formData.campus_profile_id]);

  const handleUniversityChange = (value: string) => {
    setFormData({ ...formData, university_profile_id: value, campus_profile_id: "", college_profile_id: "" });
    setCampuses([]);
    setColleges([]);
  };

  const handleCampusChange = (value: string) => {
    setFormData({ ...formData, campus_profile_id: value, college_profile_id: "" });
    setColleges([]);
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
    try {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("bio", formData.bio);
        data.append("number_of_lectures", formData.number_of_lectures.toString());
        data.append("establishment_date", formData.establishment_date);
        data.append("location", formData.location);
        data.append("university", formData.university_profile_id);
        data.append("campus", formData.campus_profile_id);
        data.append("college", formData.college_profile_id);
        data.append("user", userId);
        data.append("group", formData.group);
        if (formData.avatar) {
          data.append("avatar", formData.avatar);
        }
        if (formData.background) {
          data.append("background", formData.background);
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/department-profiles/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        message.success("Department profile created successfully!");
        setFormData(initialDepartmentFormData);
      }
    } catch (error) {
      message.error("Failed to create department profile. Please try again.");
      console.error("Failed to create department profile:", error);
    }
  };

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form className="" layout="vertical" onFinish={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a Department Profile
            </h2>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
            <Form.Item
              label="University"
              name="university_profile_id"
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
              name="campus_profile_id"
              rules={[{ required: true, message: "Please select campus!" }]}
              className="flex-1"
            >
              <Select
                value={formData.campus_profile_id}
                onChange={handleCampusChange}
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                disabled={!formData.university_profile_id}
                options={campuses.map((campus) => ({
                  value: campus.id,
                  label: campus.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="College"
              name="college_profile_id"
              rules={[{ required: true, message: "Please select college!" }]}
              className="flex-1"
            >
              <Select
                value={formData.college_profile_id}
                onChange={(value) =>
                  setFormData({ ...formData, college_profile_id: value })}
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                disabled={!formData.campus_profile_id}
                options={colleges.map((college) => ({
                  value: college.id,
                  label: college.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Department name"
              rules={[
                { required: true, message: "Please input department name!" },
              ]}
              name="name"
            >
              <Input
                type="text"
                name="name"
                placeholder="Department name"
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

          <div className="mb-5">
            <Form.Item
              label="Bio"
              tooltip="Little information or bio about the department"
            >
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about the department"
                showCount
                rows={5}
                maxLength={150}
                className="rounded-md border border-[#bfbfbf]"
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
              By creating a department profile on Uni-connect you're agreeing to
              our{" "}
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
              Create department profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default DepartmentForm;
