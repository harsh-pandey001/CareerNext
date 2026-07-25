import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import type SvgIcon from '@mui/material/SvgIcon';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import type { DocumentType } from '@careernext/graphql-types';

export const MAX_DOCUMENT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]);

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

export const MIME_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
};

interface VaultSectionDef {
  type: DocumentType;
  label: string;
  description: string;
  icon: typeof SvgIcon;
}

export const VAULT_SECTIONS: VaultSectionDef[] = [
  {
    type: 'CERTIFICATE',
    label: 'Certificates',
    description: 'Course completions, achievements, and credentials.',
    icon: WorkspacePremiumOutlinedIcon,
  },
  {
    type: 'OFFER_LETTER',
    label: 'Offer Letters',
    description: 'Offer letters from current and past employers.',
    icon: MailOutlineRoundedIcon,
  },
  {
    type: 'EXPERIENCE_LETTER',
    label: 'Experience Letters',
    description: 'Relieving and experience letters.',
    icon: BadgeOutlinedIcon,
  },
];

export const DEFAULT_DOCUMENT_ICON = DescriptionOutlinedIcon;
