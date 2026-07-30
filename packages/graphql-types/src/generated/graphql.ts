/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ApplicationMode =
  | 'COMPANY_SITE'
  | 'EMAIL'
  | 'GOOGLE_FORM'
  | 'JOB_PORTAL';

export type ApplicationStatus =
  | 'ACCEPTED'
  | 'APPLIED'
  | 'HR_ROUND'
  | 'INTERVIEW_ROUND_1'
  | 'INTERVIEW_ROUND_2'
  | 'OA_SCHEDULED'
  | 'OFFER_RECEIVED'
  | 'REJECTED'
  | 'SAVED';

export type CustomJobInput = {
  applicationMode?: ApplicationMode | null | undefined;
  company: string;
  contactEmail?: string | null | undefined;
  coverLetter?: string | null | undefined;
  description?: string | null | undefined;
  experienceRequired?: string | null | undefined;
  externalUrl?: string | null | undefined;
  location?: string | null | undefined;
  pitchEmail?: string | null | undefined;
  postedAt?: string | null | undefined;
  skills?: Array<string> | null | undefined;
  title: string;
  type?: JobType | null | undefined;
  workMode: WorkMode;
};

export type DateRangeInput = {
  from?: string | null | undefined;
  to?: string | null | undefined;
};

export type DocumentType =
  | 'CERTIFICATE'
  | 'EXPERIENCE_LETTER'
  | 'OFFER_LETTER'
  | 'RESUME';

export type EducationInput = {
  degree: string;
  endDate?: string | null | undefined;
  fieldOfStudy?: string | null | undefined;
  grade?: string | null | undefined;
  institution: string;
  startDate: string;
};

export type ExperienceInput = {
  company: string;
  description?: string | null | undefined;
  endDate?: string | null | undefined;
  isCurrent?: boolean;
  location?: string | null | undefined;
  startDate: string;
  title: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type InterviewInput = {
  notes?: string | null | undefined;
  round: InterviewRound;
  scheduledAt?: string | null | undefined;
};

export type InterviewOutcome =
  | 'FAILED'
  | 'PASSED'
  | 'PENDING';

export type InterviewRound =
  | 'HR_ROUND'
  | 'ONLINE_ASSESSMENT'
  | 'TECHNICAL_ROUND_1'
  | 'TECHNICAL_ROUND_2';

export type JobFilterInput = {
  location?: string | null | undefined;
  query?: string | null | undefined;
  type?: JobType | null | undefined;
  workMode?: WorkMode | null | undefined;
};

export type JobType =
  | 'CONTRACT'
  | 'FULL_TIME'
  | 'INTERNSHIP'
  | 'PART_TIME';

export type LanguageInput = {
  name: string;
  proficiency: LanguageProficiency;
};

export type LanguageProficiency =
  | 'BASIC'
  | 'CONVERSATIONAL'
  | 'FLUENT'
  | 'NATIVE';

export type LoginInput = {
  email: string;
  password: string;
};

export type NotificationType =
  | 'APPLICATION_STATUS_CHANGED'
  | 'INTERVIEW_REMINDER';

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type RegisterInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type ResetPasswordInput = {
  newPassword: string;
  token: string;
};

export type SkillInput = {
  level: SkillLevel;
  name: string;
  yearsOfExperience?: number | null | undefined;
};

export type SkillLevel =
  | 'ADVANCED'
  | 'BEGINNER'
  | 'EXPERT'
  | 'INTERMEDIATE';

export type UpdateProfileInput = {
  bio?: string | null | undefined;
  githubUrl?: string | null | undefined;
  headline?: string | null | undefined;
  linkedinUrl?: string | null | undefined;
  location?: string | null | undefined;
  portfolioUrl?: string | null | undefined;
};

export type UserRole =
  | 'ADMIN'
  | 'USER';

export type WorkMode =
  | 'HYBRID'
  | 'ONSITE'
  | 'REMOTE';

export type ApplicationsAnalyticsFieldsFragment = { funnel: Array<{ status: ApplicationStatus, count: number }>, trend: Array<{ period: string, count: number }>, successRates: { totalApplications: number, totalOffers: number, totalAccepted: number, totalRejected: number, offerRate: number, acceptanceRate: number }, interviewsByRound: Array<{ round: InterviewRound, count: number }> };

export type ApplicationsAnalyticsQueryVariables = Exact<{
  range?: DateRangeInput | null | undefined;
}>;


export type ApplicationsAnalyticsQuery = { applicationsAnalytics: { funnel: Array<{ status: ApplicationStatus, count: number }>, trend: Array<{ period: string, count: number }>, successRates: { totalApplications: number, totalOffers: number, totalAccepted: number, totalRejected: number, offerRate: number, acceptanceRate: number }, interviewsByRound: Array<{ round: InterviewRound, count: number }> } };

export type ApplicationFieldsFragment = { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type UpdateApplicationStatusMutationVariables = Exact<{
  applicationId: string | number;
  status: ApplicationStatus;
}>;


export type UpdateApplicationStatusMutation = { updateApplicationStatus: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } };

export type RemoveApplicationMutationVariables = Exact<{
  applicationId: string | number;
}>;


export type RemoveApplicationMutation = { removeApplication: boolean };

export type MyApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyApplicationsQuery = { myApplications: Array<{ id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } }> };

export type ApplicationStatusHistoryQueryVariables = Exact<{
  applicationId: string | number;
}>;


export type ApplicationStatusHistoryQuery = { applicationStatusHistory: Array<{ id: string, fromStatus: ApplicationStatus | null, toStatus: ApplicationStatus, changedAt: string }> };

export type AuthUserFieldsFragment = { id: string, email: string, firstName: string, lastName: string, role: UserRole, isEmailVerified: boolean, createdAt: string };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { accessToken: string, user: { id: string, email: string, firstName: string, lastName: string, role: UserRole, isEmailVerified: boolean, createdAt: string } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { accessToken: string, user: { id: string, email: string, firstName: string, lastName: string, role: UserRole, isEmailVerified: boolean, createdAt: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { refreshToken: { accessToken: string, user: { id: string, email: string, firstName: string, lastName: string, role: UserRole, isEmailVerified: boolean, createdAt: string } } };

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { forgotPassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { resetPassword: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email: string, firstName: string, lastName: string, role: UserRole, isEmailVerified: boolean, createdAt: string } };

export type DocumentFieldsFragment = { id: string, type: DocumentType, fileName: string, fileSize: number, mimeType: string, createdAt: string };

export type DocumentWithContentFieldsFragment = { fileUrl: string, id: string, type: DocumentType, fileName: string, fileSize: number, mimeType: string, createdAt: string };

export type UploadDocumentMutationVariables = Exact<{
  type: DocumentType;
  fileName: string;
  mimeType: string;
  content: string;
}>;


export type UploadDocumentMutation = { uploadDocument: { id: string, type: DocumentType, fileName: string, fileSize: number, mimeType: string, createdAt: string } };

export type DeleteDocumentMutationVariables = Exact<{
  documentId: string | number;
}>;


export type DeleteDocumentMutation = { deleteDocument: boolean };

export type MyDocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyDocumentsQuery = { myDocuments: Array<{ id: string, type: DocumentType, fileName: string, fileSize: number, mimeType: string, createdAt: string }> };

export type DocumentQueryVariables = Exact<{
  id: string | number;
}>;


export type DocumentQuery = { document: { fileUrl: string, id: string, type: DocumentType, fileName: string, fileSize: number, mimeType: string, createdAt: string } };

export type InterviewFieldsFragment = { id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } };

export type ScheduleInterviewMutationVariables = Exact<{
  applicationId: string | number;
  input: InterviewInput;
}>;


export type ScheduleInterviewMutation = { scheduleInterview: { id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } } };

export type UpdateInterviewMutationVariables = Exact<{
  interviewId: string | number;
  input: InterviewInput;
}>;


export type UpdateInterviewMutation = { updateInterview: { id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } } };

export type SetInterviewOutcomeMutationVariables = Exact<{
  interviewId: string | number;
  outcome: InterviewOutcome;
}>;


export type SetInterviewOutcomeMutation = { setInterviewOutcome: { id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } } };

export type DeleteInterviewMutationVariables = Exact<{
  interviewId: string | number;
}>;


export type DeleteInterviewMutation = { deleteInterview: boolean };

export type MyInterviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyInterviewsQuery = { myInterviews: Array<{ id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } }> };

export type UpcomingInterviewsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type UpcomingInterviewsQuery = { upcomingInterviews: Array<{ id: string, round: InterviewRound, scheduledAt: string | null, outcome: InterviewOutcome, notes: string | null, createdAt: string, application: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } } }> };

export type JobFieldsFragment = { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string };

