"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaLinkedin, FaTimesCircle, FaCommentDots, FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel,
  FaUniversity, FaBuilding, FaSchool, FaChalkboardTeacher
} from 'react-icons/fa';

// Define types for the expected data
interface User {
  phone: string;
  email: string;
  linkedin: string;
}

interface File {
  id: string;
  file_type: string;
  file: string;
}

interface Profile {
  name: string;
  description: string;
  user: User;
  files: File[];
  campus_profile: string;
  college_profile: string;
}

interface Params {
  id: string;
}

const LabProfileDetailPage = ({ params }: { params: Params }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState('');
  const [campusName, setCampusName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/lab-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const profileData: Profile = response.data;
      setProfile(profileData);
      fetchAssociatedProfileNames(profileData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching profile:', error.message);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociatedProfileNames = async (profileData: Profile) => {
    const token = localStorage.getItem('token');

    try {
      const universityResponse = await axios.get(`http://127.0.0.1:8000/university-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUniversityName("Debre Birhan University");

      const campusResponse = await axios.get(`http://127.0.0.1:8000/campus-profiles/${profileData.campus_profile}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCampusName("New Campus");

      const collegeResponse = await axios.get(`http://127.0.0.1:8000/college-profiles/${profileData.college_profile}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCollegeName("Update College Profile");

      const departmentResponse = await axios.get(`http://127.0.0.1:8000/department-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartmentName("Create a Department Profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching associated profile names:', error.message);
      }
    }
  };

  const renderFilePreview = (file: File) => {
    const fileType = file.file_type;
    const fileUrl = file.file;

    const fileStyle = {
      width: '200px',
      height: '200px',
      objectFit: 'cover' as 'cover',
      borderRadius: '8px',
      margin: '10px',
      cursor: 'pointer'
    };

    if (fileType === 'photo') {
      return <img key={file.id} src={fileUrl} alt="File Preview" style={fileStyle} onClick={() => handleFullScreen(file)} />;
    } else if (fileType === 'video') {
      return <video key={file.id} src={fileUrl} controls style={fileStyle} onClick={() => handleFullScreen(file)}></video>;
    } else if (fileType === 'document') {
      const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
      const iconProps = { className: "w-8 h-8 inline-block mr-2 text-gray-400" };

      switch (fileExtension) {
        case 'pdf':
          return <a key={file.id} href={fileUrl} target="_blank" rel="noopener noreferrer"><FaFilePdf {...iconProps} /> PDF Document</a>;
        case 'doc':
        case 'docx':
          return <a key={file.id} href={fileUrl} target="_blank" rel="noopener noreferrer"><FaFileWord {...iconProps} /> Word Document</a>;
        case 'xls':
        case 'xlsx':
          return <a key={file.id} href={fileUrl} target="_blank" rel="noopener noreferrer"><FaFileExcel {...iconProps} /> Excel Document</a>;
        default:
          return <a key={file.id} href={fileUrl} target="_blank" rel="noopener noreferrer"><FaFileAlt {...iconProps} /> Other Document</a>;
      }
    }
  };

  const handleFullScreen = (file: File) => {
    setSelectedFile(file);
    setShowFullScreen(true);
  };

  const closeFullScreen = () => {
    setShowFullScreen(false);
    setSelectedFile(null);
  };

  const handleClickOutside = (event: globalThis.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowFullScreen(false);
    }
  };

  useEffect(() => {
    if (showFullScreen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFullScreen]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pt-24 px-4 md:px-8 lg:px-16 bg-gray-900 text-white min-h-screen">
      {profile && (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            {profile.files[0]?.file_type === 'photo' ? (
              <img src={profile.files[0]?.file} alt="Lab Photo" className="w-full h-64 object-cover" />
            ) : profile.files[0]?.file_type === 'video' ? (
              <video src={profile.files[0]?.file} controls className="w-full h-64 object-cover"></video>
            ) : (
              <img src="/path/to/default-image.jpg" alt="Default Photo" className="w-full h-64 object-cover" />
            )}
            <img src={profile.files[0]?.file} alt="Lab Photo" className="w-24 h-24 rounded-full border-4 border-gray-800 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="p-4 text-center mt-12">
            <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
            <p className="text-gray-400">{profile.description}</p>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2">Associated Profiles</h2>
            <div className="flex flex-wrap justify-center items-center">
              <p className="text-gray-400 flex items-center mr-4"><FaUniversity className="mr-2" /> University: {universityName}</p>
              <p className="text-gray-400 flex items-center mr-4"><FaBuilding className="mr-2" /> Campus: {campusName}</p>
              <p className="text-gray-400 flex items-center mr-4"><FaSchool className="mr-2" /> College: {collegeName}</p>
              <p className="text-gray-400 flex items-center"><FaChalkboardTeacher className="mr-2" /> Department: {departmentName}</p>
            </div>
          </div>
          <div className="border-t border-gray-700 p-4 flex justify-center space-x-4">
            <a href={`tel:${profile.user.phone}`} className="text-gray-400 flex items-center"><FaPhone className="inline-block mr-1" /> {profile.user.phone}</a>
            <a href={`mailto:${profile.user.email}`} className="text-gray-400 flex items-center"><FaEnvelope className="inline-block mr-1" /> {profile.user.email}</a>
            <a href={profile.user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 flex items-center"><FaLinkedin className="inline-block mr-1" /> {profile.user.linkedin}</a>
            <button className="btn btn-primary flex items-center"><FaCommentDots className="mr-2" /> Message</button>
          </div>
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-lg font-bold mb-2"><FaFileAlt className="inline-block mr-2" /> Files</h2>
            <div className="flex flex-wrap">
              {profile.files.map((file) => (
                <div key={file.id} className="mb-4">
                  {renderFilePreview(file)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFullScreen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="relative bg-gray-900 p-6 rounded-lg shadow-lg max-h-full overflow-y-auto">
            {selectedFile.file_type === 'photo' ? (
              <img src={selectedFile.file} alt="Full Screen" className="w-full h-auto" />
            ) : selectedFile.file_type === 'video' ? (
              <video src={selectedFile.file} controls className="w-full h-auto"></video>
            ) : (
              <a href={selectedFile.file} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selectedFile.file.split('/').pop()}</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabProfileDetailPage;
