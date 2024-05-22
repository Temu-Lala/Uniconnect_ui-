import React from "react";
import { Form, Input, Upload, Button, Select, UploadFile } from "antd";
import { LecturerFormData } from "@/app/types/types";
import { availableLanguages } from "@/app/data/data";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";

const { Option } = Select;

interface Props {
  formData: LecturerFormData;
  handleInputChange: (name: string, value: any) => void;
}

const prefixSelector = (
  <Form.Item name="prefix" noStyle initialValue="251">
    <Select style={{ width: 70 }}>
      <Option value="251">+251</Option>
      <Option value="1">+1</Option>
    </Select>
  </Form.Item>
);

type FileType = RcFile;

const PersonalInfo: React.FC<Props> = ({ formData, handleInputChange }) => {
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

  return (
    <Form layout="vertical">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row">
        <Form.Item
          label="First Name"
          name="fname"
          className="flex-1"
          tooltip="Your own name"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
              whitespace: true,
            },
          ]}
        >
          <Input
            name="first_name"
            className="rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
            value={formData.first_name}
            defaultValue={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          className="flex-1"
          tooltip="Your fathers name"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
              whitespace: true,
            },
          ]}
        >
          <Input
            name="last_name"
            className="rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
            value={formData.last_name}
            defaultValue={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
          />
        </Form.Item>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <Form.Item
          label="Title"
          name="title"
          className="flex-1"
          rules={[{ required: true, message: "Please select title!" }]}
        >
          <Select
            value={formData.title}
            defaultValue={formData.title}
            className="h-12 rounded-md border border-[#bfbfbf]"
            placeholder="Select your title"
            onChange={(value) => handleInputChange("title", value)}
            options={[
              { value: "", label: "Select Title" },
              { value: "Mr.", label: "Mr." },
              { value: "Ms.", label: "Ms." },
              { value: "Mrs.", label: "Mrs." },
              { value: "Dr.", label: "Dr." },
              { value: "Prof.", label: "Prof." },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
          className="flex-1"
        >
          <Select
            placeholder="select your gender"
            className="w-full h-12 rounded-md border border-[#bfbfbf]"
            value={formData.gender}
            defaultValue={formData.gender}
            onChange={(value) => handleInputChange("gender", value)}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 ">
        <Form.Item
          label="Email"
          name="email"
          className="flex-1"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        > 
          <Input
            name="email"
            value={formData.email}
            defaultValue={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
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
              defaultValue={formData.phone}
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              addonBefore={prefixSelector}
              className="w-full h-12 rounded-md border border-[#bfbfbf]"
            />
          </Form.Item>
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 ">
      <Form.Item label="LinkedIn" name="linkedin" className="flex-1">
          <Input
            name="linkedin"
            value={formData.linkedin}
            defaultValue={formData.linkedin}
            onChange={(e) => handleInputChange("linkedin", e.target.value)}
            placeholder="https://www.linkedin.com/in/"
            className="w-full h-12 rounded-md border border-[#bfbfbf]"
          />
        </Form.Item>
        <Form.Item label="Languages" className="flex-1">
          <Select
            // ref={skillsSelectRef}
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select your languages"
            value={formData.languages}
            defaultValue={formData.languages}
            onChange={(value) => handleInputChange("languages", value)}
            options={availableLanguages.map((language) => ({
              value: language,
            }))}
            autoClearSearchValue={true}
            className="w-full h-12 rounded-md border border-[#bfbfbf]"
          />
        </Form.Item>

      </div>

      <div className="mb-4 flex ">
        <div className="w-full sm:w-1/2">
          <Form.Item label="Profile picture">
            <ImgCrop rotationSlider>
              <Upload
              className="w-fit border border-dotted border-[#bfbfbf] rounded-lg"
                beforeUpload={(file) => {
                  handleInputChange("avatar", file); // Updated to "avatar" instead of "cover"
                  return false;
                }}
                listType="picture-card"
                fileList={
                  formData.avatar
                    ? [
                        {
                          uid: "1",
                          name: formData.avatar?.name, // Provide a name if available
                          status: "done", // Set status to 'done' or 'uploading' depending on your scenario
                          url: URL.createObjectURL(formData.avatar),
                        },
                      ]
                    : []
                }
                onPreview={onPreview}
                maxCount={1}
              >
                {formData.avatar ? null : "+ Upload Avatar"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </div>

        <div className="w-full sm:w-1/2">
          <Form.Item
            label="Cover picture"
            tooltip="A background picture to be displayed behind your profile picture."
          >
            <ImgCrop aspect={16 / 9} rotationSlider>
              <Upload
              className="w-fit border border-dotted border-[#bfbfbf] rounded-lg"
                listType="picture-card"
                beforeUpload={(file) => {
                  handleInputChange("cover", file);
                  return false;
                }}
                fileList={
                  formData.cover
                    ? [
                        {
                          uid: "1",
                          name: formData.cover.name,
                          status: "done", // Assuming it's already uploaded
                          url: URL.createObjectURL(formData.cover),
                        },
                      ]
                    : []
                }
                onPreview={onPreview}
                maxCount={1}
              >
                {formData.cover ? null : "+ Upload cover"}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default PersonalInfo;