export type SaveJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type SaveJobMutation = { saveJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type UnsaveJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type UnsaveJobMutation = { unsaveJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type ApplyToJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type ApplyToJobMutation = { applyToJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type AddCustomJobMutationVariables = Exact<{
  input: CustomJobInput;
}>;


export type AddCustomJobMutation = { addCustomJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type UpdateCustomJobMutationVariables = Exact<{
  jobId: string | number;
  input: CustomJobInput;
}>;


export type UpdateCustomJobMutation = { updateCustomJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type JobsQueryVariables = Exact<{
  filter?: JobFilterInput | null | undefined;
  pagination?: PaginationInput | null | undefined;
}>;


export type JobsQuery = { jobs: { total: number, page: number, pageSize: number, totalPages: number, items: Array<{ id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string }> } };

export type JobQueryVariables = Exact<{
  id: string | number;
}>;


export type JobQuery = { job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type MyCustomJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCustomJobsQuery = { myCustomJobs: Array<{ id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string }> };

export type CustomJobDetailQueryVariables = Exact<{
  jobId: string | number;
}>;


export type CustomJobDetailQuery = { customJobDetail: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, experienceRequired: string | null, contactEmail: string | null, postedAt: string | null, coverLetter: string | null, pitchEmail: string | null, applicationMode: ApplicationMode | null, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type NotificationFieldsFragment = { id: string, type: NotificationType, title: string, message: string, link: string | null, readAt: string | null, createdAt: string };

export type MarkNotificationReadMutationVariables = Exact<{
  notificationId: string | number;
}>;


export type MarkNotificationReadMutation = { markNotificationRead: { id: string, type: NotificationType, title: string, message: string, link: string | null, readAt: string | null, createdAt: string } };

export type MarkAllNotificationsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsReadMutation = { markAllNotificationsRead: boolean };

export type MyNotificationsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type MyNotificationsQuery = { myNotifications: Array<{ id: string, type: NotificationType, title: string, message: string, link: string | null, readAt: string | null, createdAt: string }> };

export type UnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationCountQuery = { unreadNotificationCount: number };

export type EducationFieldsFragment = { id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null };

export type ExperienceFieldsFragment = { id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null };

export type LanguageFieldsFragment = { id: string, name: string, proficiency: LanguageProficiency };

export type SkillFieldsFragment = { id: string, name: string, level: SkillLevel, yearsOfExperience: number | null };

export type ProfileFieldsFragment = { id: string, headline: string | null, bio: string | null, location: string | null, githubUrl: string | null, linkedinUrl: string | null, portfolioUrl: string | null, completionPercentage: number, educations: Array<{ id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null }>, experiences: Array<{ id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null }>, languages: Array<{ id: string, name: string, proficiency: LanguageProficiency }>, skills: Array<{ id: string, name: string, level: SkillLevel, yearsOfExperience: number | null }> };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile: { id: string, headline: string | null, bio: string | null, location: string | null, githubUrl: string | null, linkedinUrl: string | null, portfolioUrl: string | null, completionPercentage: number, educations: Array<{ id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null }>, experiences: Array<{ id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null }>, languages: Array<{ id: string, name: string, proficiency: LanguageProficiency }>, skills: Array<{ id: string, name: string, level: SkillLevel, yearsOfExperience: number | null }> } };

export type AddEducationMutationVariables = Exact<{
  input: EducationInput;
}>;


export type AddEducationMutation = { addEducation: { id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null } };

export type UpdateEducationMutationVariables = Exact<{
  educationId: string | number;
  input: EducationInput;
}>;


export type UpdateEducationMutation = { updateEducation: { id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null } };

export type RemoveEducationMutationVariables = Exact<{
  educationId: string | number;
}>;


export type RemoveEducationMutation = { removeEducation: boolean };

export type AddExperienceMutationVariables = Exact<{
  input: ExperienceInput;
}>;


export type AddExperienceMutation = { addExperience: { id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null } };

export type UpdateExperienceMutationVariables = Exact<{
  experienceId: string | number;
  input: ExperienceInput;
}>;


export type UpdateExperienceMutation = { updateExperience: { id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null } };

export type RemoveExperienceMutationVariables = Exact<{
  experienceId: string | number;
}>;


export type RemoveExperienceMutation = { removeExperience: boolean };

export type AddLanguageMutationVariables = Exact<{
  input: LanguageInput;
}>;


export type AddLanguageMutation = { addLanguage: { id: string, name: string, proficiency: LanguageProficiency } };

export type UpdateLanguageMutationVariables = Exact<{
  languageId: string | number;
  input: LanguageInput;
}>;


export type UpdateLanguageMutation = { updateLanguage: { id: string, name: string, proficiency: LanguageProficiency } };

export type RemoveLanguageMutationVariables = Exact<{
  languageId: string | number;
}>;


export type RemoveLanguageMutation = { removeLanguage: boolean };

export type AddSkillMutationVariables = Exact<{
  input: SkillInput;
}>;


export type AddSkillMutation = { addSkill: { id: string, name: string, level: SkillLevel, yearsOfExperience: number | null } };

export type UpdateSkillMutationVariables = Exact<{
  skillId: string | number;
  input: SkillInput;
}>;


export type UpdateSkillMutation = { updateSkill: { id: string, name: string, level: SkillLevel, yearsOfExperience: number | null } };

export type RemoveSkillMutationVariables = Exact<{
  skillId: string | number;
}>;


export type RemoveSkillMutation = { removeSkill: boolean };

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = { myProfile: { id: string, headline: string | null, bio: string | null, location: string | null, githubUrl: string | null, linkedinUrl: string | null, portfolioUrl: string | null, completionPercentage: number, educations: Array<{ id: string, institution: string, degree: string, fieldOfStudy: string | null, startDate: string, endDate: string | null, grade: string | null }>, experiences: Array<{ id: string, company: string, title: string, location: string | null, startDate: string, endDate: string | null, isCurrent: boolean, description: string | null }>, languages: Array<{ id: string, name: string, proficiency: LanguageProficiency }>, skills: Array<{ id: string, name: string, level: SkillLevel, yearsOfExperience: number | null }> } };

export type ResumeVersionFieldsFragment = { id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string } };

export type ResumeVersionWithContentFieldsFragment = { id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string, fileUrl: string } };

export type UploadResumeMutationVariables = Exact<{
  fileName: string;
  mimeType: string;
  content: string;
}>;


export type UploadResumeMutation = { uploadResume: { id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string } } };

export type SetActiveResumeMutationVariables = Exact<{
  resumeVersionId: string | number;
}>;


export type SetActiveResumeMutation = { setActiveResume: { id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string } } };

export type DeleteResumeVersionMutationVariables = Exact<{
  resumeVersionId: string | number;
}>;


export type DeleteResumeVersionMutation = { deleteResumeVersion: boolean };

export type MyResumeVersionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyResumeVersionsQuery = { myResumeVersions: Array<{ id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string } }> };

export type ResumeVersionQueryVariables = Exact<{
  id: string | number;
}>;


export type ResumeVersionQuery = { resumeVersion: { id: string, version: number, isActive: boolean, createdAt: string, document: { id: string, fileName: string, fileSize: number, mimeType: string, fileUrl: string } } };

export const ApplicationsAnalyticsFieldsFragmentDoc = gql`
    fragment ApplicationsAnalyticsFields on ApplicationsAnalytics {
  funnel {
    status
    count
  }
  trend {
    period
    count
  }
  successRates {
    totalApplications
    totalOffers
    totalAccepted
    totalRejected
    offerRate
    acceptanceRate
  }
  interviewsByRound {
    round
    count
  }
}
    `;
export const AuthUserFieldsFragmentDoc = gql`
    fragment AuthUserFields on User {
  id
  email
  firstName
  lastName
  role
  isEmailVerified
  createdAt
}
    `;
export const DocumentFieldsFragmentDoc = gql`
    fragment DocumentFields on Document {
  id
  type
  fileName
  fileSize
  mimeType
  createdAt
}
    `;
export const DocumentWithContentFieldsFragmentDoc = gql`
    fragment DocumentWithContentFields on Document {
  ...DocumentFields
  fileUrl
}
    ${DocumentFieldsFragmentDoc}`;
export const JobFieldsFragmentDoc = gql`
    fragment JobFields on Job {
  id
  title
  company
  location
  description
  type
  workMode
  salaryMin
  salaryMax
  externalUrl
  skills
  experienceRequired
  contactEmail
  postedAt
  coverLetter
  pitchEmail
  applicationMode
  applicationStatus
  createdAt
}
    `;
export const ApplicationFieldsFragmentDoc = gql`
    fragment ApplicationFields on Application {
  id
  status
  notes
  appliedAt
  createdAt
  updatedAt
  job {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export const InterviewFieldsFragmentDoc = gql`
    fragment InterviewFields on Interview {
  id
  round
  scheduledAt
  outcome
  notes
  createdAt
  application {
    ...ApplicationFields
  }
}
    ${ApplicationFieldsFragmentDoc}`;
export const NotificationFieldsFragmentDoc = gql`
    fragment NotificationFields on Notification {
  id
  type
  title
  message
  link
  readAt
  createdAt
}
    `;
export const EducationFieldsFragmentDoc = gql`
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
export const ExperienceFieldsFragmentDoc = gql`
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
export const LanguageFieldsFragmentDoc = gql`
    fragment LanguageFields on Language {
  id
  name
  proficiency
}
    `;
export const SkillFieldsFragmentDoc = gql`
    fragment SkillFields on Skill {
  id
  name
  level
  yearsOfExperience
}
    `;
export const ProfileFieldsFragmentDoc = gql`
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
    ${EducationFieldsFragmentDoc}
${ExperienceFieldsFragmentDoc}
${LanguageFieldsFragmentDoc}
${SkillFieldsFragmentDoc}`;
export const ResumeVersionFieldsFragmentDoc = gql`
    fragment ResumeVersionFields on ResumeVersion {
  id
  version
  isActive
  createdAt
  document {
    id
    fileName
    fileSize
    mimeType
  }
}
    `;
export const ResumeVersionWithContentFieldsFragmentDoc = gql`
    fragment ResumeVersionWithContentFields on ResumeVersion {
  ...ResumeVersionFields
  document {
    id
    fileName
    fileSize
    mimeType
    fileUrl
  }
}
    ${ResumeVersionFieldsFragmentDoc}`;
export const ApplicationsAnalyticsDocument = gql`
    query ApplicationsAnalytics($range: DateRangeInput) {
  applicationsAnalytics(range: $range) {
    ...ApplicationsAnalyticsFields
  }
}
    ${ApplicationsAnalyticsFieldsFragmentDoc}`;

/**
 * __useApplicationsAnalyticsQuery__
 *
 * To run a query within a React component, call `useApplicationsAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationsAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationsAnalyticsQuery({
 *   variables: {
 *      range: // value for 'range'
 *   },
 * });
 */
export function useApplicationsAnalyticsQuery(baseOptions?: Apollo.QueryHookOptions<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>(ApplicationsAnalyticsDocument, options);
      }
export function useApplicationsAnalyticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>(ApplicationsAnalyticsDocument, options);
        }
