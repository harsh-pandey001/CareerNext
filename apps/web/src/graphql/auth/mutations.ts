import { gql } from '@apollo/client';
import { AUTH_USER_FIELDS } from './fragments';

export const REGISTER_MUTATION = gql`
  ${AUTH_USER_FIELDS}
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        ...AuthUserFields
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  ${AUTH_USER_FIELDS}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        ...AuthUserFields
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  ${AUTH_USER_FIELDS}
  mutation RefreshToken {
    refreshToken {
      accessToken
      user {
        ...AuthUserFields
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;
