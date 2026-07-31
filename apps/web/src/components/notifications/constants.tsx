import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import type SvgIcon from '@mui/material/SvgIcon';
import type { NotificationType } from '@careernext/graphql-types';

export const NOTIFICATION_ICONS: Record<NotificationType, typeof SvgIcon> = {
  APPLICATION_STATUS_CHANGED: CheckCircleRoundedIcon,
  INTERVIEW_REMINDER: EventRoundedIcon,
  APPLICATION_NO_RESPONSE: HourglassBottomRoundedIcon,
};

export const NOTIFICATION_COLORS: Record<NotificationType, 'success' | 'info' | 'warning'> = {
  APPLICATION_STATUS_CHANGED: 'success',
  INTERVIEW_REMINDER: 'info',
  APPLICATION_NO_RESPONSE: 'warning',
};
