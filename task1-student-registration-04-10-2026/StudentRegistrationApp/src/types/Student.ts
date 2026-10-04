export type Gender = 'Male' | 'Female' | 'Other';
export type Hobby = 'Reading' | 'Music' | 'Sports' | 'Traveling';

export type StudentData = {
  studentName: string;
  enrollmentNo: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  age: string;
  gender: Gender;
  course: string;
  semester: string;
  address: string;
  city: string;
  pincode: string;
  hobbies: Hobby[];
  photoUri: string;
  photoName: string;
};

export type RegistrationForm = Omit<StudentData, 'photoUri' | 'photoName' | 'gender'> & {
  gender: Gender | '';
  photoUri: string;
  photoName: string;
};

export type FieldErrors = Partial<Record<keyof RegistrationForm, string>>;
