// types.ts



// Types for University registration form
export type UniversityFormData = {
  name: string;
  bio: string;
  avatar: File | null;
  background: File | null;
  link: string;
  category: string;
  establishment_date: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_campuses: number;
  number_of_colleges: number;
  about: string;
  region: string;
  city: string;
  pobox: string;
  liyubota: string;
  location: { lat: number; lng: number };
}

export const initialUniversityFormData: UniversityFormData = {
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
};

// Types for Campus registration form


// Types for College registration form


// Types for Department registration form


// Types for Lecturer registration form
export type LecturerFormData = {
  university_id: string;
  campus_profile_id: string;
  college_profile_id: string;
  department_profile_id: string;
  lecturer_id: string;
  avatar: File | null;
  name: string;
  location: string;
  job_title: string;
  skills: string[]; // Array of skills
  about: string;
  phone: string;
  email: string;
  linkedin: string;
  education_background: string;
  background_description: string;
  languages: string[]; // Array of languages
  professional_experience: string;
  key_responsibilities: string;
  publications: string[]; // Array of publications
  research_interests: string;
  teaching_experience: string;
  courses_taught: string[];
  course_descriptions: string[];
  professional_memberships: string[];
  awards: string[];
};

export const initialLectureFormData: LecturerFormData = {
  university_id: "",
  campus_profile_id: "",
  college_profile_id: "",
  department_profile_id: "",
  lecturer_id: "",
  avatar: null,
  name: "",
  location: "",
  job_title: "",
  skills: [],
  about: "",
  phone: "",
  email: "",
  linkedin: "",
  education_background: "",
  background_description: "",
  languages: [],
  professional_experience: "",
  key_responsibilities: "",
  publications: [],
  research_interests: "",
  teaching_experience: "",
  courses_taught: [],
  course_descriptions: [],
  professional_memberships: [],
  awards: [],
};