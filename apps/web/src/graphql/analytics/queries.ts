import { gql } from '@apollo/client';
import { APPLICATIONS_ANALYTICS_FIELDS } from './fragments';

export const APPLICATIONS_ANALYTICS_QUERY = gql`
  ${APPLICATIONS_ANALYTICS_FIELDS}
  query ApplicationsAnalytics($range: DateRangeInput) {
    applicationsAnalytics(range: $range) {
      ...ApplicationsAnalyticsFields
    }
  }
`;
