'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

export default function Lectures() {
  const [formData, setFormData] = useState({
    avatar: null,
    name: '',
    department: '',
    location: '',
    job_title: '',
    skills1: '',
    skills2: '',
    skills3: '',
    skills4: '',
    about: '',
    phone: '',
    email: '',
    linkedin: '',
    education_background: '',
    background_description: '',
    education_background2: '',
    background_description2: '',
    education_background3: '',
    background_description3: '',
    languages: '',
    languages2: '',
    languages3: '',
    professional_experience: '',
    professional_experience2: '',
    professional_experience3: '',
    key_responsibilities: '',
    key_responsibilities2: '',
    key_responsibilities3: '',
    project1: '',
    project_description1: '',
    project2: '',
    project_description2: '',
    project3: '',
    project_description3: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/lecturer-cv/', formDataToSend);
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-cream text-white min-h-screen font-sans leading-normal overflow-x-hidden lg:overflow-auto">
      <main className="flex-1 md:p-0 lg:pt-8 lg:px-8 md:ml-24 flex flex-col">
        <section className="bg-cream-lighter p-4 shadow">
          <div className="md:flex">
            <h2 className="md:w-1/3 uppercase tracking-wide text-sm sm:text-lg mb-6">Create Your CV</h2>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-1 px-3 text-center">
              <div className="button w-36 h-36 border-2 hover:border-yellow-500 text-cream mx-auto relative cursor-pointer rounded-xl bg-transparent">
                <input
                  className="opacity-0 w-36 h-36 absolute cursor-pointer text-black"
                  type="file"
                  name="avatar"
                  onChange={handleImageChange}
                />
                {formData.avatar ? (
                  <img className="w-36 h-36 object-cover rounded-xl" src={URL.createObjectURL(formData.avatar)} alt="Selected" />
                ) : (
                  <span>Profile</span>
                )}
              </div>
            </div>
            <div className="md:flex mb-8">
              <div className="md:w-1/3">
                <legend className="uppercase tracking-wide text-sm">Contact</legend>
                <p className="text-xs font-light text-red">This entire section is required.</p>
                <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
                  <div className="mb-4">
                    <label className="block uppercase tracking-wide text-xs font-bold">Phone</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="tel" name="phone" placeholder="+2519999999" onChange={handleInputChange} />
                  </div>
                  <div className="mb-4">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">URL (Portfolio,Linkedin )</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="url" name="linkedin" placeholder="https://linkedin.com" onChange={handleInputChange} />
                  </div>
                  <div className="mb-4">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Email</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="email" name="email" placeholder="uniconnect@gmail.com" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
                <div className="mb-4">
                  <label className="block uppercase tracking-wide text-xs font-bold"> Full Name</label>
                  <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="name" placeholder="Name" onChange={handleInputChange} />
                </div>
                <div className="md:flex mb-4">
                  <div className="md:flex-1 md:pr-3">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Department</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="department" placeholder="Department" onChange={handleInputChange} />
                  </div>
                  <div className="md:flex-1 md:pl-3">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Bio.</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="about" placeholder="Bio" onChange={handleInputChange} />
                    <span className="text-xs mb-4 font-thin">Please check</span>
                  </div>
                </div>
                <div className="md:flex mb-4">
                  <div className="md:flex-1 md:pr-3">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Location</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="location" placeholder="Location" onChange={handleInputChange} />
                  </div>
                  <div className="md:flex-1 md:pl-3">
                    <label className="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">Job Title</label>
                    <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="job_title" placeholder="Job Title" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Education</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Education Background</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="education_background" placeholder="Education Background" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Background Description</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="background_description" placeholder="Background Description" onChange={handleInputChange}></textarea>
      </div>
    </div>
  </div>
</div>
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Contact</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Phone</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">URL (Portfolio, Linkedin)</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="url" name="linkedin" placeholder="URL (Portfolio, Linkedin)" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Email</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="email" name="email" placeholder="Email" onChange={handleInputChange} />
      </div>
    </div>
  </div>
</div>

{/* Skills Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Skills</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Skill 1</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="skills1" placeholder="Skill 1" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Skill 2</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="skills2" placeholder="Skill 2" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Skill 3</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="skills3" placeholder="Skill 3" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Skill 4</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="skills4" placeholder="Skill 4" onChange={handleInputChange} />
      </div>
    </div>
  </div>
</div>
{/* Skills Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Skills</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Language 1</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="languages" placeholder="Language 1" value={formData.languages} onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Language 2</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="languages2" placeholder="Language 2" value={formData.languages2} onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Language 3</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="languages3" placeholder="Language 3" value={formData.languages3} onChange={handleInputChange} />
      </div>
    </div>
  </div>
</div>

{/* Professional Experience Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Professional Experience</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Experience 1</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="professional_experience" placeholder="Experience 1" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Experience 2</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="professional_experience2" placeholder="Experience 2" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Experience 3</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="professional_experience3" placeholder="Experience 3" onChange={handleInputChange} />
      </div>
    </div>
  </div>
</div>

{/* Key Responsibilities Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Key Responsibilities</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Responsibilities 1</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="key_responsibilities" placeholder="Responsibilities 1" onChange={handleInputChange}></textarea>
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Responsibilities 2</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="key_responsibilities2" placeholder="Responsibilities 2" onChange={handleInputChange}></textarea>
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Responsibilities 3</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="key_responsibilities3" placeholder="Responsibilities 3" onChange={handleInputChange}></textarea>
      </div>
    </div>
  </div>
</div>

{/* Projects Section */}
<div className="md:flex mb-8">
  <div className="md:w-1/3">
    <legend className="uppercase tracking-wide text-sm">Projects</legend>
    <p className="text-xs font-light text-red">This entire section is required.</p>
    <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project 1</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="project1" placeholder="Project 1" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project Description 1</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="project_description1" placeholder="Project Description 1" onChange={handleInputChange}></textarea>
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project 2</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="project2" placeholder="Project 2" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project Description 2</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="project_description2" placeholder="Project Description 2" onChange={handleInputChange}></textarea>
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project 3</label>
        <input className="w-full shadow-inner p-4 border-0 text-black" type="text" name="project3" placeholder="Project 3" onChange={handleInputChange} />
      </div>
      <div className="mb-4">
        <label className="block uppercase tracking-wide text-xs font-bold">Project Description 3</label>
        <textarea className="w-full shadow-inner p-4 border-0 text-black" name="project_description3" placeholder="Project Description 3" onChange={handleInputChange}></textarea>
      </div>
    </div>
  </div>
</div>

            <div className="md:flex mb-6 border  border-t-1 border-b-0 border-x-0 border-cream-dark">
              <div className=" md:flex-1 px-3 text-center md:text-right">
                <input className="button text-cream-lighter text-white bg-brick hover:bg-brick-dark cursor-pointer w-32 h-12 rounded-xl border-white border hover:bg-slate-500 hover" type="submit" value="Submit Form" />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