// @ts-ignore
export function useApplicationsAnalyticsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>;
export function useApplicationsAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>): Apollo.UseSuspenseQueryResult<ApplicationsAnalyticsQuery | undefined, ApplicationsAnalyticsQueryVariables>;
export function useApplicationsAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>(ApplicationsAnalyticsDocument, options);
        }
export type ApplicationsAnalyticsQueryHookResult = ReturnType<typeof useApplicationsAnalyticsQuery>;
export type ApplicationsAnalyticsLazyQueryHookResult = ReturnType<typeof useApplicationsAnalyticsLazyQuery>;
export type ApplicationsAnalyticsSuspenseQueryHookResult = ReturnType<typeof useApplicationsAnalyticsSuspenseQuery>;
export type ApplicationsAnalyticsQueryResult = Apollo.QueryResult<ApplicationsAnalyticsQuery, ApplicationsAnalyticsQueryVariables>;
export const UpdateApplicationStatusDocument = gql`
    mutation UpdateApplicationStatus($applicationId: ID!, $status: ApplicationStatus!) {
  updateApplicationStatus(applicationId: $applicationId, status: $status) {
    ...ApplicationFields
  }
}
    ${ApplicationFieldsFragmentDoc}`;
export type UpdateApplicationStatusMutationFn = Apollo.MutationFunction<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>;

/**
 * __useUpdateApplicationStatusMutation__
 *
 * To run a mutation, you first call `useUpdateApplicationStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationStatusMutation, { data, loading, error }] = useUpdateApplicationStatusMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateApplicationStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>(UpdateApplicationStatusDocument, options);
      }
export type UpdateApplicationStatusMutationHookResult = ReturnType<typeof useUpdateApplicationStatusMutation>;
export type UpdateApplicationStatusMutationResult = Apollo.MutationResult<UpdateApplicationStatusMutation>;
export type UpdateApplicationStatusMutationOptions = Apollo.BaseMutationOptions<UpdateApplicationStatusMutation, UpdateApplicationStatusMutationVariables>;
export const RemoveApplicationDocument = gql`
    mutation RemoveApplication($applicationId: ID!) {
  removeApplication(applicationId: $applicationId)
}
    `;
export type RemoveApplicationMutationFn = Apollo.MutationFunction<RemoveApplicationMutation, RemoveApplicationMutationVariables>;

/**
 * __useRemoveApplicationMutation__
 *
 * To run a mutation, you first call `useRemoveApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeApplicationMutation, { data, loading, error }] = useRemoveApplicationMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useRemoveApplicationMutation(baseOptions?: Apollo.MutationHookOptions<RemoveApplicationMutation, RemoveApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveApplicationMutation, RemoveApplicationMutationVariables>(RemoveApplicationDocument, options);
      }
export type RemoveApplicationMutationHookResult = ReturnType<typeof useRemoveApplicationMutation>;
export type RemoveApplicationMutationResult = Apollo.MutationResult<RemoveApplicationMutation>;
export type RemoveApplicationMutationOptions = Apollo.BaseMutationOptions<RemoveApplicationMutation, RemoveApplicationMutationVariables>;
export const MyApplicationsDocument = gql`
    query MyApplications {
  myApplications {
    ...ApplicationFields
  }
}
    ${ApplicationFieldsFragmentDoc}`;

/**
 * __useMyApplicationsQuery__
 *
 * To run a query within a React component, call `useMyApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<MyApplicationsQuery, MyApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyApplicationsQuery, MyApplicationsQueryVariables>(MyApplicationsDocument, options);
      }
export function useMyApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyApplicationsQuery, MyApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyApplicationsQuery, MyApplicationsQueryVariables>(MyApplicationsDocument, options);
        }
// @ts-ignore
export function useMyApplicationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyApplicationsQuery, MyApplicationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyApplicationsQuery, MyApplicationsQueryVariables>;
export function useMyApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyApplicationsQuery, MyApplicationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyApplicationsQuery | undefined, MyApplicationsQueryVariables>;
export function useMyApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyApplicationsQuery, MyApplicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyApplicationsQuery, MyApplicationsQueryVariables>(MyApplicationsDocument, options);
        }
export type MyApplicationsQueryHookResult = ReturnType<typeof useMyApplicationsQuery>;
export type MyApplicationsLazyQueryHookResult = ReturnType<typeof useMyApplicationsLazyQuery>;
export type MyApplicationsSuspenseQueryHookResult = ReturnType<typeof useMyApplicationsSuspenseQuery>;
export type MyApplicationsQueryResult = Apollo.QueryResult<MyApplicationsQuery, MyApplicationsQueryVariables>;
export const ApplicationStatusHistoryDocument = gql`
    query ApplicationStatusHistory($applicationId: ID!) {
  applicationStatusHistory(applicationId: $applicationId) {
    id
    fromStatus
    toStatus
    changedAt
  }
}
    `;

/**
 * __useApplicationStatusHistoryQuery__
 *
 * To run a query within a React component, call `useApplicationStatusHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationStatusHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationStatusHistoryQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useApplicationStatusHistoryQuery(baseOptions: Apollo.QueryHookOptions<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables> & ({ variables: ApplicationStatusHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>(ApplicationStatusHistoryDocument, options);
      }
export function useApplicationStatusHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>(ApplicationStatusHistoryDocument, options);
        }
// @ts-ignore
export function useApplicationStatusHistorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>;
export function useApplicationStatusHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>): Apollo.UseSuspenseQueryResult<ApplicationStatusHistoryQuery | undefined, ApplicationStatusHistoryQueryVariables>;
export function useApplicationStatusHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>(ApplicationStatusHistoryDocument, options);
        }
export type ApplicationStatusHistoryQueryHookResult = ReturnType<typeof useApplicationStatusHistoryQuery>;
export type ApplicationStatusHistoryLazyQueryHookResult = ReturnType<typeof useApplicationStatusHistoryLazyQuery>;
export type ApplicationStatusHistorySuspenseQueryHookResult = ReturnType<typeof useApplicationStatusHistorySuspenseQuery>;
export type ApplicationStatusHistoryQueryResult = Apollo.QueryResult<ApplicationStatusHistoryQuery, ApplicationStatusHistoryQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    user {
      ...AuthUserFields
    }
  }
}
    ${AuthUserFieldsFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      ...AuthUserFields
    }
  }
}
    ${AuthUserFieldsFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken {
  refreshToken {
    accessToken
    user {
      ...AuthUserFields
    }
  }
}
    ${AuthUserFieldsFragmentDoc}`;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($input: ForgotPasswordInput!) {
  forgotPassword(input: $input)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...AuthUserFields
  }
}
    ${AuthUserFieldsFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UploadDocumentDocument = gql`
    mutation UploadDocument($type: DocumentType!, $fileName: String!, $mimeType: String!, $content: String!) {
  uploadDocument(
    type: $type
    fileName: $fileName
    mimeType: $mimeType
    content: $content
  ) {
    ...DocumentFields
  }
}
    ${DocumentFieldsFragmentDoc}`;
export type UploadDocumentMutationFn = Apollo.MutationFunction<UploadDocumentMutation, UploadDocumentMutationVariables>;

/**
 * __useUploadDocumentMutation__
 *
 * To run a mutation, you first call `useUploadDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadDocumentMutation, { data, loading, error }] = useUploadDocumentMutation({
 *   variables: {
 *      type: // value for 'type'
 *      fileName: // value for 'fileName'
 *      mimeType: // value for 'mimeType'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUploadDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UploadDocumentMutation, UploadDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadDocumentMutation, UploadDocumentMutationVariables>(UploadDocumentDocument, options);
      }
export type UploadDocumentMutationHookResult = ReturnType<typeof useUploadDocumentMutation>;
export type UploadDocumentMutationResult = Apollo.MutationResult<UploadDocumentMutation>;
export type UploadDocumentMutationOptions = Apollo.BaseMutationOptions<UploadDocumentMutation, UploadDocumentMutationVariables>;
export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($documentId: ID!) {
  deleteDocument(documentId: $documentId)
}
    `;
export type DeleteDocumentMutationFn = Apollo.MutationFunction<DeleteDocumentMutation, DeleteDocumentMutationVariables>;

/**
 * __useDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDocumentMutation, { data, loading, error }] = useDeleteDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *   },
 * });
 */
export function useDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument, options);
      }
