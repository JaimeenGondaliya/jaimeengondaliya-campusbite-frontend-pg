import React, { useState } from 'react';
import {
  KeyboardAvoidingView,Modal,  Platform,  Pressable,  ScrollView,  StyleSheet,  Text,  View,} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import { colors } from '../theme/colors';

import {
  DateField,  Field,  GenderOptions,  HobbyOptions,  PhotoField,  SectionHeader,  SelectField,} from '../components/FormComponents';

import {
  FieldErrors,  Gender,  Hobby,  RegistrationForm,} from '../types/Student';

import { validateStudent } from '../utils/validation';

import { RegistrationProps } from '../navigation/AppNavigator';

const initialForm: RegistrationForm = {
  studentName: '',
  enrollmentNo: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  course: '',
  semester: '',
  address: '',
  city: '',
  pincode: '',
  hobbies: [],
  photoUri: '',
  photoName: '',
};

const courses = [
  'B.Sc.IT',  'M.Sc.IT',  'BCA',  'MCA',  'bBA',  'MBA',  'B.Com',  'M.Com',  'B.Tech',  'M.Tech',];

const cities = [
  'Surat',  'Nadiad',  'Anand',  'Vadodara',  'Ahmedabad',  'Pune',  'Mumbai',  'Delhi',  'Bangalore',  'Chennai',  'Kolkata',  'Hyderabad',];

const weekDays = [
  'Su',  'Mo',  'Tu',  'We',  'Th',  'Fr',  'Sa',];

const monthNames = [
  'January',  'February',  'March',  'April',  'May',  'June',  'July',  'August',  'September',  'October',  'November',  'December',];

function getCalendarDays(month: Date): Array<number | null> {
  const firstDay = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  ).getDay();

  const lastDate = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();

  return [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: lastDate },
      (_, index) => index + 1,
    ),
  ];
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${String(date.getDate()).padStart(
    2,
    '0',
  )}`;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) {
    return '';
  }

  const [year, month, day] = isoDate.split('-');

  return `${day}/${month}/${year}`;
}

function parseTypedDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(
    2,
    4,
  )}/${digits.slice(4)}`;
}

function typedDateToIso(value: string): string {
  const match =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return '';
  }

  const [, day, month, year] = match;

  const parsed = new Date(
    Number(year),    Number(month) - 1,    Number(day),
  );

  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return '';
  }

  return formatDate(parsed);
}

