// types.ts
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
}

export const initialFormData: LecturerFormData = {
    university_id: '',
    campus_profile_id: '',
    college_profile_id: '',
    department_profile_id: '',
    lecturer_id: '',
    avatar: null,
    name: '',
    location: '',
    job_title: '',
    skills: [],
    about: '',
    phone: '',
    email: '',
    linkedin: '',
    education_background: '',
    background_description: '',
    languages: [],
    professional_experience: '',
    key_responsibilities: '',
    publications: [],
    research_interests: '',
    teaching_experience: '',
    courses_taught: [],
    course_descriptions: [],
    professional_memberships: [],
    awards: []
};