export type DeleteDocumentMutationHookResult = ReturnType<typeof useDeleteDocumentMutation>;
export type DeleteDocumentMutationResult = Apollo.MutationResult<DeleteDocumentMutation>;
export type DeleteDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const MyDocumentsDocument = gql`
    query MyDocuments {
  myDocuments {
    ...DocumentFields
  }
}
    ${DocumentFieldsFragmentDoc}`;

/**
 * __useMyDocumentsQuery__
 *
 * To run a query within a React component, call `useMyDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyDocumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<MyDocumentsQuery, MyDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyDocumentsQuery, MyDocumentsQueryVariables>(MyDocumentsDocument, options);
      }
export function useMyDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyDocumentsQuery, MyDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyDocumentsQuery, MyDocumentsQueryVariables>(MyDocumentsDocument, options);
        }
// @ts-ignore
export function useMyDocumentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyDocumentsQuery, MyDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<MyDocumentsQuery, MyDocumentsQueryVariables>;
export function useMyDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyDocumentsQuery, MyDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<MyDocumentsQuery | undefined, MyDocumentsQueryVariables>;
export function useMyDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyDocumentsQuery, MyDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyDocumentsQuery, MyDocumentsQueryVariables>(MyDocumentsDocument, options);
        }
export type MyDocumentsQueryHookResult = ReturnType<typeof useMyDocumentsQuery>;
export type MyDocumentsLazyQueryHookResult = ReturnType<typeof useMyDocumentsLazyQuery>;
export type MyDocumentsSuspenseQueryHookResult = ReturnType<typeof useMyDocumentsSuspenseQuery>;
export type MyDocumentsQueryResult = Apollo.QueryResult<MyDocumentsQuery, MyDocumentsQueryVariables>;
export const DocumentDocument = gql`
    query Document($id: ID!) {
  document(id: $id) {
    ...DocumentWithContentFields
  }
}
    ${DocumentWithContentFieldsFragmentDoc}`;

/**
 * __useDocumentQuery__
 *
 * To run a query within a React component, call `useDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDocumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDocumentQuery(baseOptions: Apollo.QueryHookOptions<DocumentQuery, DocumentQueryVariables> & ({ variables: DocumentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DocumentQuery, DocumentQueryVariables>(DocumentDocument, options);
      }
export function useDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DocumentQuery, DocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DocumentQuery, DocumentQueryVariables>(DocumentDocument, options);
        }
// @ts-ignore
export function useDocumentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DocumentQuery, DocumentQueryVariables>): Apollo.UseSuspenseQueryResult<DocumentQuery, DocumentQueryVariables>;
export function useDocumentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DocumentQuery, DocumentQueryVariables>): Apollo.UseSuspenseQueryResult<DocumentQuery | undefined, DocumentQueryVariables>;
export function useDocumentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DocumentQuery, DocumentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DocumentQuery, DocumentQueryVariables>(DocumentDocument, options);
        }
export type DocumentQueryHookResult = ReturnType<typeof useDocumentQuery>;
export type DocumentLazyQueryHookResult = ReturnType<typeof useDocumentLazyQuery>;
export type DocumentSuspenseQueryHookResult = ReturnType<typeof useDocumentSuspenseQuery>;
export type DocumentQueryResult = Apollo.QueryResult<DocumentQuery, DocumentQueryVariables>;
export const ScheduleInterviewDocument = gql`
    mutation ScheduleInterview($applicationId: ID!, $input: InterviewInput!) {
  scheduleInterview(applicationId: $applicationId, input: $input) {
    ...InterviewFields
  }
}
    ${InterviewFieldsFragmentDoc}`;
export type ScheduleInterviewMutationFn = Apollo.MutationFunction<ScheduleInterviewMutation, ScheduleInterviewMutationVariables>;

/**
 * __useScheduleInterviewMutation__
 *
 * To run a mutation, you first call `useScheduleInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useScheduleInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [scheduleInterviewMutation, { data, loading, error }] = useScheduleInterviewMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useScheduleInterviewMutation(baseOptions?: Apollo.MutationHookOptions<ScheduleInterviewMutation, ScheduleInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ScheduleInterviewMutation, ScheduleInterviewMutationVariables>(ScheduleInterviewDocument, options);
      }
export type ScheduleInterviewMutationHookResult = ReturnType<typeof useScheduleInterviewMutation>;
export type ScheduleInterviewMutationResult = Apollo.MutationResult<ScheduleInterviewMutation>;
export type ScheduleInterviewMutationOptions = Apollo.BaseMutationOptions<ScheduleInterviewMutation, ScheduleInterviewMutationVariables>;
export const UpdateInterviewDocument = gql`
    mutation UpdateInterview($interviewId: ID!, $input: InterviewInput!) {
  updateInterview(interviewId: $interviewId, input: $input) {
    ...InterviewFields
  }
}
    ${InterviewFieldsFragmentDoc}`;
export type UpdateInterviewMutationFn = Apollo.MutationFunction<UpdateInterviewMutation, UpdateInterviewMutationVariables>;

/**
 * __useUpdateInterviewMutation__
 *
 * To run a mutation, you first call `useUpdateInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInterviewMutation, { data, loading, error }] = useUpdateInterviewMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInterviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInterviewMutation, UpdateInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInterviewMutation, UpdateInterviewMutationVariables>(UpdateInterviewDocument, options);
      }
export type UpdateInterviewMutationHookResult = ReturnType<typeof useUpdateInterviewMutation>;
export type UpdateInterviewMutationResult = Apollo.MutationResult<UpdateInterviewMutation>;
export type UpdateInterviewMutationOptions = Apollo.BaseMutationOptions<UpdateInterviewMutation, UpdateInterviewMutationVariables>;
export const SetInterviewOutcomeDocument = gql`
    mutation SetInterviewOutcome($interviewId: ID!, $outcome: InterviewOutcome!) {
  setInterviewOutcome(interviewId: $interviewId, outcome: $outcome) {
    ...InterviewFields
  }
}
    ${InterviewFieldsFragmentDoc}`;
export type SetInterviewOutcomeMutationFn = Apollo.MutationFunction<SetInterviewOutcomeMutation, SetInterviewOutcomeMutationVariables>;

/**
 * __useSetInterviewOutcomeMutation__
 *
 * To run a mutation, you first call `useSetInterviewOutcomeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetInterviewOutcomeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setInterviewOutcomeMutation, { data, loading, error }] = useSetInterviewOutcomeMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *      outcome: // value for 'outcome'
 *   },
 * });
 */
export function useSetInterviewOutcomeMutation(baseOptions?: Apollo.MutationHookOptions<SetInterviewOutcomeMutation, SetInterviewOutcomeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetInterviewOutcomeMutation, SetInterviewOutcomeMutationVariables>(SetInterviewOutcomeDocument, options);
      }
export type SetInterviewOutcomeMutationHookResult = ReturnType<typeof useSetInterviewOutcomeMutation>;
export type SetInterviewOutcomeMutationResult = Apollo.MutationResult<SetInterviewOutcomeMutation>;
export type SetInterviewOutcomeMutationOptions = Apollo.BaseMutationOptions<SetInterviewOutcomeMutation, SetInterviewOutcomeMutationVariables>;
export const DeleteInterviewDocument = gql`
    mutation DeleteInterview($interviewId: ID!) {
  deleteInterview(interviewId: $interviewId)
}
    `;
export type DeleteInterviewMutationFn = Apollo.MutationFunction<DeleteInterviewMutation, DeleteInterviewMutationVariables>;

/**
 * __useDeleteInterviewMutation__
 *
 * To run a mutation, you first call `useDeleteInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInterviewMutation, { data, loading, error }] = useDeleteInterviewMutation({
 *   variables: {
 *      interviewId: // value for 'interviewId'
 *   },
 * });
 */
export function useDeleteInterviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInterviewMutation, DeleteInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInterviewMutation, DeleteInterviewMutationVariables>(DeleteInterviewDocument, options);
      }
export type DeleteInterviewMutationHookResult = ReturnType<typeof useDeleteInterviewMutation>;
export type DeleteInterviewMutationResult = Apollo.MutationResult<DeleteInterviewMutation>;
export type DeleteInterviewMutationOptions = Apollo.BaseMutationOptions<DeleteInterviewMutation, DeleteInterviewMutationVariables>;
export const MyInterviewsDocument = gql`
    query MyInterviews {
  myInterviews {
    ...InterviewFields
  }
}
    ${InterviewFieldsFragmentDoc}`;

