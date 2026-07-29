import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import type SvgIcon from '@mui/material/SvgIcon';
import type { NotificationType } from '@careernext/graphql-types';

export const NOTIFICATION_ICONS: Record<NotificationType, typeof SvgIcon> = {
  APPLICATION_STATUS_CHANGED: CheckCircleRoundedIcon,
  INTERVIEW_REMINDER: EventRoundedIcon,
};

export const NOTIFICATION_COLORS: Record<NotificationType, 'success' | 'info'> = {
  APPLICATION_STATUS_CHANGED: 'success',
  INTERVIEW_REMINDER: 'info',
};
