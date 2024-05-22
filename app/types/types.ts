// types.ts

// Types for University registration form
export type UniversityFormData = {
  name: string;
  phone: string;
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
  support_disabled: boolean;
  region: string;
  city: string;
  pobox: string;
  liyubota: string;
  location: { lat: number; lng: number };
};

export const initialUniversityFormData: UniversityFormData = {
  name: "",
  phone: "",
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
  support_disabled: false,
  region: "",
  city: "",
  pobox: "",
  liyubota: "",
  location: { lat: 0, lng: 0 },
};

// Types for Campus registration form
export type CampusFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  link: string;
  avatar: File | null;
  background: File | null;
  establishment_date: string;
  category: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_colleges: number;
  about: string;
  location: { lat: number; lng: number };
  university_profile_id: string;
};

export const initialCampusFormData: CampusFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  link: "",
  avatar: null,
  background: null,
  establishment_date: "",
  category: "",
  number_of_lectures: 0,
  number_of_departments: 0,
  number_of_colleges: 0,
  about: "",
  location: { lat: 0, lng: 0 },
  university_profile_id: ""
}

// Types for College registration form
export type CollegeFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: File | null;
  background: File | null;
  number_of_lectures: number;
  number_of_departments: number;
  university_profile_id: string;
  campus_profile_id: string;
};

export const initialCollegeFormData: CollegeFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar: null,
  background: null,
  number_of_lectures: 0,
  number_of_departments: 0,
  university_profile_id: "",
  campus_profile_id: ""
}

// Types for Department registration form
export type DepartmentFormData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: File | null;
  background: File | null;
  number_of_lectures: number;
  university_profile_id: string;
  campus_profile_id: string;
  college_profile_id: string;
};

export const initialDepartmentFormData: DepartmentFormData = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar: null,
  background: null,
  number_of_lectures: 0,
  university_profile_id: "",
  campus_profile_id: "",
  college_profile_id: "",
}


// Types for Lecturer registration form
interface EducationalBackground {
  school: string;
  degree: string;
  fieldOfStudy: string;
  year_finished: string;
}

interface ProfessionalExperience {
  positionName: string;
  company: string;
  start_date: string;
  end_date: string;
}

export type LecturerFormData = {
  university_id: string;
  campus_profile_id: string;
  college_profile_id: string;
  department_profile_id: string;
  lecturer_id: string;
  avatar: File | null;
  cover: File | null;
  first_name: string;
  last_name: string;
  gender: string;
  title: string;
  field: string;
  courses_taught: string[];
  skills: string[];
  about: string;
  phone: string;
  email: string;
  linkedin: string;
  education_background: EducationalBackground[];
  languages: string[];
  professional_experience: ProfessionalExperience[];
  publications: string[];
  date_joined: string;
  awards: string[];
};

export const initialLectureFormData: LecturerFormData = {
  university_id: "",
  campus_profile_id: "",
  college_profile_id: "",
  department_profile_id: "",
  lecturer_id: "",
  avatar: null,
  cover: null,
  first_name: "",
  last_name: "",
  gender: "",
  title: "",
  field: "",
  courses_taught: [],
  skills: [],
  about: "",
  phone: "",
  email: "",
  linkedin: "",
  education_background: [],
  languages: [],
  professional_experience: [],
  publications: [],
  date_joined: "",
  awards: [],
};

// Utility type for deeply nested paths
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never;
    }[keyof T]
  : never;

// Example usage for LecturerFormData
export type LecturerFormDataPath = Path<LecturerFormData>;


// Types for User registration form

export type UserFormData = {
  first_name: string;
  last_name: string;
  gender: string;
  avatar: File | null;
  cover: File | null;
  bio: string;
  phone: string;
  email: string
};

export const initialUserFormData: UserFormData = {
  first_name: "",
  last_name: "",
  gender: "",
  avatar: null,
  cover: null,
  bio: "",
  phone: "",
  email: "",
};
