/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
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

export type ForgotPasswordInput = {
  email: string;
};

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

export type LoginInput = {
  email: string;
  password: string;
};

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

export type UserRole =
  | 'ADMIN'
  | 'USER';

export type WorkMode =
  | 'HYBRID'
  | 'ONSITE'
  | 'REMOTE';

export type ApplicationFieldsFragment = { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type UpdateApplicationStatusMutationVariables = Exact<{
  applicationId: string | number;
  status: ApplicationStatus;
}>;


export type UpdateApplicationStatusMutation = { updateApplicationStatus: { id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } } };

export type RemoveApplicationMutationVariables = Exact<{
  applicationId: string | number;
}>;


export type RemoveApplicationMutation = { removeApplication: boolean };

export type MyApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyApplicationsQuery = { myApplications: Array<{ id: string, status: ApplicationStatus, notes: string | null, appliedAt: string | null, createdAt: string, updatedAt: string, job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } }> };

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

export type JobFieldsFragment = { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string };

export type SaveJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type SaveJobMutation = { saveJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type UnsaveJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type UnsaveJobMutation = { unsaveJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type ApplyToJobMutationVariables = Exact<{
  jobId: string | number;
}>;


export type ApplyToJobMutation = { applyToJob: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } };

export type JobsQueryVariables = Exact<{
  filter?: JobFilterInput | null | undefined;
  pagination?: PaginationInput | null | undefined;
}>;


export type JobsQuery = { jobs: { total: number, page: number, pageSize: number, totalPages: number, items: Array<{ id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string }> } };

export type JobQueryVariables = Exact<{
  id: string | number;
}>;


export type JobQuery = { job: { id: string, title: string, company: string, location: string | null, description: string, type: JobType, workMode: WorkMode, salaryMin: number | null, salaryMax: number | null, externalUrl: string | null, skills: Array<string>, applicationStatus: ApplicationStatus | null, createdAt: string } };

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