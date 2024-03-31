"use client"
import React, { useState } from 'react';
import { FaWindowClose } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";



interface Row {
  id: number;
  avatar: string;
  name: string;
  department: string;
  location: string; 
  jobTitle: string;
  skills1 :string;
  skills2 :string;
  skills3 :string;
  skills4 :string;
  About :string;
  phone : number;
  email : string;
  likedin : string;
  education_background: string;
  background_description : string;
  education_background2: string;
  background_description2 : string;
  education_background3: string;
  background_description3 : string;

  languages : string;
  languages2 : string;
  languages3 : string;
  professional_experience: string;
  professional_experience2: string;
  professional_experience3: string;
  key_responsibilities : string;
  key_responsibilities2 : string;
  key_responsibilities3 : string;


  project1: string;
  project_description1 : string;
  project2: string;
  project_description2 : string;

  project3: string;
  project_description3 : string;


  










}

export default function Page() {
  const [data] = useState<Row[]>([
    {
      id: 1,
      avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: " Temesgen Teshome",
      department: "Software Enginering",
      location: "Debrebrhan",
      jobTitle: "Lecturer",
      skills1 :" Html",
      skills2 :"Css ",
      skills3 :"JS",
      skills4 :"React",
      About :"To get a career opportunity which would help me to utilize my academic background to assist me to gain experience, employ my excellent skills, and enable me to make positive contribution.",
      phone : +251914490662,
      likedin : "https/linkedin.com",
      email : "lala@gmail.com",
      education_background: "(INFORMATION TECHNOLOGY)",
      background_description : "A platform to sell as well as to buy used books only for PCCoE College due to this reuse of books wi",
      
    

      education_background2: "HSC, RAJARSHI SHAHU COLLEGE, LATUR",
      background_description2 : "A platform to sell as well as to buy used books only for PCCoE College due to this reuse of books wi",
      education_background3: "SSC, DNYANESHWAR HIGH SCHOOL, LATUR",
      background_description3 : "A platform to sell as well as to buy used books only for PCCoE College due to this reuse of books wi",
      languages : "English",
      languages2 : "Amharic",
      languages3 : " oromifa",
      professional_experience: "software development at dbu ",
      professional_experience2: "software development at dbu ",
      professional_experience3: "software development at dbu ",
      key_responsibilities : "software development at dbu ",
      key_responsibilities2 : "software development at dbu ",
      key_responsibilities3 : "software development at dbu ",
    
    
      project1: " dbu student info",
      project_description1 : " best description ",
      project2: " dbu lecter ui ",
      project_description2 : " best description ",

      project3: " serche alakm ",
      project_description3 : " best description ",

    
      
    
     
    },
  
  ]);

  const topThreeRows = data.slice(0, 10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const openModal = (row: Row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Department</th>
            <th>See Detail</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {topThreeRows.map((row) => (
            <tr key={row.id}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={row.avatar} alt="Avatar" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{row.name}</div>
                  </div>
                </div>
              </td>
              <td>{row.department}</td>
              <th>
                <button onClick={() => openModal(row)} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
                  Details
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showModal && selectedRow && (
        <div className="fixed  inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={closeModal}></div>
          <div className=" scrollbar-hide bg-black w-full sm:w-3/4 md:w-3/4 lg:w-3/4 xl:w-3/4 h-screen overflow-y-scroll  rounded shadow-lg z-50">
            <div className="flex justify-between items-center">
              <button className="w-12 h-12" onClick={closeModal}><FaWindowClose className="w-6 h-6 bg-red-600 text-black" /></button>
            </div>
            <div className=" flex border ">

<div className="border-1 shadow-lg shadow-gray-700 rounded-lg">

    <div className="flex rounded-t-lg bg-top-color sm:px-2">
        <div className="h-40 w-40 overflow-hidden sm:rounded-full sm:relative sm:p-0 top-10 left-5 p-3">
            <img src={selectedRow.avatar}/>
        </div>

        <div className="w-2/3 sm:text-center pl-5 mt-10 text-start">
            <p className="font-poppins font-bold text-heading sm:text-4xl text-2xl">
            {selectedRow.name}
            </p>
            <p className="text-heading">{selectedRow.department}</p>
        </div>

    </div>

    <div className="p-5">

        <div className="flex flex-col sm:flex-row sm:mt-10">

            <div className="flex flex-col sm:w-1/3">
                <div className="py-3 sm:order-none order-3">
                    <h2 className="text-lg font-poppins font-bold text-top-color"> Contact  Me</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div>
                        <div className="flex items-center my-1">
                            <a className="w-6 text-gray-700 hover:text-orange-600"><FaLinkedin/>
                            </a>
                            <div className="ml-2 truncate">{selectedRow.likedin}</div>
                        </div>
                        <div className="flex items-center my-1">
                            <a className="w-6 text-gray-700 hover:text-orange-600"
                                aria-label="Visit TrendyMinds YouTube" href="" target="_blank"><FaPhoneAlt/>
                            </a>
                            <div>{selectedRow.phone}</div>
                        </div>
                     
                        <div className="flex items-center my-1">
                            <a className="w-6 text-gray-700 hover:text-orange-600"
                                aria-label="Visit TrendyMinds Twitter" href="" target="_blank">
                                    <MdEmail/>
                            </a>
                            <div>{selectedRow.email}</div>
                        </div>

                    </div>
                </div>
                <div className="py-3 sm:order-none order-2">
                    <h2 className="text-lg font-poppins font-bold text-top-color">Skills</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div>
                        <div className="flex items-center my-1">
                          
                            <div className="ml-2">{selectedRow.skills1}</div>
                        </div>
                        <div className="flex items-center my-1">
                           
                            <div className="ml-2">{selectedRow.skills2}</div>
                        </div>
                        <div className="flex items-center my-1">
                         
                            <div className="ml-2">{selectedRow.skills3}</div>
                        </div>
                        <div className="flex items-center my-1">
                          
                            <div className="ml-2">{selectedRow.skills4}</div>
                        </div>

                    </div>
                </div>
                <div className="py-3 sm:order-none order-1">
                    <h2 className="text-lg font-poppins font-bold text-top-color">Education Background</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div className="flex flex-col space-y-1">

                        <div className="flex flex-col">
                            <p className="text-sm font-medium">
                                <span className="text-green-700"> {selectedRow.education_background}</span>, {selectedRow.background_description}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium"><span className="text-green-700">{selectedRow.education_background2}</span>, {selectedRow.background_description2}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium"><span className="text-green-700">{selectedRow.education_background3}</span>, {selectedRow.background_description3}</p>
                        </div>

                    </div>
                </div>


                <div className="py-3 sm:order-none order-1">
                    <h2 className="text-lg font-poppins font-bold text-top-color">Languages</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div className="flex flex-col space-y-1">

                        <div className="flex flex-col">
                            <p className="text-sm font-medium">
                               {selectedRow.languages}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium">  {selectedRow.languages2}
                               </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium">  {selectedRow.languages3}
                               </p>
                        </div>
                     

                    </div>
                </div>

            </div>


            <div className="flex flex-col sm:w-2/3 order-first sm:order-none sm:-mt-10">

                <div className="py-3">
                    <h2 className="text-lg font-poppins font-bold text-top-color">About Me</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>
                    <p>{selectedRow.About}</p>
                </div>

                <div className="py-3">
                    <h2 className="text-lg font-poppins font-bold text-top-color">Professional Experience</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div className="flex flex-col">

                        <div className="flex flex-col">
                            <p className="text-lg font-bold">{selectedRow.professional_experience}</p>
                            <p className="font-semibold text-sm ">2021 - Present</p>
                            <p className="font-semibold text-sm mt-2 mb-1">Key Responsibilities</p>
                            <ul className="text-sm list-disc pl-4 space-y-1">
                                <li>{selectedRow.key_responsibilities}</li>
                                <li>{selectedRow.key_responsibilities2}</li>
                                <li>{selectedRow.key_responsibilities3}</li>
                            </ul>
                        </div>

                      
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">{selectedRow.professional_experience}</p>
                            <p className="font-semibold text-sm ">2021 - Present</p>
                            <p className="font-semibold text-sm mt-2 mb-1">Key Responsibilities</p>
                            <ul className="text-sm list-disc pl-4 space-y-1">
                                <li>{selectedRow.key_responsibilities}</li>
                                <li>{selectedRow.key_responsibilities2}</li>
                                <li>{selectedRow.key_responsibilities3}</li>
                            </ul>
                        </div>

                    </div>

                </div>

                <div className="py-3">
                    <h2 className="text-lg font-poppins font-bold text-top-color">Projects</h2>
                    <div className="border-2 w-20 border-top-color my-3"></div>

                    <div className="flex flex-col">

                        <div className="flex flex-col">
                            <p className="text-lg font-semibold ">{selectedRow.project1}</p>
                            <p className="font-normal text-sm  mb-1 pl-2"> {selectedRow.project_description1}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-semibold ">{selectedRow.project2}</p>
                            <p className="font-normal text-sm  mb-1 pl-2"> {selectedRow.project_description2} </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>

    </div>

</div>

</div>
{/* <button onClick={closeModal} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
                  Close 
                </button> */}
          </div>
       
        </div>
      )}
    </div>
  );
}
