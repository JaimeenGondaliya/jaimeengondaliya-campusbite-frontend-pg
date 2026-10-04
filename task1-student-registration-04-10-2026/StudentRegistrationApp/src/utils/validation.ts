import {FieldErrors, RegistrationForm} from '../types/Student';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pincodePattern = /^[1-9][0-9]{5}$/;

export function validateStudent(form: RegistrationForm): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.studentName.trim();
  if (!name) errors.studentName = 'Student name is required.';
  else if (name.length < 2 || name.length > 50) errors.studentName = 'Student name must be 2–50 characters.';
  if (!form.enrollmentNo.trim()) errors.enrollmentNo = 'Enrollment number is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!emailPattern.test(form.email.trim())) errors.email = 'Enter a valid email address.';
  if (!form.mobile.trim()) errors.mobile = 'Mobile number is required.';
  else if (!/^\d{10}$/.test(form.mobile.trim())) errors.mobile = 'Mobile number must contain exactly 10 digits.';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
  if (form.age && (!/^\d+$/.test(form.age) || Number(form.age) < 18 || Number(form.age) > 60)) {
    errors.age = 'Age must be between 18 and 60.';
  }
  if (!form.gender) errors.gender = 'Please select gender.';
  if (!form.course) errors.course = 'Please select a course.';
  if (!form.semester) errors.semester = 'Please select a semester.';
  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.city) errors.city = 'Please select a city.';
  if (!form.pincode.trim()) errors.pincode = 'Pincode is required.';
  else if (!pincodePattern.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit Indian pincode.';
  if (!form.hobbies.length) errors.hobbies = 'Please select a hobby.';
  if (!form.photoUri) errors.photoUri = 'Passport size photo is required.';
  return errors;
}