export default function Registration({
  navigation,
}: RegistrationProps) {
  const [form, setForm] =
    useState<RegistrationForm>(initialForm);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [picker, setPicker] = useState<
    'course' | 'semester' | 'city' | null
  >(null);

  const [showDate, setShowDate] = useState(false);

  const [calendarMonth, setCalendarMonth] =
    useState(new Date());

  const [dateText, setDateText] = useState('');

  const [calendarView, setCalendarView] = useState<
    'days' | 'months' | 'years'
  >('days');

  const update = <K extends keyof RegistrationForm>(
    key: K,
    value: RegistrationForm[K],
  ) => {
    setForm(current => ({
      ...current,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors(current => ({
        ...current,
        [key]: undefined,
      }));
    }
  };

  const openDatePicker = () => {
    setDateText(
      formatDisplayDate(form.dateOfBirth),
    );

    const existingDate = form.dateOfBirth
      ? new Date(`${form.dateOfBirth}T00:00:00`)
      : new Date();

    setCalendarMonth(
      Number.isNaN(existingDate.getTime())
        ? new Date()
        : existingDate,
    );

    setCalendarView('days');
    setShowDate(true);
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day,
    );

    if (selectedDate <= new Date()) {
      const value = formatDate(selectedDate);

      setDateText(formatDisplayDate(value));
      update('dateOfBirth', value);

      setShowDate(false);
    }
  };

  const typeDate = (value: string) => {
    const displayValue = parseTypedDate(value);
    const isoValue = typedDateToIso(displayValue);

    setDateText(displayValue);
    update('dateOfBirth', isoValue);
  };

  const choosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.didCancel) {
      return;
    }

    const file = result.assets?.[0];

    if (!file?.uri) {
      return;
    }

    if (
      file.fileSize &&
      file.fileSize > 2 * 1024 * 1024
    ) {
      setErrors(current => ({
        ...current,
        photoUri: 'Photo must be smaller than 2 MB.',
      }));

      return;
    }

    const validType = [
      'image/jpeg',
      'image/png',
    ].includes(file.type || '');

    if (!validType) {
      setErrors(current => ({
        ...current,
        photoUri:
          'Only JPG, JPEG, or PNG files are allowed.',
      }));

      return;
    }

    update('photoUri', file.uri);

    update(
      'photoName',
      file.fileName || 'passport-photo',
    );
  };

  const register = () => {
    const nextErrors = validateStudent(form);

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length === 0 &&
      form.gender
    ) {
      navigation.navigate('Display', {
        student: {
          ...form,
          gender: form.gender,
        },
      });
    }
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setDateText('');
  };

  const openPicker = (
    type: 'course' | 'semester' | 'city',
  ) => {
    setPicker(type);
  };

  const pickerOptions =
    picker === 'course'
      ? courses
      : picker === 'city'
        ? cities
        : ['1', '2', '3', '4', '5', '6'];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Text style={styles.brandLetter}>
              A
            </Text>
          </View>

          <View>
            <Text style={styles.brandName}>
              ACADEMIC REGISTRY
            </Text>

            <Text style={styles.brandSub}>
              Office of student records
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            NEW STUDENT RECORD
          </Text>

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              Student Registration
            </Text>

            <Text style={styles.requiredLegend}>
              <Text style={styles.red}>•</Text>{' '}
              Required
            </Text>
          </View>

          <Text style={styles.subtitle}>
            Enter student details
          </Text>
        </View>

        {/* Validation Alert */}
        {Object.keys(errors).length > 0 && (
          <View style={styles.alert}>
            <Text style={styles.alertTitle}>
              Please review the highlighted fields.
            </Text>

            <Text style={styles.alertText}>
              The student record has not been created.
              Correct the errors below and try again.
            </Text>
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <SectionHeader
            number="01"
            title="Personal Information"
            subtitle="Identity and contact details"
          />

          <Field
            label="Student Name"
            required
            placeholder="Enter student name"
            value={form.studentName}
            onChangeText={value =>
              update('studentName', value)
            }
            hint="2–50 characters"
            error={errors.studentName}
          />

          <Field
            label="Enrollment No"
            required
            placeholder="Enter enrollment number"
            value={form.enrollmentNo}
            onChangeText={value =>
              update('enrollmentNo', value)
            }
            hint="Required for student registration"
            error={errors.enrollmentNo}
          />

          <Field
            label="Email"
            required
            placeholder="Enter email address"
            value={form.email}
            onChangeText={value =>
              update('email', value.toLowerCase())
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            hint="Valid email address; must be unique"
            error={errors.email}
          />

          <Field
            label="Mobile"
            required
            placeholder="Enter mobile number"
            value={form.mobile}
            onChangeText={value =>
              update(
                'mobile',
                value
                  .replace(/\D/g, '')
                  .slice(0, 10),
              )
            }
            keyboardType="phone-pad"
            hint="Exactly 10 digits"
            error={errors.mobile}
          />

          <DateField
            placeholder="DD/MM/YYYY"
            value={
              dateText ||
              formatDisplayDate(form.dateOfBirth)
            }
            onChangeText={typeDate}
            onPress={openDatePicker}
            error={errors.dateOfBirth}
          />

          <Field
            label="Age"
            placeholder="Enter age"
            value={form.age}
            onChangeText={value =>
              update(
                'age',
                value
                  .replace(/\D/g, '')
                  .slice(0, 2),
              )
            }
            keyboardType="number-pad"
            hint="Optional · Must be between 18 and 60"
            error={errors.age}
          />

          <GenderOptions
            value={form.gender as Gender | ''}
            onChange={value =>
              update('gender', value)
            }
            error={errors.gender}
          />
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <SectionHeader
            number="02"
            title="Academic Information"
            subtitle="Course and enrollment details"
          />

          <SelectField
            label="Course"
            required
            value={form.course}
            placeholder="Select course"
            onPress={() =>
              openPicker('course')
            }
            error={errors.course}
          />

          <SelectField
            label="Semester"
            required
            value={form.semester}
            placeholder="Select semester"
            onPress={() =>
              openPicker('semester')
            }
            hint="Available semesters: 1, 2, 3, 4, 5, 6"
            error={errors.semester}
          />
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <SectionHeader
            number="03"
            title="Additional Information"
            subtitle="Address, hobbies and passport photograph"
          />

          <Field
            label="Address"
            required
            placeholder="Enter full address"
            value={form.address}
            onChangeText={value =>
              update('address', value)
            }
            multiline
            error={errors.address}
          />

          <SelectField
            label="City"
            required
            value={form.city}
            placeholder="Select city"
            onPress={() =>
              openPicker('city')
            }
            error={errors.city}
          />

          <Field
            label="Pincode"
            required
            placeholder="Enter pincode"
            value={form.pincode}
            onChangeText={value =>
              update(
                'pincode',
                value
                  .replace(/\D/g, '')
                  .slice(0, 6),
              )
            }
            keyboardType="number-pad"
            error={errors.pincode}
          />

          <HobbyOptions
            value={form.hobbies}
            onToggle={(hobby: Hobby) =>
              update(
                'hobbies',
                form.hobbies.includes(hobby)
                  ? form.hobbies.filter(
                      item => item !== hobby,
                    )
                  : [...form.hobbies, hobby],
              )
            }
            error={errors.hobbies}
          />

          <PhotoField
            uri={form.photoUri}
            onPress={choosePhoto}
            error={errors.photoUri}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={register}
            style={styles.register}
          >
            <Text style={styles.registerText}>
              Register Student
            </Text>
          </Pressable>

          <Pressable
            onPress={reset}
            style={styles.reset}
          >
            <Text style={styles.resetText}>
              Reset
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Course / Semester / City Picker */}
      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setPicker(null)
        }
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPicker(null)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Select {picker}
            </Text>

            {pickerOptions.map(option => (
              <Pressable
                key={option}
                onPress={() => {
                  if (picker) {
                    update(picker, option);
                  }

                  setPicker(null);
                }}
                style={styles.modalOption}
              >
                <Text
                  style={styles.modalOptionText}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker */}
      <Modal
        visible={showDate}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowDate(false)
        }
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() =>
            setShowDate(false)
          }
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Select date of birth
            </Text>

            <Text style={styles.dateHint}>
              Date format: DD/MM/YYYY
            </Text>

            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    current =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() - 1,
                        1,
                      ),
                  )
                }
                style={styles.monthButton}
              >
                <Text
                  style={styles.monthButtonText}
                >
                  ‹
                </Text>
              </Pressable>

              <View
                style={styles.monthYearButtons}
              >
                <Pressable
                  onPress={() =>
                    setCalendarView('months')
                  }
                  style={
                    styles.monthYearButton
                  }
                >
                  <Text
                    style={styles.monthTitle}
                  >
                    {
                      monthNames[
                        calendarMonth.getMonth()
                      ]
                    }
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    setCalendarView('years')
                  }
                  style={
                    styles.monthYearButton
                  }
                >
                  <Text
                    style={styles.monthTitle}
                  >
                    {calendarMonth.getFullYear()}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    current =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        1,
                      ),
                  )
                }
                style={styles.monthButton}
              >
                <Text
                  style={styles.monthButtonText}
                >
                  ›
                </Text>
              </Pressable>
            </View>

            {/* Month Selection */}
            {calendarView === 'months' && (
              <View style={styles.monthGrid}>
                {monthNames.map(
                  (month, index) => (
                    <Pressable
                      key={month}
                      onPress={() => {
                        setCalendarMonth(
                          current =>
                            new Date(
                              current.getFullYear(),
                              index,
                              1,
                            ),
                        );

                        setCalendarView(
                          'days',
                        );
                      }}
                      style={[
                        styles.monthChoice,
                        index ===
                          calendarMonth.getMonth() &&
                          styles.selectedChoice,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          index ===
                            calendarMonth.getMonth() &&
                            styles.selectedChoiceText,
                        ]}
                      >
                        {month.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ),
                )}
              </View>
            )}

            {/* Year Selection */}
            {calendarView === 'years' && (
              <ScrollView
                style={styles.yearScroll}
              >
                <View style={styles.yearGrid}>
                  {Array.from(
                    { length: 101 },
                    (_, index) =>
                      new Date().getFullYear() -
                      index,
                  ).map(year => (
                    <Pressable
                      key={year}
                      onPress={() => {
                        setCalendarMonth(
                          current =>
                            new Date(
                              year,
                              current.getMonth(),
                              1,
                            ),
                        );

                        setCalendarView(
                          'days',
                        );
                      }}
                      style={[
                        styles.yearChoice,
                        year ===
                          calendarMonth.getFullYear() &&
                          styles.selectedChoice,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          year ===
                            calendarMonth.getFullYear() &&
                            styles.selectedChoiceText,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}

            {/* Day Selection */}
            {calendarView === 'days' && (
              <View style={styles.calendarGrid}>
                {weekDays.map(day => (
                  <Text
                    key={day}
                    style={styles.weekDay}
                  >
                    {day}
                  </Text>
                ))}

                {getCalendarDays(
                  calendarMonth,
                ).map((day, index) => {
                  if (!day) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={styles.calendarDay}
                      />
                    );
                  }

                  const candidate = new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth(),
                    day,
                  );

                  const selected =
                    form.dateOfBirth ===
                    formatDate(candidate);

                  const disabled =
                    candidate > new Date();

                  return (
                    <Pressable
                      key={day}
                      disabled={disabled}
                      onPress={() =>
                        selectDate(day)
                      }
                      style={[
                        styles.calendarDay,
                        selected &&
                          styles.selectedCalendarDay,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          selected &&
                            styles.selectedCalendarDayText,
                          disabled &&
                            styles.disabledCalendarDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 34,
  },

  /* Brand Header */
  brand: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandMark: {
    width: 27,
    height: 27,
    borderRadius: 4,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  brandLetter: {
    color: '#FFF',
    fontSize: 17,
  },

  brandName: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '700',
    color: colors.ink,
  },

  brandSub: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 1,
  },

  /* Hero */
  hero: {
    paddingHorizontal: 18,
    paddingTop: 27,
    paddingBottom: 26,
  },

  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.navy,
    fontWeight: '700',
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 26,
    color: colors.ink,
    fontFamily: 'serif',
  },

  requiredLegend: {
    fontSize: 10,
    color: colors.lightMuted,
    marginBottom: 3,
  },

  red: {
    color: colors.error,
    fontSize: 16,
  },

  subtitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 9,
  },

  /* Validation Alert */
  alert: {
    marginHorizontal: 15,
    marginBottom: 18,
    padding: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.error,
    backgroundColor: colors.errorBackground,
    borderRadius: 6,
  },

  alertTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 5,
  },

  alertText: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 15,
  },

  /* Sections */
  section: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 9,
    borderBottomColor: colors.sectionBackground,
  },

  /* Action Buttons */
  actions: {
    paddingHorizontal: 18,
    paddingTop: 23,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F6',
  },

  register: {
    height: 41,
    backgroundColor: colors.navy,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.navy,
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },

  registerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  reset: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
  },

  resetText: {
    color: colors.ink,
    fontSize: 12,
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 35,
  },

  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },

  modalOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  modalOptionText: {
    fontSize: 14,
    color: colors.ink,
  },

  /* Date Picker */
  dateHint: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 8,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  monthButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.paleBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthButtonText: {
    fontSize: 24,
    lineHeight: 27,
    color: colors.navy,
  },

  monthYearButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  monthYearButton: {
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 5,
  },

  monthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  monthChoice: {
    width: '31%',
    height: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  yearScroll: {
    maxHeight: 210,
  },

  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  yearChoice: {
    width: '31%',
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  choiceText: {
    fontSize: 12,
    color: colors.ink,
  },

  selectedChoice: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },

  selectedChoiceText: {
    color: '#FFF',
    fontWeight: '700',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  weekDay: {
    width: '14.285%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 8,
  },

  calendarDay: {
    width: '14.285%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 3,
  },

  calendarDayText: {
    fontSize: 12,
    color: colors.ink,
  },

  selectedCalendarDay: {
    backgroundColor: colors.navy,
  },

  selectedCalendarDayText: {
    color: '#FFF',
    fontWeight: '700',
  },

  disabledCalendarDayText: {
    color: '#CBD3DE',
  },
});