/**
 * __useMyInterviewsQuery__
 *
 * To run a query within a React component, call `useMyInterviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyInterviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyInterviewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyInterviewsQuery(baseOptions?: Apollo.QueryHookOptions<MyInterviewsQuery, MyInterviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyInterviewsQuery, MyInterviewsQueryVariables>(MyInterviewsDocument, options);
      }
export function useMyInterviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyInterviewsQuery, MyInterviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyInterviewsQuery, MyInterviewsQueryVariables>(MyInterviewsDocument, options);
        }
// @ts-ignore
export function useMyInterviewsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyInterviewsQuery, MyInterviewsQueryVariables>): Apollo.UseSuspenseQueryResult<MyInterviewsQuery, MyInterviewsQueryVariables>;
export function useMyInterviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyInterviewsQuery, MyInterviewsQueryVariables>): Apollo.UseSuspenseQueryResult<MyInterviewsQuery | undefined, MyInterviewsQueryVariables>;
export function useMyInterviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyInterviewsQuery, MyInterviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyInterviewsQuery, MyInterviewsQueryVariables>(MyInterviewsDocument, options);
        }
export type MyInterviewsQueryHookResult = ReturnType<typeof useMyInterviewsQuery>;
export type MyInterviewsLazyQueryHookResult = ReturnType<typeof useMyInterviewsLazyQuery>;
export type MyInterviewsSuspenseQueryHookResult = ReturnType<typeof useMyInterviewsSuspenseQuery>;
export type MyInterviewsQueryResult = Apollo.QueryResult<MyInterviewsQuery, MyInterviewsQueryVariables>;
export const UpcomingInterviewsDocument = gql`
    query UpcomingInterviews($limit: Int) {
  upcomingInterviews(limit: $limit) {
    ...InterviewFields
  }
}
    ${InterviewFieldsFragmentDoc}`;

/**
 * __useUpcomingInterviewsQuery__
 *
 * To run a query within a React component, call `useUpcomingInterviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpcomingInterviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpcomingInterviewsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUpcomingInterviewsQuery(baseOptions?: Apollo.QueryHookOptions<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>(UpcomingInterviewsDocument, options);
      }
export function useUpcomingInterviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>(UpcomingInterviewsDocument, options);
        }
// @ts-ignore
export function useUpcomingInterviewsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>): Apollo.UseSuspenseQueryResult<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>;
export function useUpcomingInterviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>): Apollo.UseSuspenseQueryResult<UpcomingInterviewsQuery | undefined, UpcomingInterviewsQueryVariables>;
export function useUpcomingInterviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>(UpcomingInterviewsDocument, options);
        }
export type UpcomingInterviewsQueryHookResult = ReturnType<typeof useUpcomingInterviewsQuery>;
export type UpcomingInterviewsLazyQueryHookResult = ReturnType<typeof useUpcomingInterviewsLazyQuery>;
export type UpcomingInterviewsSuspenseQueryHookResult = ReturnType<typeof useUpcomingInterviewsSuspenseQuery>;
export type UpcomingInterviewsQueryResult = Apollo.QueryResult<UpcomingInterviewsQuery, UpcomingInterviewsQueryVariables>;
export const SaveJobDocument = gql`
    mutation SaveJob($jobId: ID!) {
  saveJob(jobId: $jobId) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export type SaveJobMutationFn = Apollo.MutationFunction<SaveJobMutation, SaveJobMutationVariables>;

/**
 * __useSaveJobMutation__
 *
 * To run a mutation, you first call `useSaveJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveJobMutation, { data, loading, error }] = useSaveJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useSaveJobMutation(baseOptions?: Apollo.MutationHookOptions<SaveJobMutation, SaveJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveJobMutation, SaveJobMutationVariables>(SaveJobDocument, options);
      }
export type SaveJobMutationHookResult = ReturnType<typeof useSaveJobMutation>;
export type SaveJobMutationResult = Apollo.MutationResult<SaveJobMutation>;
export type SaveJobMutationOptions = Apollo.BaseMutationOptions<SaveJobMutation, SaveJobMutationVariables>;
export const UnsaveJobDocument = gql`
    mutation UnsaveJob($jobId: ID!) {
  unsaveJob(jobId: $jobId) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export type UnsaveJobMutationFn = Apollo.MutationFunction<UnsaveJobMutation, UnsaveJobMutationVariables>;

/**
 * __useUnsaveJobMutation__
 *
 * To run a mutation, you first call `useUnsaveJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsaveJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsaveJobMutation, { data, loading, error }] = useUnsaveJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useUnsaveJobMutation(baseOptions?: Apollo.MutationHookOptions<UnsaveJobMutation, UnsaveJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsaveJobMutation, UnsaveJobMutationVariables>(UnsaveJobDocument, options);
      }
export type UnsaveJobMutationHookResult = ReturnType<typeof useUnsaveJobMutation>;
export type UnsaveJobMutationResult = Apollo.MutationResult<UnsaveJobMutation>;
export type UnsaveJobMutationOptions = Apollo.BaseMutationOptions<UnsaveJobMutation, UnsaveJobMutationVariables>;
export const ApplyToJobDocument = gql`
    mutation ApplyToJob($jobId: ID!) {
  applyToJob(jobId: $jobId) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export type ApplyToJobMutationFn = Apollo.MutationFunction<ApplyToJobMutation, ApplyToJobMutationVariables>;

/**
 * __useApplyToJobMutation__
 *
 * To run a mutation, you first call `useApplyToJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApplyToJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [applyToJobMutation, { data, loading, error }] = useApplyToJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useApplyToJobMutation(baseOptions?: Apollo.MutationHookOptions<ApplyToJobMutation, ApplyToJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApplyToJobMutation, ApplyToJobMutationVariables>(ApplyToJobDocument, options);
      }
export type ApplyToJobMutationHookResult = ReturnType<typeof useApplyToJobMutation>;
export type ApplyToJobMutationResult = Apollo.MutationResult<ApplyToJobMutation>;
export type ApplyToJobMutationOptions = Apollo.BaseMutationOptions<ApplyToJobMutation, ApplyToJobMutationVariables>;
export const AddCustomJobDocument = gql`
    mutation AddCustomJob($input: CustomJobInput!) {
  addCustomJob(input: $input) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export type AddCustomJobMutationFn = Apollo.MutationFunction<AddCustomJobMutation, AddCustomJobMutationVariables>;

/**
 * __useAddCustomJobMutation__
 *
 * To run a mutation, you first call `useAddCustomJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCustomJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCustomJobMutation, { data, loading, error }] = useAddCustomJobMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCustomJobMutation(baseOptions?: Apollo.MutationHookOptions<AddCustomJobMutation, AddCustomJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCustomJobMutation, AddCustomJobMutationVariables>(AddCustomJobDocument, options);
      }
export type AddCustomJobMutationHookResult = ReturnType<typeof useAddCustomJobMutation>;
export type AddCustomJobMutationResult = Apollo.MutationResult<AddCustomJobMutation>;
export type AddCustomJobMutationOptions = Apollo.BaseMutationOptions<AddCustomJobMutation, AddCustomJobMutationVariables>;
export const UpdateCustomJobDocument = gql`
    mutation UpdateCustomJob($jobId: ID!, $input: CustomJobInput!) {
  updateCustomJob(jobId: $jobId, input: $input) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;
export type UpdateCustomJobMutationFn = Apollo.MutationFunction<UpdateCustomJobMutation, UpdateCustomJobMutationVariables>;

/**
 * __useUpdateCustomJobMutation__
 *
 * To run a mutation, you first call `useUpdateCustomJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomJobMutation, { data, loading, error }] = useUpdateCustomJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCustomJobMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomJobMutation, UpdateCustomJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomJobMutation, UpdateCustomJobMutationVariables>(UpdateCustomJobDocument, options);
      }
export type UpdateCustomJobMutationHookResult = ReturnType<typeof useUpdateCustomJobMutation>;
export type UpdateCustomJobMutationResult = Apollo.MutationResult<UpdateCustomJobMutation>;
export type UpdateCustomJobMutationOptions = Apollo.BaseMutationOptions<UpdateCustomJobMutation, UpdateCustomJobMutationVariables>;
export const JobsDocument = gql`
    query Jobs($filter: JobFilterInput, $pagination: PaginationInput) {
  jobs(filter: $filter, pagination: $pagination) {
    total
    page
    pageSize
    totalPages
    items {
      ...JobFields
    }
  }
}
    ${JobFieldsFragmentDoc}`;

/**
 * __useJobsQuery__
 *
 * To run a query within a React component, call `useJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useJobsQuery(baseOptions?: Apollo.QueryHookOptions<JobsQuery, JobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobsQuery, JobsQueryVariables>(JobsDocument, options);
      }
export function useJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobsQuery, JobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobsQuery, JobsQueryVariables>(JobsDocument, options);
        }
// @ts-ignore
export function useJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<JobsQuery, JobsQueryVariables>): Apollo.UseSuspenseQueryResult<JobsQuery, JobsQueryVariables>;
export function useJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobsQuery, JobsQueryVariables>): Apollo.UseSuspenseQueryResult<JobsQuery | undefined, JobsQueryVariables>;
export function useJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobsQuery, JobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobsQuery, JobsQueryVariables>(JobsDocument, options);
        }
export type JobsQueryHookResult = ReturnType<typeof useJobsQuery>;
export type JobsLazyQueryHookResult = ReturnType<typeof useJobsLazyQuery>;
export type JobsSuspenseQueryHookResult = ReturnType<typeof useJobsSuspenseQuery>;
export type JobsQueryResult = Apollo.QueryResult<JobsQuery, JobsQueryVariables>;
export const JobDocument = gql`
    query Job($id: ID!) {
  job(id: $id) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;

/**
 * __useJobQuery__
 *
 * To run a query within a React component, call `useJobQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useJobQuery(baseOptions: Apollo.QueryHookOptions<JobQuery, JobQueryVariables> & ({ variables: JobQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JobQuery, JobQueryVariables>(JobDocument, options);
      }
export function useJobLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobQuery, JobQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JobQuery, JobQueryVariables>(JobDocument, options);
        }
// @ts-ignore
export function useJobSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<JobQuery, JobQueryVariables>): Apollo.UseSuspenseQueryResult<JobQuery, JobQueryVariables>;
export function useJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobQuery, JobQueryVariables>): Apollo.UseSuspenseQueryResult<JobQuery | undefined, JobQueryVariables>;
export function useJobSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<JobQuery, JobQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<JobQuery, JobQueryVariables>(JobDocument, options);
        }
export type JobQueryHookResult = ReturnType<typeof useJobQuery>;
export type JobLazyQueryHookResult = ReturnType<typeof useJobLazyQuery>;
export type JobSuspenseQueryHookResult = ReturnType<typeof useJobSuspenseQuery>;
export type JobQueryResult = Apollo.QueryResult<JobQuery, JobQueryVariables>;
export const MyCustomJobsDocument = gql`
    query MyCustomJobs {
  myCustomJobs {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;

/**
 * __useMyCustomJobsQuery__
 *
 * To run a query within a React component, call `useMyCustomJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCustomJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCustomJobsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyCustomJobsQuery(baseOptions?: Apollo.QueryHookOptions<MyCustomJobsQuery, MyCustomJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCustomJobsQuery, MyCustomJobsQueryVariables>(MyCustomJobsDocument, options);
      }
export function useMyCustomJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCustomJobsQuery, MyCustomJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCustomJobsQuery, MyCustomJobsQueryVariables>(MyCustomJobsDocument, options);
        }
// @ts-ignore
export function useMyCustomJobsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyCustomJobsQuery, MyCustomJobsQueryVariables>): Apollo.UseSuspenseQueryResult<MyCustomJobsQuery, MyCustomJobsQueryVariables>;
export function useMyCustomJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyCustomJobsQuery, MyCustomJobsQueryVariables>): Apollo.UseSuspenseQueryResult<MyCustomJobsQuery | undefined, MyCustomJobsQueryVariables>;
export function useMyCustomJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyCustomJobsQuery, MyCustomJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyCustomJobsQuery, MyCustomJobsQueryVariables>(MyCustomJobsDocument, options);
        }
export type MyCustomJobsQueryHookResult = ReturnType<typeof useMyCustomJobsQuery>;
export type MyCustomJobsLazyQueryHookResult = ReturnType<typeof useMyCustomJobsLazyQuery>;
export type MyCustomJobsSuspenseQueryHookResult = ReturnType<typeof useMyCustomJobsSuspenseQuery>;
export type MyCustomJobsQueryResult = Apollo.QueryResult<MyCustomJobsQuery, MyCustomJobsQueryVariables>;
export const CustomJobDetailDocument = gql`
    query CustomJobDetail($jobId: ID!) {
  customJobDetail(jobId: $jobId) {
    ...JobFields
  }
}
    ${JobFieldsFragmentDoc}`;

/**
 * __useCustomJobDetailQuery__
 *
 * To run a query within a React component, call `useCustomJobDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomJobDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomJobDetailQuery({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useCustomJobDetailQuery(baseOptions: Apollo.QueryHookOptions<CustomJobDetailQuery, CustomJobDetailQueryVariables> & ({ variables: CustomJobDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomJobDetailQuery, CustomJobDetailQueryVariables>(CustomJobDetailDocument, options);
      }
export function useCustomJobDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomJobDetailQuery, CustomJobDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomJobDetailQuery, CustomJobDetailQueryVariables>(CustomJobDetailDocument, options);
        }
// @ts-ignore
export function useCustomJobDetailSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CustomJobDetailQuery, CustomJobDetailQueryVariables>): Apollo.UseSuspenseQueryResult<CustomJobDetailQuery, CustomJobDetailQueryVariables>;
export function useCustomJobDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomJobDetailQuery, CustomJobDetailQueryVariables>): Apollo.UseSuspenseQueryResult<CustomJobDetailQuery | undefined, CustomJobDetailQueryVariables>;
export function useCustomJobDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomJobDetailQuery, CustomJobDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomJobDetailQuery, CustomJobDetailQueryVariables>(CustomJobDetailDocument, options);
        }
export type CustomJobDetailQueryHookResult = ReturnType<typeof useCustomJobDetailQuery>;
export type CustomJobDetailLazyQueryHookResult = ReturnType<typeof useCustomJobDetailLazyQuery>;
export type CustomJobDetailSuspenseQueryHookResult = ReturnType<typeof useCustomJobDetailSuspenseQuery>;
export type CustomJobDetailQueryResult = Apollo.QueryResult<CustomJobDetailQuery, CustomJobDetailQueryVariables>;
export const MarkNotificationReadDocument = gql`
    mutation MarkNotificationRead($notificationId: ID!) {
  markNotificationRead(notificationId: $notificationId) {
    ...NotificationFields
  }
}
    ${NotificationFieldsFragmentDoc}`;
export type MarkNotificationReadMutationFn = Apollo.MutationFunction<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;

/**
 * __useMarkNotificationReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationReadMutation, { data, loading, error }] = useMarkNotificationReadMutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useMarkNotificationReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument, options);
      }
export type MarkNotificationReadMutationHookResult = ReturnType<typeof useMarkNotificationReadMutation>;
export type MarkNotificationReadMutationResult = Apollo.MutationResult<MarkNotificationReadMutation>;
export type MarkNotificationReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = gql`
    mutation MarkAllNotificationsRead {
  markAllNotificationsRead
}
    `;
export type MarkAllNotificationsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;

/**
 * __useMarkAllNotificationsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsReadMutation, { data, loading, error }] = useMarkAllNotificationsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllNotificationsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>(MarkAllNotificationsReadDocument, options);
      }
export type MarkAllNotificationsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const MyNotificationsDocument = gql`
    query MyNotifications($limit: Int) {
  myNotifications(limit: $limit) {
    ...NotificationFields
  }
}
    ${NotificationFieldsFragmentDoc}`;

/**
 * __useMyNotificationsQuery__
 *
 * To run a query within a React component, call `useMyNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyNotificationsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useMyNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
      }
export function useMyNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
// @ts-ignore
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery | undefined, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
export type MyNotificationsQueryHookResult = ReturnType<typeof useMyNotificationsQuery>;
export type MyNotificationsLazyQueryHookResult = ReturnType<typeof useMyNotificationsLazyQuery>;
export type MyNotificationsSuspenseQueryHookResult = ReturnType<typeof useMyNotificationsSuspenseQuery>;
export type MyNotificationsQueryResult = Apollo.QueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const UnreadNotificationCountDocument = gql`
    query UnreadNotificationCount {
  unreadNotificationCount
}
    `;

/**
 * __useUnreadNotificationCountQuery__
 *
 * To run a query within a React component, call `useUnreadNotificationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnreadNotificationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnreadNotificationCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnreadNotificationCountQuery(baseOptions?: Apollo.QueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
      }
export function useUnreadNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
        }
// @ts-ignore
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>;
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadNotificationCountQuery | undefined, UnreadNotificationCountQueryVariables>;
export function useUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>(UnreadNotificationCountDocument, options);
        }
export type UnreadNotificationCountQueryHookResult = ReturnType<typeof useUnreadNotificationCountQuery>;
export type UnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useUnreadNotificationCountLazyQuery>;
export type UnreadNotificationCountSuspenseQueryHookResult = ReturnType<typeof useUnreadNotificationCountSuspenseQuery>;
export type UnreadNotificationCountQueryResult = Apollo.QueryResult<UnreadNotificationCountQuery, UnreadNotificationCountQueryVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    ...ProfileFields
  }
}
    ${ProfileFieldsFragmentDoc}`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const AddEducationDocument = gql`
    mutation AddEducation($input: EducationInput!) {
  addEducation(input: $input) {
    ...EducationFields
  }
}
    ${EducationFieldsFragmentDoc}`;
export type AddEducationMutationFn = Apollo.MutationFunction<AddEducationMutation, AddEducationMutationVariables>;

/**
 * __useAddEducationMutation__
 *
 * To run a mutation, you first call `useAddEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEducationMutation, { data, loading, error }] = useAddEducationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddEducationMutation(baseOptions?: Apollo.MutationHookOptions<AddEducationMutation, AddEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEducationMutation, AddEducationMutationVariables>(AddEducationDocument, options);
      }
export type AddEducationMutationHookResult = ReturnType<typeof useAddEducationMutation>;
export type AddEducationMutationResult = Apollo.MutationResult<AddEducationMutation>;
export type AddEducationMutationOptions = Apollo.BaseMutationOptions<AddEducationMutation, AddEducationMutationVariables>;
export const UpdateEducationDocument = gql`
    mutation UpdateEducation($educationId: ID!, $input: EducationInput!) {
  updateEducation(educationId: $educationId, input: $input) {
    ...EducationFields
  }
}
    ${EducationFieldsFragmentDoc}`;
export type UpdateEducationMutationFn = Apollo.MutationFunction<UpdateEducationMutation, UpdateEducationMutationVariables>;

/**
 * __useUpdateEducationMutation__
 *
 * To run a mutation, you first call `useUpdateEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEducationMutation, { data, loading, error }] = useUpdateEducationMutation({
 *   variables: {
 *      educationId: // value for 'educationId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEducationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEducationMutation, UpdateEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEducationMutation, UpdateEducationMutationVariables>(UpdateEducationDocument, options);
      }
export type UpdateEducationMutationHookResult = ReturnType<typeof useUpdateEducationMutation>;
export type UpdateEducationMutationResult = Apollo.MutationResult<UpdateEducationMutation>;
export type UpdateEducationMutationOptions = Apollo.BaseMutationOptions<UpdateEducationMutation, UpdateEducationMutationVariables>;
export const RemoveEducationDocument = gql`
    mutation RemoveEducation($educationId: ID!) {
  removeEducation(educationId: $educationId)
}
    `;
export type RemoveEducationMutationFn = Apollo.MutationFunction<RemoveEducationMutation, RemoveEducationMutationVariables>;

/**
 * __useRemoveEducationMutation__
 *
 * To run a mutation, you first call `useRemoveEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEducationMutation, { data, loading, error }] = useRemoveEducationMutation({
 *   variables: {
 *      educationId: // value for 'educationId'
 *   },
 * });
 */
