import Box from '@mui/material/Box';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import { StatCard } from '@/components/dashboard/StatCard';
import type { ApplicationsAnalyticsFieldsFragment } from '@careernext/graphql-types';

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

interface SuccessRateCardsProps {
  rates: ApplicationsAnalyticsFieldsFragment['successRates'];
}

export function SuccessRateCards({ rates }: SuccessRateCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      <StatCard icon={WorkOutlineRoundedIcon} label="Applications Submitted" value={rates.totalApplications} />
      <StatCard icon={LocalOfferOutlinedIcon} label="Offers Received" value={rates.totalOffers} />
      <StatCard icon={PercentRoundedIcon} label="Offer Rate" value={formatPercent(rates.offerRate)} />
      <StatCard icon={CheckCircleOutlineRoundedIcon} label="Acceptance Rate" value={formatPercent(rates.acceptanceRate)} />
    </Box>
  );
}
