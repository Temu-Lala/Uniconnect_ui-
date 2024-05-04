// components/NewCampusProfileForm.js
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewCampusProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    link: '',
    establishment_date: '',
    number_of_lectures: 0,
    number_of_departments: 0,
    number_of_campuses: 0,
    number_of_colleges: 0,
    about: '',
    location: '',
    group: '',
    university_profile_id: '',
    universities: [],
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (authToken) {
          const response = await axios.get('http://127.0.0.1:8000/university-profiles/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
          });
          setFormData(prevFormData => ({
            ...prevFormData,
            universities: response.data
          }));
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');
      if (authToken) {
        const response = await axios.post('http://127.0.0.1:8000/campus_profiles/', formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
        console.log('Campus profile created:', response.data);
        
        setFormData({
          name: '',
          bio: '',
          link: '',
          establishment_date: '',
          number_of_lectures: 0,
          number_of_departments: 0,
          number_of_campuses: 0,
          number_of_colleges: 0,
          about: '',
          location: '',
          group: '',
          university_profile_id: '',
          universities: [],
        });
      }
    } catch (error) {
      console.error('Error creating campus profile:', error);
    }
  };

  return (
    <div className=' pt-96'>
      <h2>Create Campus Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <label>
          Link:
          <input type="text" name="link" value={formData.link} onChange={handleChange} />
        </label>
        <label>
          Establishment Date:
          <input type="date" name="establishment_date" value={formData.establishment_date} onChange={handleChange} />
        </label>
        <label>
          Number of Lectures:
          <input type="number" name="number_of_lectures" value={formData.number_of_lectures} onChange={handleChange} />
        </label>
        <label>
          Number of Departments:
          <input type="number" name="number_of_departments" value={formData.number_of_departments} onChange={handleChange} />
        </label>
        <label>
          Number of Campuses:
          <input type="number" name="number_of_campuses" value={formData.number_of_campuses} onChange={handleChange} />
        </label>
        <label>
          Number of Colleges:
          <input type="number" name="number_of_colleges" value={formData.number_of_colleges} onChange={handleChange} />
        </label>
        <label>
          About:
          <textarea name="about" value={formData.about} onChange={handleChange} />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </label>
        <label>
          Group:
          <input type="text" name="group" value={formData.group} onChange={handleChange} />
        </label>
        <label>
          University:
          <select name="university_profile_id" value={formData.university_profile_id} onChange={handleChange}>
  <option value="">Select University</option>
  {formData.universities?.map(university => (
    <option key={university.id} value={university.id}>{university.name}</option>
  ))}
</select>
        </label>
        <button type="submit">Create Campus Profile</button>
      </form>
    </div>
  );
};

export default NewCampusProfileForm;
























































// 'use client'
// import React, { useState, ChangeEvent } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface FormData {
//   phone: string;
//   url: string;
//   email: string;
//   name: string;
//   bio: string;
//   username: string;
//   webpage: string;
//   establishmentYear: Date | null;
//   campus: string;
//   department: string;
//   collage: string;
//   lectures: string;
//   lab: string;
//   library: string;
//   education: string;
//   experience: string;
// }

// export default function Department() {
  
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
//   const [url, setUrl] = useState<string>('https://www.google.com/maps/@9.1216656,35.2042579,6z?hl=am&entry=ttu');
//   const [savedUrl, setSavedUrl] = useState<string>('');

//   const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
//     setUrl(event.target.value);
//   };

//   const handleOpenMap = () => {
//     window.open(url, '_blank');
//   };

//   const handleSaveUrl = () => {
//     const iframeUrl = extractIframeUrl(url);
//     setSavedUrl(iframeUrl);
//   };