export function useRemoveEducationMutation(baseOptions?: Apollo.MutationHookOptions<RemoveEducationMutation, RemoveEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveEducationMutation, RemoveEducationMutationVariables>(RemoveEducationDocument, options);
      }
export type RemoveEducationMutationHookResult = ReturnType<typeof useRemoveEducationMutation>;
export type RemoveEducationMutationResult = Apollo.MutationResult<RemoveEducationMutation>;
export type RemoveEducationMutationOptions = Apollo.BaseMutationOptions<RemoveEducationMutation, RemoveEducationMutationVariables>;
export const AddExperienceDocument = gql`
    mutation AddExperience($input: ExperienceInput!) {
  addExperience(input: $input) {
    ...ExperienceFields
  }
}
    ${ExperienceFieldsFragmentDoc}`;
export type AddExperienceMutationFn = Apollo.MutationFunction<AddExperienceMutation, AddExperienceMutationVariables>;

/**
 * __useAddExperienceMutation__
 *
 * To run a mutation, you first call `useAddExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExperienceMutation, { data, loading, error }] = useAddExperienceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddExperienceMutation(baseOptions?: Apollo.MutationHookOptions<AddExperienceMutation, AddExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddExperienceMutation, AddExperienceMutationVariables>(AddExperienceDocument, options);
      }
export type AddExperienceMutationHookResult = ReturnType<typeof useAddExperienceMutation>;
export type AddExperienceMutationResult = Apollo.MutationResult<AddExperienceMutation>;
export type AddExperienceMutationOptions = Apollo.BaseMutationOptions<AddExperienceMutation, AddExperienceMutationVariables>;
export const UpdateExperienceDocument = gql`
    mutation UpdateExperience($experienceId: ID!, $input: ExperienceInput!) {
  updateExperience(experienceId: $experienceId, input: $input) {
    ...ExperienceFields
  }
}
    ${ExperienceFieldsFragmentDoc}`;
export type UpdateExperienceMutationFn = Apollo.MutationFunction<UpdateExperienceMutation, UpdateExperienceMutationVariables>;

/**
 * __useUpdateExperienceMutation__
 *
 * To run a mutation, you first call `useUpdateExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExperienceMutation, { data, loading, error }] = useUpdateExperienceMutation({
 *   variables: {
 *      experienceId: // value for 'experienceId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExperienceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExperienceMutation, UpdateExperienceMutationVariables>(UpdateExperienceDocument, options);
      }
export type UpdateExperienceMutationHookResult = ReturnType<typeof useUpdateExperienceMutation>;
export type UpdateExperienceMutationResult = Apollo.MutationResult<UpdateExperienceMutation>;
export type UpdateExperienceMutationOptions = Apollo.BaseMutationOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>;
export const RemoveExperienceDocument = gql`
    mutation RemoveExperience($experienceId: ID!) {
  removeExperience(experienceId: $experienceId)
}
    `;
export type RemoveExperienceMutationFn = Apollo.MutationFunction<RemoveExperienceMutation, RemoveExperienceMutationVariables>;

/**
 * __useRemoveExperienceMutation__
 *
 * To run a mutation, you first call `useRemoveExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeExperienceMutation, { data, loading, error }] = useRemoveExperienceMutation({
 *   variables: {
 *      experienceId: // value for 'experienceId'
 *   },
 * });
 */
