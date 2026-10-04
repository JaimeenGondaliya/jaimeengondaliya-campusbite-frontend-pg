import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {colors} from '../theme/colors';
import {Gender, Hobby} from '../types/Student';

type FieldProps = TextInputProps & {label: string; required?: boolean; hint?: string; error?: string};

export function Field({label, required, hint, error, multiline, ...props}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.lightMuted}
        style={[styles.input, multiline && styles.multiline, error && styles.errorBorder]}
      />
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function SelectField({label, value, placeholder, required, error, onPress, hint}: {
  label: string; value: string; placeholder: string; required?: boolean; error?: string; hint?: string; onPress: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      <Pressable onPress={onPress} style={[styles.input, styles.select, error && styles.errorBorder]}>
        <Text style={value ? styles.value : styles.placeholder}>{value || placeholder}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function DateField({value, placeholder, error, onPress, onChangeText}: {
  value: string;
  placeholder: string;
  error?: string;
  onPress: () => void;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
      <View style={[styles.input, styles.dateInput, error && styles.errorBorder]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.lightMuted}
          keyboardType="number-pad"
          maxLength={10}
          style={styles.dateTextInput}
        />
        <Pressable onPress={onPress} style={styles.calendarButton} hitSlop={8}>
          <Text style={styles.calendarIcon}>▣</Text>
        </Pressable>
      </View>
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function GenderOptions({value, onChange, error}: {value: Gender | ''; onChange: (value: Gender) => void; error?: string}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
      <View style={[styles.optionRow, error && styles.errorBorder]}>
        {(['Male', 'Female', 'Other'] as Gender[]).map(item => (
          <Pressable key={item} onPress={() => onChange(item)} style={[styles.option, value === item && styles.selectedOption]}>
            <View style={[styles.radio, value === item && styles.radioSelected]} />
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function HobbyOptions({value, onToggle, error}: {value: Hobby[]; onToggle: (hobby: Hobby) => void; error?: string}) {
  const hobbies: Hobby[] = ['Reading', 'Music', 'Sports', 'Traveling'];
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Hobbies <Text style={styles.required}>*</Text></Text>
      <View style={[styles.hobbyGrid, error && styles.errorBorder]}>
        {hobbies.map(hobby => (
          <Pressable key={hobby} onPress={() => onToggle(hobby)} style={[styles.hobby, value.includes(hobby) && styles.selectedHobby]}>
            <View style={[styles.radio, value.includes(hobby) && styles.radioSelected]} />
            <Text style={styles.optionText}>{hobby}</Text>
          </Pressable>
        ))}
      </View>
      {!error && <Text style={styles.hint}>Select one hobby</Text>}
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function PhotoField({uri, onPress, error}: {uri: string; onPress: () => void; error?: string}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Passport Size Photo <Text style={styles.required}>*</Text></Text>
      <Pressable onPress={onPress} style={[styles.photoBox, error && styles.errorBorder]}>
        {uri ? <Image source={{uri}} style={styles.photoPreview} /> : <Text style={styles.photoIcon}>▧</Text>}
        <View style={styles.photoText}>
          <Text style={styles.value}>{uri ? 'Photo selected' : 'Upload passport size photo'}</Text>
          <Text style={styles.hint}>JPG/PNG only · Maximum 2 MB</Text>
          <Text style={styles.browse}>Browse</Text>
        </View>
      </Pressable>
      {error && <ErrorText message={error} />}
    </View>
  );
}

export function ErrorText({message}: {message: string}) {
  return <Text style={styles.errorText}>ⓘ  {message}</Text>;
}

export function SectionHeader({number, title, subtitle}: {number: string; title: string; subtitle: string}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.number}><Text style={styles.numberText}>{number}</Text></View>
      <View><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {marginBottom: 17},
  label: {fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 6},
  required: {color: colors.error},
  input: {height: 37, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 11, color: colors.ink, backgroundColor: '#FBFCFE', fontSize: 13},
  multiline: {height: 78, paddingTop: 10, textAlignVertical: 'top'},
  select: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  value: {fontSize: 12, color: colors.ink},
  placeholder: {fontSize: 13, color: colors.muted},
  chevron: {fontSize: 20, color: colors.muted, marginTop: -6},
  calendarIcon: {fontSize: 16, color: colors.muted},
  dateInput: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8},
  dateTextInput: {flex: 1, height: 35, paddingHorizontal: 3, color: colors.ink, fontSize: 13},
  calendarButton: {width: 30, height: 30, justifyContent: 'center', alignItems: 'center'},
  hint: {fontSize: 10, color: colors.lightMuted, marginTop: 5},
  errorBorder: {borderColor: colors.error, borderWidth: 1},
  errorText: {fontSize: 10, color: colors.error, marginTop: 5},
  optionRow: {height: 49, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 6, flexDirection: 'row', gap: 6, backgroundColor: '#FBFCFE'},
  option: {flex: 1, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7},
  selectedOption: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border},
  radio: {width: 14, height: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.muted},
  radioSelected: {borderColor: colors.navy, backgroundColor: 'transparent', borderWidth: 2},
  optionText: {fontSize: 12, color: colors.ink},
  hobbyGrid: {padding: 6, borderRadius: 8, backgroundColor: '#FBFCFE', flexDirection: 'row', flexWrap: 'wrap', gap: 7},
  hobby: {width: '48%', height: 35, borderWidth: 1, borderColor: colors.border, borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, gap: 7},
  selectedHobby: {borderColor: colors.navy},
  photoBox: {minHeight: 94, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 11, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBFCFE'},
  photoIcon: {fontSize: 28, color: colors.muted, width: 39, textAlign: 'center'},
  photoPreview: {width: 58, height: 70, borderRadius: 5, resizeMode: 'cover'},
  photoText: {marginLeft: 10, gap: 5},
  browse: {fontSize: 12, color: colors.navy, fontWeight: '700'},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#EDF1F6', marginBottom: 20},
  number: {width: 31, height: 31, borderRadius: 8, backgroundColor: colors.paleBlue, justifyContent: 'center', alignItems: 'center', marginRight: 10},
  numberText: {fontSize: 13, color: colors.navy, fontWeight: '700'},
  sectionTitle: {fontSize: 19, color: colors.ink, fontFamily: 'serif'},
  sectionSubtitle: {fontSize: 10, color: colors.lightMuted, marginTop: 2},
});