//   const extractIframeUrl = (iframeCode: string): string => {
//     const regex = /src="([^"]+)"/;
//     const match = regex.exec(iframeCode);
//     if (match && match[1]) {
//       return match[1];
//     }
//     return '';
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setSelectedImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setSelectedCoverImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const [formData, setFormData] = useState<FormData>({
//     phone: '',
//     url: '',
//     email: '',
//     name: '',
//     bio: '',
//     username: '',
//     webpage: '',
//     establishmentYear: null,
//     campus: '',
//     department: '',
//     collage: '',
//     lectures: '',
//     lab: '',
//     library: '',
//     education: '',
//     experience: ''
//   });

//   const [errors, setErrors] = useState({
//     phone: '',
//     url: '',
//     email: '',
//     name: '',
//     bio: '',
//     username: '',
//     webpage: '',
//     establishmentYear: '',
//     campus: '',
//     department: '',
//     collage: '',
//     lectures: '',
//     lab: '',
//     library: '',
//     education: '',
//     experience: ''
//   });

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleDateChange = (date: Date | null) => {
//     setFormData({
//       ...formData,
//       establishmentYear: date
//     });
//   };

//   const handleSubmit = (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     const validationErrors = validateForm(formData);
//     if (Object.keys(validationErrors).length === 0) {
//       console.log('Form data:', formData);
//     } else {
//       setErrors(validationErrors);
//     }
//   };

//   const validateForm = (data: FormData) => {
//     const errors: Partial<FormData> = {};

//     if (!data.phone) {
//       errors.phone = 'Phone number is required';
//     }
//     if (!data.url) {
//       errors.url = 'URL is required';
//     }
//     if (!data.email) {
//       errors.email = 'Email is required';
//     } else if (!isValidEmail(data.email)) {
//       errors.email = 'Invalid email address';
//     }
//     if (!data.name) {
//       errors.name = 'University Full Name is required';
//     }
//     if (!data.bio) {
//       errors.bio = 'Bio is required';
//     }
//     if (!data.username) {
//       errors.username = 'Username is required';
//     }
//     if (!data.webpage) {
//       errors.webpage = 'Webpage is required';
//     }
//     if (!data.establishmentYear) {
//       errors.establishmentYear = 'Establishment year is required';
//     }
//     if (!data.campus) {
//       errors.campus = 'Number of campus is required';
//     }
//     if (!data.department) {
//       errors.department = 'Number of departments is required';
//     }
//     if (!data.collage) {
//       errors.collage = 'Number of collages is required';
//     }
//     if (!data.lectures) {
//       errors.lectures = 'Number of lectures is required';
//     }
//     if (!data.lab) {
//       errors.lab = 'Number of labs is required';
//     }
//     if (!data.library) {
//       errors.library = 'Number of libraries is required';
//     }
//     if (!data.education) {
//       errors.education = 'Education details are required';
//     }
//     if (!data.experience) {
//       errors.experience = 'Experience details are required';
//     }

//     return errors;
//   };

//   const isValidEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   return (
//     <div className="bg-cream text-white min-h-screen font-sans leading-normal overflow-x-hidden lg:overflow-auto">
//       <main className="flex-1 md:p-0 lg:pt-8 lg:px-8 md:ml-24 flex flex-col">
//         <section className="bg-cream-lighter p-4 shadow">
//           <div className="md:flex">
//             <h2 className="md:w-1/3 uppercase tracking-wide text-sm sm:text-lg mb-6">Create University Profile</h2>
//           </div>
//           <form onSubmit={handleSubmit} method='post' >
//             <div className="flex flex-1 px-3 text-center">
//               <div className="button w-36 h-36 border-2 hover:border-yellow-500 text-cream mx-auto relative cursor-pointer rounded-xl bg-transparent">
//                 <input
//                   className="opacity-0 w-36 h-36 absolute cursor-pointer text-black"
//                   type="file"
//                   name="profile"
//                   onChange={handleImageChange}
//                 />
//                 {selectedImage ? (
//                   <img className="w-36 h-36 object-cover rounded-xl" src={selectedImage} alt="Selected" />
//                 ) : (
//                   <span>Cover Photo</span>
//                 )}
//               </div>
//               <div className="button w-36 h-36 border-2 hover:border-yellow-500 text-cream mx-auto relative cursor-pointer rounded-xl bg-transparent">
//                 <input
//                   className="opacity-0 w-36 h-36 absolute cursor-pointer text-black"
//                   type="file"
//                   name="profile"
//                   onChange={handleImageCoverChange}
//                 />
//                 {selectedCoverImage ? (
//                   <img className="w-36 h-36 object-cover rounded-xl" src={selectedCoverImage} alt="Selected" />
//                 ) : (
//                   <span>Profile</span>
//                 )}
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Phone</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="tel"
//                 name="phone"
//                 placeholder="+2519999999"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//               {errors.phone && <p className="text-red-500">{errors.phone}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">URL (Portfolio, Linkedin)</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="url"
//                 name="url"
//                 placeholder="https://linkedin.com"
//                 value={formData.url}
//                 onChange={handleInputChange}
//               />
//               {errors.url && <p className="text-red-500">{errors.url}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Email</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="email"
//                 name="email"
//                 placeholder="uniconnect@gmail.com"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//               {errors.email && <p className="text-red-500">{errors.email}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">University Full Name</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//               />
//               {errors.name && <p className="text-red-500">{errors.name}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Bio</label>
//               <textarea
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 name="bio"
//                 placeholder="Enter your text here..."
//                 value={formData.bio}
//                 onChange={handleInputChange}
//               />
//               {errors.bio && <p className="text-red-500">{errors.bio}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">University Username</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="text"
//                 name="username"
//                 placeholder="@uniconnect"
//                 value={formData.username}
//                 onChange={handleInputChange}
//               />
//               {errors.username && <p className="text-red-500">{errors.username}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">University Webpage</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="url"
//                 name="webpage"
//                 placeholder="http://uniconnectethiopia.com"
//                 value={formData.webpage}
//                 onChange={handleInputChange}
//               />
//               {errors.webpage && <p className="text-red-500">{errors.webpage}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Established Year</label>
//               <DatePicker
//                 selected={formData.establishmentYear}
//                 onChange={handleDateChange}
//                 placeholderText="Select a date"
//                 dateFormat="MM/dd/yyyy"
//                 className="w-full shadow-inner p-4 border-0 text-black"
//               />
//               {errors.establishmentYear && <p className="text-red-500">{errors.establishmentYear}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Numbers Of Campus</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="campus"
//                 placeholder="12 Campus"
//                 value={formData.campus}
//                 onChange={handleInputChange}
//               />
//               {errors.campus && <p className="text-red-500">{errors.campus}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Numbers Of Department</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="department"
//                 placeholder="12 Department"
//                 value={formData.department}
//                 onChange={handleInputChange}
//               />
//               {errors.department && <p className="text-red-500">{errors.department}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Numbers Of Collage</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="collage"
//                 placeholder="12 Collage"
//                 value={formData.collage}
//                 onChange={handleInputChange}
//               />
//               {errors.collage && <p className="text-red-500">{errors.collage}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Numbers Of Lectures</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="lectures"
//                 placeholder="12 Lectures"
//                 value={formData.lectures}
//                 onChange={handleInputChange}
//               />
//               {errors.lectures && <p className="text-red-500">{errors.lectures}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Total Numbers Of Lab</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="lab"
//                 placeholder="12 Lab"
//                 value={formData.lab}
//                 onChange={handleInputChange}
//               />
//               {errors.lab && <p className="text-red-500">{errors.lab}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Total Numbers Of Library</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="number"
//                 name="library"
//                 placeholder="12 Library"
//                 value={formData.library}
//                 onChange={handleInputChange}
//               />
//               {errors.library && <p className="text-red-500">{errors.library}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Education</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="text"
//                 name="education"
//                 placeholder="Education"
//                 value={formData.education}
//                 onChange={handleInputChange}
//               />
//               {errors.education && <p className="text-red-500">{errors.education}</p>}
//             </div>
//             <div className="mb-4">
//               <label className="block uppercase tracking-wide text-xs font-bold">Experience</label>
//               <input
//                 className="w-full shadow-inner p-4 border-0 text-black"
//                 type="text"
//                 name="experience"
//                 placeholder="Experience"
//                 value={formData.experience}
//                 onChange={handleInputChange}
//               />
//               {errors.experience && <p className="text-red-500">{errors.experience}</p>}
//             </div>






//             <div className="flex  flex-col lg:flex-row  ">
//       <div className="lg:w-1/3 w-full  p-8  bg-transparent">
//         <div className="mb-8 ">
//           <label className="block mb-2 text-gray-700 font-semibold">Google Maps URL:</label>
//           <textarea
//             className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             type="text"
//             onChange={handleChange}
//             placeholder="Enter Google Maps URL"
//             rows={20}
//             cols={10}
//           ></textarea>
//         </div>
//         <div>
//           <button
//             onClick={handleOpenMap}
//             className="w-full px-8 py-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
//           >
//             Open Google Maps
//           </button>
//         </div>
//         <div className="mt-8">
//           <button
//             onClick={handleSaveUrl}
//             className="w-full px-8 py-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
//           >
//             Save Map
//           </button>
//         </div>
//       </div>
//       <div className="w-full p-8  bg-transparent">
//         <h2 className="text-2xl font-semibold mb-4">Your Maps Preview:</h2>
//         {savedUrl && (
//           <div className="aspect-w-16 h-screen aspect-h-9">
//             <iframe
//               className="w-full h-full"
//               src={savedUrl}
//               style={{ border: '0' }}
//               allowFullScreen
//             ></iframe>
//           </div>
//         )}
//       </div>
//     </div>
















//             <div className="md:flex mb-6 border border-t-1 border-b-0 border-x-0 border-cream-dark">
//               <div className="md:flex-1 px-3 text-center md:text-right">
//                 <input className="button text-cream-lighter text-white bg-brick hover:bg-brick-dark cursor-pointer w-32 h-12 rounded-xl border-white border hover:bg-slate-500 hover" type="submit" value="Submit Form" />
//               </div>
//             </div>
//           </form>
//         </section>
//       </main>
//     </div>
//   );
// }