export function useRemoveExperienceMutation(baseOptions?: Apollo.MutationHookOptions<RemoveExperienceMutation, RemoveExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveExperienceMutation, RemoveExperienceMutationVariables>(RemoveExperienceDocument, options);
      }
export type RemoveExperienceMutationHookResult = ReturnType<typeof useRemoveExperienceMutation>;
export type RemoveExperienceMutationResult = Apollo.MutationResult<RemoveExperienceMutation>;
export type RemoveExperienceMutationOptions = Apollo.BaseMutationOptions<RemoveExperienceMutation, RemoveExperienceMutationVariables>;
export const AddLanguageDocument = gql`
    mutation AddLanguage($input: LanguageInput!) {
  addLanguage(input: $input) {
    ...LanguageFields
  }
}
    ${LanguageFieldsFragmentDoc}`;
export type AddLanguageMutationFn = Apollo.MutationFunction<AddLanguageMutation, AddLanguageMutationVariables>;

/**
 * __useAddLanguageMutation__
 *
 * To run a mutation, you first call `useAddLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLanguageMutation, { data, loading, error }] = useAddLanguageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddLanguageMutation(baseOptions?: Apollo.MutationHookOptions<AddLanguageMutation, AddLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddLanguageMutation, AddLanguageMutationVariables>(AddLanguageDocument, options);
      }
export type AddLanguageMutationHookResult = ReturnType<typeof useAddLanguageMutation>;
export type AddLanguageMutationResult = Apollo.MutationResult<AddLanguageMutation>;
export type AddLanguageMutationOptions = Apollo.BaseMutationOptions<AddLanguageMutation, AddLanguageMutationVariables>;
export const UpdateLanguageDocument = gql`
    mutation UpdateLanguage($languageId: ID!, $input: LanguageInput!) {
  updateLanguage(languageId: $languageId, input: $input) {
    ...LanguageFields
  }
}
    ${LanguageFieldsFragmentDoc}`;
export type UpdateLanguageMutationFn = Apollo.MutationFunction<UpdateLanguageMutation, UpdateLanguageMutationVariables>;

/**
 * __useUpdateLanguageMutation__
 *
 * To run a mutation, you first call `useUpdateLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLanguageMutation, { data, loading, error }] = useUpdateLanguageMutation({
 *   variables: {
 *      languageId: // value for 'languageId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLanguageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLanguageMutation, UpdateLanguageMutationVariables>(UpdateLanguageDocument, options);
      }
export type UpdateLanguageMutationHookResult = ReturnType<typeof useUpdateLanguageMutation>;
export type UpdateLanguageMutationResult = Apollo.MutationResult<UpdateLanguageMutation>;
export type UpdateLanguageMutationOptions = Apollo.BaseMutationOptions<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const RemoveLanguageDocument = gql`
    mutation RemoveLanguage($languageId: ID!) {
  removeLanguage(languageId: $languageId)
}
    `;
export type RemoveLanguageMutationFn = Apollo.MutationFunction<RemoveLanguageMutation, RemoveLanguageMutationVariables>;

/**
 * __useRemoveLanguageMutation__
 *
 * To run a mutation, you first call `useRemoveLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLanguageMutation, { data, loading, error }] = useRemoveLanguageMutation({
 *   variables: {
 *      languageId: // value for 'languageId'
 *   },
 * });
 */
export function useRemoveLanguageMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLanguageMutation, RemoveLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveLanguageMutation, RemoveLanguageMutationVariables>(RemoveLanguageDocument, options);
      }
export type RemoveLanguageMutationHookResult = ReturnType<typeof useRemoveLanguageMutation>;
export type RemoveLanguageMutationResult = Apollo.MutationResult<RemoveLanguageMutation>;
export type RemoveLanguageMutationOptions = Apollo.BaseMutationOptions<RemoveLanguageMutation, RemoveLanguageMutationVariables>;
export const AddSkillDocument = gql`
    mutation AddSkill($input: SkillInput!) {
  addSkill(input: $input) {
    ...SkillFields
  }
}
    ${SkillFieldsFragmentDoc}`;
export type AddSkillMutationFn = Apollo.MutationFunction<AddSkillMutation, AddSkillMutationVariables>;

/**
 * __useAddSkillMutation__
 *
 * To run a mutation, you first call `useAddSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSkillMutation, { data, loading, error }] = useAddSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddSkillMutation(baseOptions?: Apollo.MutationHookOptions<AddSkillMutation, AddSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSkillMutation, AddSkillMutationVariables>(AddSkillDocument, options);
      }
export type AddSkillMutationHookResult = ReturnType<typeof useAddSkillMutation>;
export type AddSkillMutationResult = Apollo.MutationResult<AddSkillMutation>;
export type AddSkillMutationOptions = Apollo.BaseMutationOptions<AddSkillMutation, AddSkillMutationVariables>;
export const UpdateSkillDocument = gql`
    mutation UpdateSkill($skillId: ID!, $input: SkillInput!) {
  updateSkill(skillId: $skillId, input: $input) {
    ...SkillFields
  }
}
    ${SkillFieldsFragmentDoc}`;
export type UpdateSkillMutationFn = Apollo.MutationFunction<UpdateSkillMutation, UpdateSkillMutationVariables>;

/**
 * __useUpdateSkillMutation__
 *
 * To run a mutation, you first call `useUpdateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSkillMutation, { data, loading, error }] = useUpdateSkillMutation({
 *   variables: {
 *      skillId: // value for 'skillId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSkillMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSkillMutation, UpdateSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(UpdateSkillDocument, options);
      }
export type UpdateSkillMutationHookResult = ReturnType<typeof useUpdateSkillMutation>;
export type UpdateSkillMutationResult = Apollo.MutationResult<UpdateSkillMutation>;
export type UpdateSkillMutationOptions = Apollo.BaseMutationOptions<UpdateSkillMutation, UpdateSkillMutationVariables>;
export const RemoveSkillDocument = gql`
    mutation RemoveSkill($skillId: ID!) {
  removeSkill(skillId: $skillId)
}
    `;
export type RemoveSkillMutationFn = Apollo.MutationFunction<RemoveSkillMutation, RemoveSkillMutationVariables>;

/**
 * __useRemoveSkillMutation__
 *
 * To run a mutation, you first call `useRemoveSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSkillMutation, { data, loading, error }] = useRemoveSkillMutation({
 *   variables: {
 *      skillId: // value for 'skillId'
 *   },
 * });
 */
