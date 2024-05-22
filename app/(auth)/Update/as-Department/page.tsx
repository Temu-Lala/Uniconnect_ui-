"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DepartmentFormData,
  initialDepartmentFormData,
} from "@/app/types/types";
import {
  Button,
  Checkbox,
  message,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import Link from "next/link";

const { Option } = Select;

type FileType = RcFile;

const CampusForm: React.FC = () => {
  const [formData, setFormData] = useState<DepartmentFormData>(
    initialDepartmentFormData
  );
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [campuses, setCampuses] = useState<any[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [colleges, setColleges] = useState<any[]>([]);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="251">
      <Select style={{ width: 70 }}>
        <Option value="251">+251</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );
  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );
  const selectAfter = (
    <Select defaultValue=".com">
      <Option value=".com">.com</Option>
      <Option value=".jp">.jp</Option>
      <Option value=".cn">.cn</Option>
      <Option value=".org">.org</Option>
    </Select>
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
      axios
        .get(
          `http://127.0.0.1:8000/university-profiles/${selectedUniversityId}/campus-profiles/`
        )
        .then((response) => {
          setCampuses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching campuses:", error);
        });
    }
  }, [selectedUniversityId]);

  // Fetch colleges when a campus is selected
  useEffect(() => {
    if (selectedCampusId) {
      axios
        .get(
          `http://127.0.0.1:8000/campus-profiles/${selectedCampusId}/college-profiles/`
        )
        .then((response) => {
          setColleges(response.data);
        })
        .catch((error) => {
          console.error("Error fetching colleges:", error);
        });
    }
  }, [selectedCampusId]);

  const handleUniversityChange = (value: string) => {
    setSelectedUniversityId(value);
    setFormData({ ...formData, university_profile_id: value });
    setCampuses([]);
    setColleges([]);
  };

  const handleCampusChange = (value: string) => {
    setSelectedCampusId(value);
    setFormData({ ...formData, campus_profile_id: value });
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
    // try {
    //   const authToken = localStorage.getItem("token");
    //   if (authToken) {
    //     const response = await axios.post(
    //         `http://127.0.0.1:8000/university-profiles/${selectedUniversityId}/campus-profiles/`,
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${authToken}`,
    //         },
    //       }
    //     );
    //     message.success('Department profile request sent successfully!');
    //     console.log("Department profile request sent successfully!", response.data);

    //     setFormData(initialCollegeFormData);
    //   }
    // } catch (error) {
    //   message.error('Failed to register department profile. Please try again.');
    //   console.error("Failed to register department profile:", error);
    // }

    console.log("Submitted department data : ", formData)
  };

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form className="" layout="vertical" onFinish={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a department Profile
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
                disabled={!selectedUniversityId}
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
                disabled={!selectedCampusId}
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
                value="college@dbu.et"
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

export default CampusForm;

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const authToken = localStorage.getItem('token');
//     if (authToken) {
//       const response = await axios.post('http://127.0.0.1:8000/department_profiles/', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         },
//       });
//       console.log('Department profile created:', response.data);

//       // Reset form data after successful submission
//       setFormData({
//         name: '',
//         bio: '',
//         link: '',
//         establishment_date: '',
//         number_of_lectures: 0,
//         number_of_departments: 0,
//         number_of_campuses: 0,
//         number_of_colleges: 0,
//         about: '',
//         location: '',
//         group: '',
//         university_id: '',
//         campus_profile_id: '',
//         college_profile_id: '',
//         universities: [],
//         campuses: [],
//         colleges: []
//       });
//     }
//   } catch (error) {
//     console.error('Error creating department profile:', error);
//     setError('Error creating department profile. Please try again.');
//   }
// };
