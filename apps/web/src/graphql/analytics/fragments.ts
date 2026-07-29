import { gql } from '@apollo/client';

export const APPLICATIONS_ANALYTICS_FIELDS = gql`
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