export function useRemoveSkillMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSkillMutation, RemoveSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSkillMutation, RemoveSkillMutationVariables>(RemoveSkillDocument, options);
      }
export type RemoveSkillMutationHookResult = ReturnType<typeof useRemoveSkillMutation>;
export type RemoveSkillMutationResult = Apollo.MutationResult<RemoveSkillMutation>;
export type RemoveSkillMutationOptions = Apollo.BaseMutationOptions<RemoveSkillMutation, RemoveSkillMutationVariables>;
export const MyProfileDocument = gql`
    query MyProfile {
  myProfile {
    ...ProfileFields
  }
}
    ${ProfileFieldsFragmentDoc}`;

/**
 * __useMyProfileQuery__
 *
 * To run a query within a React component, call `useMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, options);
      }
export function useMyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, options);
        }
// @ts-ignore
export function useMyProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>): Apollo.UseSuspenseQueryResult<MyProfileQuery, MyProfileQueryVariables>;
export function useMyProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>): Apollo.UseSuspenseQueryResult<MyProfileQuery | undefined, MyProfileQueryVariables>;
export function useMyProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, options);
        }
export type MyProfileQueryHookResult = ReturnType<typeof useMyProfileQuery>;
export type MyProfileLazyQueryHookResult = ReturnType<typeof useMyProfileLazyQuery>;
export type MyProfileSuspenseQueryHookResult = ReturnType<typeof useMyProfileSuspenseQuery>;
export type MyProfileQueryResult = Apollo.QueryResult<MyProfileQuery, MyProfileQueryVariables>;
export const UploadResumeDocument = gql`
    mutation UploadResume($fileName: String!, $mimeType: String!, $content: String!) {
  uploadResume(fileName: $fileName, mimeType: $mimeType, content: $content) {
    ...ResumeVersionFields
  }
}
    ${ResumeVersionFieldsFragmentDoc}`;
export type UploadResumeMutationFn = Apollo.MutationFunction<UploadResumeMutation, UploadResumeMutationVariables>;

/**
 * __useUploadResumeMutation__
 *
 * To run a mutation, you first call `useUploadResumeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadResumeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadResumeMutation, { data, loading, error }] = useUploadResumeMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *      mimeType: // value for 'mimeType'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUploadResumeMutation(baseOptions?: Apollo.MutationHookOptions<UploadResumeMutation, UploadResumeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadResumeMutation, UploadResumeMutationVariables>(UploadResumeDocument, options);
      }
export type UploadResumeMutationHookResult = ReturnType<typeof useUploadResumeMutation>;
export type UploadResumeMutationResult = Apollo.MutationResult<UploadResumeMutation>;
export type UploadResumeMutationOptions = Apollo.BaseMutationOptions<UploadResumeMutation, UploadResumeMutationVariables>;
export const SetActiveResumeDocument = gql`
    mutation SetActiveResume($resumeVersionId: ID!) {
  setActiveResume(resumeVersionId: $resumeVersionId) {
    ...ResumeVersionFields
  }
}
    ${ResumeVersionFieldsFragmentDoc}`;
export type SetActiveResumeMutationFn = Apollo.MutationFunction<SetActiveResumeMutation, SetActiveResumeMutationVariables>;

/**
 * __useSetActiveResumeMutation__
 *
 * To run a mutation, you first call `useSetActiveResumeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetActiveResumeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setActiveResumeMutation, { data, loading, error }] = useSetActiveResumeMutation({
 *   variables: {
 *      resumeVersionId: // value for 'resumeVersionId'
 *   },
 * });
 */
export function useSetActiveResumeMutation(baseOptions?: Apollo.MutationHookOptions<SetActiveResumeMutation, SetActiveResumeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetActiveResumeMutation, SetActiveResumeMutationVariables>(SetActiveResumeDocument, options);
      }
export type SetActiveResumeMutationHookResult = ReturnType<typeof useSetActiveResumeMutation>;
export type SetActiveResumeMutationResult = Apollo.MutationResult<SetActiveResumeMutation>;
export type SetActiveResumeMutationOptions = Apollo.BaseMutationOptions<SetActiveResumeMutation, SetActiveResumeMutationVariables>;
export const DeleteResumeVersionDocument = gql`
    mutation DeleteResumeVersion($resumeVersionId: ID!) {
  deleteResumeVersion(resumeVersionId: $resumeVersionId)
}
    `;
export type DeleteResumeVersionMutationFn = Apollo.MutationFunction<DeleteResumeVersionMutation, DeleteResumeVersionMutationVariables>;

/**
 * __useDeleteResumeVersionMutation__
 *
 * To run a mutation, you first call `useDeleteResumeVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResumeVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteResumeVersionMutation, { data, loading, error }] = useDeleteResumeVersionMutation({
 *   variables: {
 *      resumeVersionId: // value for 'resumeVersionId'
 *   },
 * });
 */
export function useDeleteResumeVersionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResumeVersionMutation, DeleteResumeVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResumeVersionMutation, DeleteResumeVersionMutationVariables>(DeleteResumeVersionDocument, options);
      }
export type DeleteResumeVersionMutationHookResult = ReturnType<typeof useDeleteResumeVersionMutation>;
export type DeleteResumeVersionMutationResult = Apollo.MutationResult<DeleteResumeVersionMutation>;
export type DeleteResumeVersionMutationOptions = Apollo.BaseMutationOptions<DeleteResumeVersionMutation, DeleteResumeVersionMutationVariables>;
export const MyResumeVersionsDocument = gql`
    query MyResumeVersions {
  myResumeVersions {
    ...ResumeVersionFields
  }
}
    ${ResumeVersionFieldsFragmentDoc}`;

/**
 * __useMyResumeVersionsQuery__
 *
 * To run a query within a React component, call `useMyResumeVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyResumeVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyResumeVersionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyResumeVersionsQuery(baseOptions?: Apollo.QueryHookOptions<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>(MyResumeVersionsDocument, options);
      }
export function useMyResumeVersionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>(MyResumeVersionsDocument, options);
        }
// @ts-ignore
export function useMyResumeVersionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>): Apollo.UseSuspenseQueryResult<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>;
export function useMyResumeVersionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>): Apollo.UseSuspenseQueryResult<MyResumeVersionsQuery | undefined, MyResumeVersionsQueryVariables>;
export function useMyResumeVersionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>(MyResumeVersionsDocument, options);
        }
export type MyResumeVersionsQueryHookResult = ReturnType<typeof useMyResumeVersionsQuery>;
export type MyResumeVersionsLazyQueryHookResult = ReturnType<typeof useMyResumeVersionsLazyQuery>;
export type MyResumeVersionsSuspenseQueryHookResult = ReturnType<typeof useMyResumeVersionsSuspenseQuery>;
export type MyResumeVersionsQueryResult = Apollo.QueryResult<MyResumeVersionsQuery, MyResumeVersionsQueryVariables>;
export const ResumeVersionDocument = gql`
    query ResumeVersion($id: ID!) {
  resumeVersion(id: $id) {
    ...ResumeVersionWithContentFields
  }
}
    ${ResumeVersionWithContentFieldsFragmentDoc}`;

/**
 * __useResumeVersionQuery__
 *
 * To run a query within a React component, call `useResumeVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useResumeVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResumeVersionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResumeVersionQuery(baseOptions: Apollo.QueryHookOptions<ResumeVersionQuery, ResumeVersionQueryVariables> & ({ variables: ResumeVersionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResumeVersionQuery, ResumeVersionQueryVariables>(ResumeVersionDocument, options);
      }
export function useResumeVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResumeVersionQuery, ResumeVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResumeVersionQuery, ResumeVersionQueryVariables>(ResumeVersionDocument, options);
        }
// @ts-ignore
export function useResumeVersionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ResumeVersionQuery, ResumeVersionQueryVariables>): Apollo.UseSuspenseQueryResult<ResumeVersionQuery, ResumeVersionQueryVariables>;
export function useResumeVersionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResumeVersionQuery, ResumeVersionQueryVariables>): Apollo.UseSuspenseQueryResult<ResumeVersionQuery | undefined, ResumeVersionQueryVariables>;
export function useResumeVersionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResumeVersionQuery, ResumeVersionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ResumeVersionQuery, ResumeVersionQueryVariables>(ResumeVersionDocument, options);
        }
export type ResumeVersionQueryHookResult = ReturnType<typeof useResumeVersionQuery>;
export type ResumeVersionLazyQueryHookResult = ReturnType<typeof useResumeVersionLazyQuery>;
export type ResumeVersionSuspenseQueryHookResult = ReturnType<typeof useResumeVersionSuspenseQuery>;
export type ResumeVersionQueryResult = Apollo.QueryResult<ResumeVersionQuery, ResumeVersionQueryVariables>;