"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Select, Button, Form } from "antd";
import { LecturerFormData, initialLectureFormData } from "@/app/types/types";

const { TextArea } = Input;

const LecturerForm: React.FC = () => {
  const [formData, setFormData] = useState<LecturerFormData>(
    initialLectureFormData
  );
  const [universities, setUniversities] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");

  // Fetch universities from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/university-profiles/")
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

  // Fetch departments when a college is selected
  useEffect(() => {
    if (selectedCollegeId) {
      axios
        .get(
          `http://127.0.0.1:8000/college-profiles/${selectedCollegeId}/department-profiles/`
        )
        .then((response) => {
          setDepartments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    }
  }, [selectedCollegeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUniversityChange = (value: string) => {
    setSelectedUniversityId(value);
    setSelectedCampusId("");
    setSelectedCollegeId("");
    setCampuses([]);
    setColleges([]);
    setDepartments([]);
  };

  const handleCampusChange = (value: string) => {
    setSelectedCampusId(value);
    setSelectedCollegeId("");
    setColleges([]);
    setDepartments([]);
  };

  const handleCollegeChange = (value: string) => {
    setSelectedCollegeId(value);
    setDepartments([]);
  };

  const handleSubmit = (values: any) => {
    console.log(values);
    // Send formData to backend
  };

  return (
    <section className="pt-[67px] bg-white flex flex-col items-center justify-center p-12">
      <div className="mx-auto w-full md:w-10/12 xl:w-8/12 bg-white p-8 flex justify-center border shadow-lg">
        <Form
          className="w-full md:10/12 xl:w-8/12"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <div className="my-5">
            <h2 className="text-lg font-bold text-black">
              Create a Lecturer Profile
            </h2>
          </div>

          <div className="flex  gap-4">
            <div className="mb-5 w-full sm:w-[50%]">
              <Form.Item label="University" name="university_id">
                <Select
                  value={selectedUniversityId}
                  onChange={handleUniversityChange}
                  className="w-full h-12 rounded-md border border-[#bfbfbf]"
                  options={universities.map((university) => ({
                    value: university.id,
                    label: university.name,
                  }))}
                />
              </Form.Item>
            </div>

            <div className="mb-5 w-full sm:w-[50%]">
              <Form.Item label="Campus" name="campus_profile_id">
                <Select
                  value={selectedCampusId}
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

            <div className="mb-5 w-full sm:w-[50%]">
              <Form.Item label="College" name="college_profile_id">
                <Select
                  value={selectedCollegeId}
                  onChange={handleCollegeChange}
                  className="w-full h-12 rounded-md border border-[#bfbfbf]"
                  disabled={!selectedCampusId}
                  options={colleges.map((college) => ({
                    value: college.id,
                    label: college.name,
                  }))}
                />
              </Form.Item>
            </div>

            <div className="mb-5 w-full sm:w-[50%]">
              <Form.Item label="Department" name="department_profile_id">
                <Select
                  value={formData.department_profile_id}
                  onChange={(value) =>
                    setFormData({ ...formData, department_profile_id: value })
                  }
                  className="w-full h-12 rounded-md border border-[#bfbfbf]"
                  disabled={!selectedCollegeId}
                  options={departments.map((department) => ({
                    value: department.id,
                    label: department.name,
                  }))}
                />
              </Form.Item>
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="mb-5">
            <Form.Item label="Name" name="name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Location" name="location">
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Job Title" name="job_title">
              <Input
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Skills" name="skills">
              <Input
                name="skills"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="About" name="about">
              <TextArea
                name="about"
                value={formData.about}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Phone" name="phone">
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Email" name="email">
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="LinkedIn" name="linkedin">
              <Input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Education Background" name="education_background">
              <TextArea
                name="education_background"
                value={formData.education_background}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Background Description"
              name="background_description"
            >
              <TextArea
                name="background_description"
                value={formData.background_description}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Languages" name="languages">
              <Input
                name="languages"
                value={formData.languages.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages: e.target.value.split(",").map((l) => l.trim()),
                  })
                }
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item
              label="Professional Experience"
              name="professional_experience"
            >
              <TextArea
                name="professional_experience"
                value={formData.professional_experience}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Key Responsibilities" name="key_responsibilities">
              <TextArea
                name="key_responsibilities"
                value={formData.key_responsibilities}
                onChange={handleChange}
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Publications" name="publications">
              <TextArea
                name="publications"
                value={formData.publications.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publications: e.target.value
                      .split(",")
                      .map((p) => p.trim()),
                  })
                }
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Form.Item label="Awards" name="awards">
              <TextArea
                name="awards"
                value={formData.awards.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    awards: e.target.value.split(",").map((a) => a.trim()),
                  })
                }
              />
            </Form.Item>
          </div>

          <div className="mb-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default LecturerForm;
