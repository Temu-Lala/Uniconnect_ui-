"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Link from "next/link";

const { Option } = Select;

type FileType = RcFile;

export type CampusFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  link: string;
  avatar: File | null;
  background: File | null;
  establishment_date: string;
  category: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_colleges: number;
  about: string;
  location: string;
  university: string; // Updated to match expected field
  region: string;
  city: string;
  pobox: string;
  specific_place: string;
};

export const initialCampusFormData: CampusFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  link: "",
  avatar: null,
  background: null,
  establishment_date: "",
  category: "",
  number_of_lectures: 0,
  number_of_departments: 0,
  number_of_colleges: 0,
  about: "",
  location: "",
  university: "", // Updated to match expected field
  region: "",
  city: "",
  pobox: "",
  specific_place: "",
};

const CampusForm: React.FC = () => {
  const [formData, setFormData] = useState<CampusFormData>(
    initialCampusFormData
  );
  const [universities, setUniversities] = useState<any[]>([]);
  const [user, setUser] = useState<string>("");
  const [group, setGroup] = useState<number>(2);

  const dateFormat = "YYYY-MM-DD";
  const establishmentDate = formData.establishment_date
    ? moment(formData.establishment_date, dateFormat)
    : null;

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
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

      // Decode user ID from token without using jwtDecode
      const tokenParts = authToken.split('.')[1];
      const decoded = JSON.parse(atob(tokenParts));
      setUser(decoded.user_id);
    }
  }, []);

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

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof CampusFormData] !== null) {
        data.append(key, formData[key as keyof CampusFormData] as any); // Type assertion to any
      }
    });

    data.append("user", user);
    data.append("group", group.toString());

    try {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        const response = await axios.post(
          "http://127.0.0.1:8000/campus-profiles/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        message.success("Campus profile created successfully!");
        console.log("Campus profile created:", response.data);
        setFormData(initialCampusFormData);
      }
    } catch (error) {
      message.error("Failed to create campus profile. Please try again.");
      console.error("Error creating campus profile:", error);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="251">
      <Select style={{ width: 70 }}>
        <Option value="251">+251</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form className="" layout="vertical" onFinish={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a Campus Profile
            </h2>
          </div>

          <div className="mb-5">
            <Form.Item
              label="University"
              name="university"
              rules={[
                { required: true, message: "Please select a university!" },
              ]}
            >
              <Select
                value={formData.university}
                onChange={(value) =>
                  setFormData({ ...formData, university: value })
                }
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                options={universities.map((university) => ({
                  value: university.id,
                  label: university.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Campus name"
              name="name"
              rules={[{ required: true, message: "Please input campus name!" }]}
            >
              <Input
                type="text"
                name="name"
                placeholder="Campus name"
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
              name="bio"
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
                onChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
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
                value={establishmentDate}
                format={dateFormat}
                onChange={(date, dateString) => {
                  setFormData({ ...formData, establishment_date: dateString.toString() });
                }}
              />
            </Form.Item>
          </div>

          <div className="mb-5 flex flex-col sm:flex-row gap-4">
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

          <div className="mb-5">
            <Form.Item label="Region">
              <Select
                placeholder="Select a region"
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                value={formData.region}
                onChange={(value) =>
                  handleSelectChange(value, "region")
                }
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
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="City">
              <Select
                placeholder="Select a city"
                className="w-full h-12 rounded-md border border-[#bfbfbf]"
                value={formData.city}
                onChange={(value) =>
                  handleSelectChange(value, "city")
                }
                options={[
                  { value: "city1", label: "City 1" },
                  { value: "city2", label: "City 2" },
                  { value: "city3", label: "City 3" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="PO Box">
              <Input
                type="text"
                name="pobox"
                placeholder="PO Box"
                value={formData.pobox}
                onChange={handleChange}
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Specific Place">
              <Input
                type="text"
                name="specific_place"
                placeholder="Specific Place"
                value={formData.specific_place}
                onChange={handleChange}
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Location">
              <Input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              />
            </Form.Item>
          </div>

          <div className="mb-5 h-5">
            <Checkbox>
              By creating a campus profile on Uni-connect you're agreeing to our{" "}
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
              Create campus profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default CampusForm;
