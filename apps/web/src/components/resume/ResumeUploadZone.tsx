'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { ACCEPTED_RESUME_EXTENSIONS } from './constants';

interface ResumeUploadZoneProps {
  onUpload: (file: File) => void;
  uploading: boolean;
  compact?: boolean;
}

export function ResumeUploadZone({ onUpload, uploading, compact = false }: ResumeUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pickFile = (file: File | undefined) => {
    if (!file || uploading) return;
    onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  };

  return (
    <Box
      onDragOver={(event) => {
        event.preventDefault();
        if (!uploading) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: '16px',
        p: compact ? 3 : 5,
        textAlign: 'center',
        cursor: uploading ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        bgcolor: isDragging ? (theme) => alpha(theme.palette.primary.main, 0.05) : 'transparent',
        '&:hover': uploading
          ? undefined
          : { borderColor: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_RESUME_EXTENSIONS.join(',')}
        hidden
        onChange={(event: ChangeEvent<HTMLInputElement>) => pickFile(event.target.files?.[0])}
      />

      <CloudUploadRoundedIcon sx={{ fontSize: compact ? 30 : 40, color: 'primary.main', mb: 1 }} />
      <Typography fontWeight={600} sx={{ mb: 0.5 }}>
        {uploading ? 'Uploading...' : compact ? 'Upload a new version' : 'Drag & Drop Here'}
      </Typography>
      {!compact && !uploading && (
        <>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            OR
          </Typography>
          <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
            Browse Files
          </Button>
        </>
      )}
      <Stack direction="row" spacing={1} justifyContent="center">
        <Typography variant="caption" sx={{ display: 'block', mt: compact ? 1 : 2.5, color: 'text.secondary' }}>
          Supported: PDF, DOC, DOCX — up to 5MB
        </Typography>
      </Stack>

      {uploading && (
        <LinearProgress
          sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderRadius: 0 }}
        />
      )}
    </Box>
  );
}
