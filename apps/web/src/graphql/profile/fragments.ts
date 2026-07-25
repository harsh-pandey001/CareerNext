import { gql } from '@apollo/client';

export const EDUCATION_FIELDS = gql`
  fragment EducationFields on Education {
    id
    institution
    degree
    fieldOfStudy
    startDate
    endDate
    grade
  }
`;

export const EXPERIENCE_FIELDS = gql`
  fragment ExperienceFields on Experience {
    id
    company
    title
    location
    startDate
    endDate
    isCurrent
    description
  }
`;

export const LANGUAGE_FIELDS = gql`
  fragment LanguageFields on Language {
    id
    name
    proficiency
  }
`;

export const SKILL_FIELDS = gql`
  fragment SkillFields on Skill {
    id
    name
    level
    yearsOfExperience
  }
`;

export const PROFILE_FIELDS = gql`
  ${EDUCATION_FIELDS}
  ${EXPERIENCE_FIELDS}
  ${LANGUAGE_FIELDS}
  ${SKILL_FIELDS}
  fragment ProfileFields on Profile {
    id
    headline
    bio
    location
    githubUrl
    linkedinUrl
    portfolioUrl
    completionPercentage
    educations {
      ...EducationFields
    }
    experiences {
      ...ExperienceFields
    }
    languages {
      ...LanguageFields
    }
    skills {
      ...SkillFields
    }
  }
`;
