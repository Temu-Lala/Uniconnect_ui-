import React, { useRef } from "react";
import { Checkbox, Form, Input, Select } from "antd";
import { LecturerFormData } from "@/app/types/types";
import TextArea from "antd/es/input/TextArea";
import { availableSkills } from "@/app/data/data";
import Link from "next/link";

interface Props {
  formData: LecturerFormData;
  handleInputChange: (name: string, value: any) => void;
}

const AdditionalInfo: React.FC<Props> = ({ formData, handleInputChange }) => {
  const skillsSelectRef = useRef(null);
  return (
    <Form layout="vertical">
      <div className="mb-5">
        <Form.Item label="Skills">
          <Select
            ref={skillsSelectRef}
            mode="multiple"
            defaultValue={formData.skills}
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select your skills"
            onChange={(value) => handleInputChange("skills", value)}
            options={availableSkills.map((skill) => ({ value: skill }))}
            autoClearSearchValue={true}
            className="w-full h-12 rounded-md border border-[#bfbfbf]"
          />
        </Form.Item>
      </div>

      <div className="mb-5">
        <Form.Item
          label="About"
          name="about"
          tooltip="Little information or bio about you"
        >
          <TextArea
            name="about"
            value={formData.about}
            defaultValue={formData.about}
            onChange={(e) => handleInputChange("about", e.target.value)}
            placeholder="Write something about you"
            showCount
            rows={5}
            maxLength={100}
          />
        </Form.Item>
      </div>

      <div className="mb-5">
        <Form.Item label="Publications" name="publications">
          <TextArea
            name="publications"
            value={formData.publications.join(", ")}
            defaultValue={formData.publications.join(", ")}
            onChange={(e) =>
              handleInputChange(
                "publications",
                e.target.value.split(", ").map((a) => a.trim())
              )
            }
          />
        </Form.Item>
      </div>

      <div className="mb-5">
        <Form.Item label="Awards" name="awards">
          <TextArea
            name="awards"
            value={formData.awards.join(", ")}
            defaultValue={formData.awards.join(", ")}
            onChange={(e) =>
              handleInputChange(
                "awards",
                e.target.value.split(", ").map((a) => a.trim())
              )
            }
          />
        </Form.Item>
      </div>

      <div className="mb-5 h-5">
            <Checkbox >
              By creating a lecture profile on Uni-connect you're agreeing to
              our{" "}
              <Link href="#" className="text-blue-600">
                terms and conditions
              </Link>
              .
            </Checkbox>
          </div>
    </Form>
  );
};

export default AdditionalInfo;
