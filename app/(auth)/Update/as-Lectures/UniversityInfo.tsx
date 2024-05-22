import React, { useEffect, useState } from "react";
import axios from "axios";
import { AutoComplete, Button, DatePicker, Form, Input, Select } from "antd";
import { LecturerFormData } from "@/app/types/types";
import { availableFields, degreeTypes } from "@/app/data/data";

interface Props {
  formData: LecturerFormData;
  handleInputChange: (name: string, value: any) => void;
}

const UniversityInfo: React.FC<Props> = ({ formData, handleInputChange }) => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");

  const [selectedUniversityName, setSelectedUniversityName] = useState<string>('');
  const [selectedCampusName, setSelectedCampusName] = useState<string>('');
  const [selectedCollegeName, setSelectedCollegeName] = useState<string>('');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>('');

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

  const handleUniversityChange = (value: string) => {
    const selectedUniversity = universities.find(university => university.id === value);
    setSelectedUniversityId(value);
    setSelectedUniversityName(selectedUniversity ? selectedUniversity.name : '');
    handleInputChange("university_id", value);

    setSelectedCampusId("");
    setSelectedCollegeId("");
    setSelectedDepartmentName('');
    setCampuses([]);
    setColleges([]);
    setDepartments([]);
  };

  const handleCampusChange = (value: string) => {
    const selectedCampus = campuses.find(campus => campus.id === value);
    setSelectedCampusId(value);
    setSelectedCampusName(selectedCampus ? selectedCampus.name : '');
    handleInputChange("campus_profile_id", value);
    setSelectedCollegeId("");
    setSelectedDepartmentName('');
    setColleges([]);
    setDepartments([]);
  };

  const handleCollegeChange = (value: string) => {
    const selectedCollege = colleges.find(college => college.id === value);
    setSelectedCollegeId(value);
    handleInputChange("college_profile_id", value);
    setSelectedCollegeName(selectedCollege ? selectedCollege.name : '');
    setSelectedDepartmentName('');
    setDepartments([]);
  };

  const handleDepartmentChange = (value: string) => {
    const selectedDepartment = departments.find(department => department.id === value);
    setSelectedDepartmentName(selectedDepartment ? selectedDepartment.name : '');
    handleInputChange("department_profile_id", value );
  };



  return (
    <Form layout="vertical">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mb-5 w-full">
          <Form.Item
            label="University" 
            name="university_id"
            rules={[{ required: true, message: "Please select a university!" }]}
          >
            <Select
              value={selectedUniversityName}
              defaultValue={selectedUniversityName}
              onChange={handleUniversityChange}
              className="w-full h-12 rounded-md border border-[#bfbfbf]"
              options={universities.map((university) => ({
                value: university.id,
                label: university.name,
              }))}
            />
          </Form.Item>
        </div>

        <div className="mb-5 w-full">
          <Form.Item
            label="Campus"
            name="campus_profile_id"
            rules={[{ required: true, message: "Please select campus!" }]}
          >
            <Select
              value={selectedCampusName}
              defaultValue={selectedCampusName}
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

        <div className="mb-5 w-full">
          <Form.Item
            label="College"
            name="college_profile_id"
            rules={[{ required: true, message: "Please select college!" }]}
          >
            <Select
              value={selectedCollegeName}
              defaultValue={selectedCollegeName}
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

        <div className="mb-5 w-full">
          <Form.Item
            label="Department"
            name="department_profile_id"
            rules={[{ required: true, message: "Please select a department!" }]}
          >
            <Select
              value={selectedDepartmentName}
              defaultValue={selectedDepartmentName}
              onChange={handleDepartmentChange}
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

      <div className="mb-4 flex flex-col sm:flex-row gap-4 ">
        <Form.Item
          name="field"
          label="Field of Study"
          tooltip="The area you studied at university"
          className="flex-1"
          rules={[
            {
              required: true,
              message: "Please input your job name!",
              whitespace: true,
            },
          ]}
        >
          <AutoComplete
            showSearch
            value={formData.field}
            defaultValue={formData.field}
            onChange={(value) => handleInputChange("field", value)}
            options={availableFields.map((field) => ({ value: field }))}
            style={{ width: "100%" }}
            className="w-full h-12 rounded-md border border-[#bfbfbf]"
            placeholder="Type to search for your field of study"
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label={`Year you joined ${selectedUniversityId}`}
          name="date_joined"
          tooltip="The date you joined the university as a lecturer."
          className="flex-1"
          rules={[
            {
              required: true,
              message: "Please input the date you joined!",
            },
          ]}
        >
          <DatePicker
            name="date_joined"
            defaultValue={formData.date_joined}
            value={formData.date_joined}
            onChange={(value) => handleInputChange("date_joined", value)}
            className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
          />
        </Form.Item>
      </div>

      <div className="mb-5">
        <Form.Item
          label="Course teaching"
          name="course_taught"
          tooltip="Specific subjects or courses curently lecturing, use comma to separate courses"
          className="flex-1"
          rules={[
            {
              required: true,
              message: "Please input course(s) you thought!",
              whitespace: true,
            },
          ]}
        >
          <Input  
            name="course_taught"
            value={formData.courses_taught.join(', ')}
            defaultValue={formData.courses_taught.join(', ')}
            onChange={(e) =>
              handleInputChange(
                "courses_taught",
                e.target.value.split(",").map(course => course.trim())
              )
            }
            placeholder="Ex. Machine learning, Artificial Intelegence"
            className="w-full rounded-md border border-[#bfbfbf] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
          />
        </Form.Item>
      </div>
      <Form.List name="education_background">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div key={field.key} className="p-4 shadow-md mb-2">
                <Form.Item label="School" name={[field.name, 'school']} rules={[{ required: true, message: 'Please input your school!' }]}>
                  <Input onChange={(e) => handleInputChange(`education_background[${field.name}].school`, e.target.value)} />
                </Form.Item>
                <Form.Item label="Degree" name={[field.name, 'degree']}  rules={[{ required: true, message: 'Please input your degree!' }]}>
                  <AutoComplete
                    onChange={(value) => handleInputChange(`education_background[${field.name}].degree`, value)}
                    options={degreeTypes.map((degree) => ({ value: degree }))}
                    placeholder="Select degree"
                  />
                </Form.Item>
                <Form.Item label="Field of Study" name={[field.name, 'fieldOfStudy']}  rules={[{ required: true, message: 'Please input your field of study!' }]}>
                  <AutoComplete
                    onChange={(value) => handleInputChange(`education_background[${field.name}].fieldOfStudy`, value)}
                    options={availableFields.map((field) => ({ value: field }))}
                    placeholder="Type to search for your field of study"
                  />
                </Form.Item>
                <Form.Item label="Year finished" name={[field.name, 'year_finished']}  rules={[{ required: true, message: 'Please input the year!' }]}>
                  <Input type="date" onChange={(e) => handleInputChange(`education_background[${field.name}].year_finished`, e.target.value)} />
                </Form.Item>
                <Button onClick={() => remove(field.name)}>Remove</Button>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add Educational Background
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <div className="h-5"></div>

      <Form.List name="professional_experience">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div key={field.key} className="p-4 shadow-md mb-2">
                <Form.Item label="Position Name" name={[field.name, 'positionName']}  rules={[{ required: true, message: 'Please input your position!' }]}>
                  <Input onChange={(e) => handleInputChange(`professional_experience[${field.name}].positionName`, e.target.value)} />
                </Form.Item>
                <Form.Item label="Company" name={[field.name, 'company']}  rules={[{ required: true, message: 'Please input the company!' }]}>
                  <Input onChange={(e) => handleInputChange(`professional_experience[${field.name}].company`, e.target.value)} />
                </Form.Item>
                <Form.Item label="Start Date" name={[field.name, 'start_date']}  rules={[{ required: true, message: 'Please input the start date!' }]}>
                  <Input type="date" onChange={(e) => handleInputChange(`professional_experience[${field.name}].start_date`, e.target.value)} />
                </Form.Item>
                <Form.Item label="End Date" name={[field.name, 'end_date']} >
                  <Input type="date" onChange={(e) => handleInputChange(`professional_experience[${field.name}].end_date`, e.target.value)} />
                </Form.Item>
                <Button onClick={() => remove(field.name)}>Remove</Button>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add Professional Experience
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      
    </Form>
  );
};

export default UniversityInfo;
