import { gql } from '@apollo/client';
import { EDUCATION_FIELDS, EXPERIENCE_FIELDS, LANGUAGE_FIELDS, PROFILE_FIELDS, SKILL_FIELDS } from './fragments';

export const UPDATE_PROFILE_MUTATION = gql`
  ${PROFILE_FIELDS}
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...ProfileFields
    }
  }
`;

export const ADD_EDUCATION_MUTATION = gql`
  ${EDUCATION_FIELDS}
  mutation AddEducation($input: EducationInput!) {
    addEducation(input: $input) {
      ...EducationFields
    }
  }
`;

export const UPDATE_EDUCATION_MUTATION = gql`
  ${EDUCATION_FIELDS}
  mutation UpdateEducation($educationId: ID!, $input: EducationInput!) {
    updateEducation(educationId: $educationId, input: $input) {
      ...EducationFields
    }
  }
`;

export const REMOVE_EDUCATION_MUTATION = gql`
  mutation RemoveEducation($educationId: ID!) {
    removeEducation(educationId: $educationId)
  }
`;

export const ADD_EXPERIENCE_MUTATION = gql`
  ${EXPERIENCE_FIELDS}
  mutation AddExperience($input: ExperienceInput!) {
    addExperience(input: $input) {
      ...ExperienceFields
    }
  }
`;

export const UPDATE_EXPERIENCE_MUTATION = gql`
  ${EXPERIENCE_FIELDS}
  mutation UpdateExperience($experienceId: ID!, $input: ExperienceInput!) {
    updateExperience(experienceId: $experienceId, input: $input) {
      ...ExperienceFields
    }
  }
`;

export const REMOVE_EXPERIENCE_MUTATION = gql`
  mutation RemoveExperience($experienceId: ID!) {
    removeExperience(experienceId: $experienceId)
  }
`;

export const ADD_LANGUAGE_MUTATION = gql`
  ${LANGUAGE_FIELDS}
  mutation AddLanguage($input: LanguageInput!) {
    addLanguage(input: $input) {
      ...LanguageFields
    }
  }
`;

export const UPDATE_LANGUAGE_MUTATION = gql`
  ${LANGUAGE_FIELDS}
  mutation UpdateLanguage($languageId: ID!, $input: LanguageInput!) {
    updateLanguage(languageId: $languageId, input: $input) {
      ...LanguageFields
    }
  }
`;

export const REMOVE_LANGUAGE_MUTATION = gql`
  mutation RemoveLanguage($languageId: ID!) {
    removeLanguage(languageId: $languageId)
  }
`;

export const ADD_SKILL_MUTATION = gql`
  ${SKILL_FIELDS}
  mutation AddSkill($input: SkillInput!) {
    addSkill(input: $input) {
      ...SkillFields
    }
  }
`;

export const UPDATE_SKILL_MUTATION = gql`
  ${SKILL_FIELDS}
  mutation UpdateSkill($skillId: ID!, $input: SkillInput!) {
    updateSkill(skillId: $skillId, input: $input) {
      ...SkillFields
    }
  }
`;

export const REMOVE_SKILL_MUTATION = gql`
  mutation RemoveSkill($skillId: ID!) {
    removeSkill(skillId: $skillId)
  }
`;
