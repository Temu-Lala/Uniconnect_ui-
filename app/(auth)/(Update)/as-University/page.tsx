"use client";
// components/NewUniversityProfileForm.js
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Input, Select } from "antd";
const { TextArea } = Input;
import MapInput from "./MapInput";
import Link from "next/link";

import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type {
  UploadFile,
  UploadProps,
  RcFile,
} from "antd/lib/upload/interface";

import {
  UniversityFormData,
  initialUniversityFormData,
} from "@/app/types/types";
const { Option } = Select;

type FileType = RcFile;

const NewUniversityProfileForm = () => {
  const [formData, setFormData] = useState<UniversityFormData>(
    initialUniversityFormData
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

  useEffect(() => {
    // Fetch user ID from the server using the token
    const fetchUserId = async () => {
      try {
        const authToken = localStorage.getItem("token"); // Assuming you store the token in localStorage upon login
        if (authToken) {
          const response = await axios.get(
            "http://127.0.0.1:8000/user-profile/",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
              },
            }
          );
          setFormData((prevFormData) => ({
            ...prevFormData,
            user_id: response.data.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []); // Run only once on component mount

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

  const setLocation = (newLocation: { lat: number; lng: number }) => {
    setFormData((prevData) => ({
      ...prevData,
      location: newLocation,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("token"); // Assuming you store the token in localStorage upon login
      if (authToken) {
        const response = await axios.post(
          "http://127.0.0.1:8000/university_profiles/",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
            },
          }
        );
        console.log("University profile created:", response.data);
        // Reset form fields after successful submission
        setFormData({
          name: "",
          bio: "",
          avatar: null,
          background: null,
          link: "",
          category: "",
          establishment_date: "",
          number_of_lectures: 0,
          number_of_departments: 0,
          number_of_campuses: 0,
          number_of_colleges: 0,
          about: "",
          region: "",
          city: "",
          pobox: "",
          liyubota: "",
          location: { lat: 0, lng: 0 },
        });
      }
    } catch (error) {
      console.error("Error creating university profile:", error);
    }
  };

  return (
    <section className="pt-[67px] bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-10/12 xl:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <form className="w-full md:10/12 xl:w-8/12" onSubmit={handleSubmit}>
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a University Profile
            </h2>
          </div>

          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Name of university
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="University name"
              className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              value={"abebe@gmail.com"}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Bio
            </label>
            <TextArea
              name="bio"
              value={formData.bio}
              showCount
              onChange={handleChange}
              maxLength={100}
              placeholder="About the university"
              style={{ height: 120, resize: "none" }}
              className="border border-[#bfbfbf]"
            />
          </div>
          <div className="mb-5 flex ">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="pp"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Profile picture
              </label>
              <ImgCrop rotationSlider>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={
                    formData.avatar
                      ? [
                          {
                            uid: "1",
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
            </div>

            <div className="w-full sm:w-1/2">
              <label
                htmlFor="pp"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Cover picture
              </label>
              <ImgCrop aspect={16 / 9} rotationSlider>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={
                    formData.background
                      ? [
                          {
                            uid: "1",
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
            </div>
          </div>
          <div className="mb-5 url">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Website URL
            </label>
            <Input
              style={{ height: "100%" }}
              className="w-full !h-full text-[#6B7280] rounded-md border border-[#bfbfbf] outline-none focus:border-blue-600 focus:shadow-md"
              addonBefore={selectBefore} 
              addonAfter={selectAfter}
              placeholder="Please enter url"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Establishment Date
            </label>
            <Input
              type="date"
              name="establishment_date"
              id="establishment_date"
              placeholder="Establishment date"
              className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.establishment_date}
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="countries"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              Category
            </label>
            <Select
              name="category"
              placeholder="Category"
              className="w-full h-12 rounded-md border border-[#bfbfbf]"
              value={formData.category}
              // onChange={handleChange}
              options={[
                { value: "applied", label: "Applied" },
                { value: "research", label: "Research" },
              ]}
            />
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Number of campus
              </label>
              <Input
                type="number"
                name="number_of_campuses"
                id="number_of_campuses"
                placeholder="Number of campus"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_campuses}
                onChange={handleChange}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Number of colleges
              </label>
              <Input
                type="number"
                name="number_of_colleges"
                id="number_of_colleges"
                placeholder="Number of college"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_colleges}
                onChange={handleChange}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Number of departments
              </label>
              <Input
                type="number"
                name="number_of_departments"
                id="number_of_departments"
                placeholder="Number of departments"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_departments}
                onChange={handleChange}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#06060f]"
              >
                Number of lectures
              </label>
              <Input
                type="number"
                name="number_of_lectures"
                id="number_of_lectures"
                placeholder="Number of lectures"
                className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                value={formData.number_of_lectures}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="phone"
              className="mb-3 block text-base font-medium text-[#06060f]"
            >
              More about
            </label>
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
          </div>

          <div className="mb-5 pt-3">
            <label className="mb-5 block text-base font-semibold text-[#06060f] sm:text-xl">
              Address Details
            </label>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <Select
                    name="region"
                    value={formData.region}
                    placeholder="Region"
                    className="w-full h-12 rounded-md border border-[#bfbfbf]"
                    // onChange={handleChange}
                    options={[
                      { value: "Addis Abeba", label: "Addis Abeba" },
                      { value: "Dire Dawa", label: "Dire Dawa" },
                      { value: "Oromia", label: "Oromia" },
                      { value: "Amhara", label: "Amhara" },
                      { value: "Tigray", label: "Tigray" },
                      { value: "Afar", label: "Afar" },
                      { value: "Somali", label: "Somali" },
                      {
                        value: "Benishangul-Gumuz",
                        label: "Benishangul-Gumuz",
                      },
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
                    className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    type="text"
                    name="spe"
                    id="post-code"
                    placeholder="Liyu bota"
                    className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* location input from map goes here */}
          <div className="mb-5 w-full h-[300px] rounded-md border border-[#bfbfbf]">
            {/* <MapInput location={formData.location} setLocation={setLocation} /> */}
          </div>

          <div className="mb-5 flex items-start">
            <div className="flex items-center h-5">
              <Input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="text-gray-500 dark:text-gray-300"
              >
                By creating a university profile on Uni-connect you're agreeing
                to the{" "}
                <Link href="#" className="text-blue-600">
                  terms and conditions
                </Link>
                .
              </label>
            </div>
          </div>

          <div>
            <button className="btn w-full rounded-md bg-blue-600 py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Create university profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewUniversityProfileForm;
