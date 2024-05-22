"use client";

import React, { useState } from "react";
import axios from 'axios'
import { Button, message, Steps } from "antd";
import PersonalInfo from "./PersonalInfo";
import UniversityInfo from "./UniversityInfo";
import AdditionalInfo from "./AdditionalInfo";
import {
  LecturerFormData,
  LecturerFormDataPath,
  initialLectureFormData,
} from "@/app/types/types";

const { Step } = Steps;

const steps = [
  {
    title: 'Personal Information',
    content: (props: any) => <PersonalInfo {...props} />,
  },
  {
    title: 'University/Professional Information',
    content: (props: any) => <UniversityInfo {...props} />,
  },
  {
    title: 'Additional Information',
    content: (props: any) => <AdditionalInfo {...props} />,
  },
];

const LectureForm: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<LecturerFormData>(initialLectureFormData);

  const handleInputChange = (name: LecturerFormDataPath, value: any) => {
    setFormData((prevFormData) => {
      const keys = name.split('.') as (keyof LecturerFormData)[];
      const newFormData = { ...prevFormData };

      keys.reduce((acc: any, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = value;
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, newFormData);

      return newFormData;
    });
  };

  const handleSubmit = async (e: any) => {
    //e.preventDefault()
    //const authToken = localStorage.getItem('token');
    // try {
    //   // Submit the form data to the endpoint
    //   await axios.post('http://127.0.0.1:8000/create-lecturer-cv/', formData, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${authToken}`
    //     },
    //   });
    //   message.success('Lecture profile request sent successfully!');
    // } catch (error) {
    //   console.log("Error creting lecturer profile")
    //   message.error('Failed to register lecture profile. Please try again.');
    // }

    console.log("Submitted lecture data : ", formData)
  };

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <section className="w-11/12 sm:w-9/12">
      <div className="my-5">
        <h2 className="text-lg font-bold text-black text-center">
          Create a Lecturer Profile
        </h2>
      </div>
      <Steps current={current} className="w-full sm:w-10/12 p-2 mx-auto">
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
   

      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-11/12 sm:w-9/12 px-5 py-2 shadow-xl mx-auto">
          <div className="steps-content">
            {steps[current].content({ formData, handleInputChange })}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next} className="btn bg-blue-600 border-0 text-white">
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit} className="btn">
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev} className="btn btn-outline">
              Previous
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default LectureForm;
