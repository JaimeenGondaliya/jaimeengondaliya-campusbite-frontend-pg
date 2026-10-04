import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DisplayProps } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

function Group({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <View style={styles.groupTitle}>
        <View style={styles.number}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>

      {children}
    </View>
  );
}

export default function Display({
  navigation,
  route,
}: DisplayProps) {
  const { student } = route.params;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      {/* Brand Header */}
      <View style={styles.brand}>
        <View style={styles.brandMark}>
          <Text style={styles.brandLetter}>A</Text>
        </View>

        <View>
          <Text style={styles.brandName}>ACADEMIC REGISTRY</Text>
          <Text style={styles.brandSub}>
            Office of student records
          </Text>
        </View>
      </View>

      {/* Success Message */}
      <View style={styles.success}>
        <Text style={styles.check}>✓</Text>

        <View>
          <Text style={styles.successTitle}>
            Registration successful
          </Text>

          <Text style={styles.successText}>
            The student record has been created.
          </Text>
        </View>
      </View>

      {/* Page Heading */}
      <Text style={styles.heading}>Student Details</Text>

      {/* Personal Information */}
      <Group
        number="01"
        title="Personal Information"
      >
        <Row
          label="Student Name"
          value={student.studentName}
        />

        <Row
          label="Enrollment No"
          value={student.enrollmentNo}
        />

        <Row
          label="Email"
          value={student.email}
        />

        <Row
          label="Mobile"
          value={student.mobile}
        />

        <Row
          label="Date of Birth"
          value={student.dateOfBirth}
        />

        <Row
          label="Age"
          value={student.age}
        />

        <Row
          label="Gender"
          value={student.gender}
        />
      </Group>

      {/* Academic Information */}
      <Group
        number="02"
        title="Academic Information"
      >
        <Row
          label="Course"
          value={student.course}
        />

        <Row
          label="Semester"
          value={student.semester}
        />
      </Group>

      {/* Additional Information */}
      <Group
        number="03"
        title="Additional Information"
      >
        <Row
          label="Address"
          value={student.address}
        />

        <Row
          label="City"
          value={student.city}
        />

        <Row
          label="Pincode"
          value={student.pincode}
        />

        <Row
          label="Hobbies"
          value={student.hobbies.join(', ')}
        />

        {student.photoUri && (
          <View style={styles.photoRow}>
            <Text style={styles.rowLabel}>
              Passport Size Photo
            </Text>

            <Image
              source={{ uri: student.photoUri }}
              style={styles.photo}
            />
          </View>
        )}
      </Group>

      {/* Back Button */}
      <Pressable
        onPress={() => navigation.navigate('Registration')}
        style={styles.back}
      >
        <Text style={styles.backText}>
          Back to Registration
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.sectionBackground,
  },

  content: {
    paddingBottom: 28,
  },

  // Brand Header
  brand: {
    height: 54,
    backgroundColor: '#FFF',
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
  },

  // Success Message
  success: {
    margin: 18,
    padding: 15,
    backgroundColor: '#F0FAF4',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2C9B5E',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 18,
    marginRight: 10,
  },

  successTitle: {
    fontSize: 14,
    color: '#1D7042',
    fontWeight: '700',
  },

  successText: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
  },

  // Page Heading
  heading: {
    fontSize: 26,
    color: colors.ink,
    fontFamily: 'serif',
    marginHorizontal: 18,
    marginBottom: 16,
  },

  // Information Groups
  group: {
    backgroundColor: '#FFF',
    marginBottom: 9,
    padding: 18,
  },

  groupTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F6',
    paddingBottom: 13,
    marginBottom: 5,
  },

  number: {
    width: 29,
    height: 29,
    borderRadius: 7,
    backgroundColor: colors.paleBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  numberText: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '700',
  },

  title: {
    fontSize: 18,
    color: colors.ink,
    fontFamily: 'serif',
  },

  // Data Rows
  row: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },

  rowLabel: {
    fontSize: 11,
    color: colors.muted,
    flex: 1,
  },

  rowValue: {
    fontSize: 12,
    color: colors.ink,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },

  // Photo
  photoRow: {
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  photo: {
    width: 75,
    height: 90,
    borderRadius: 6,
    resizeMode: 'cover',
  },

  // Back Button
  back: {
    marginHorizontal: 18,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
  },

  backText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
});