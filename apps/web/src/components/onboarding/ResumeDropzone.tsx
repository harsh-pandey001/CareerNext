'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ANALYSIS_STEPS = ['Skills Found', 'Experience Found', 'Education Found'];

interface ResumeDropzoneProps {
  fileName: string | null;
  /** Receives the real File — the wizard uploads it after registration succeeds. */
  onFileSelected: (file: File | null) => void;
}

export function ResumeDropzone({ fileName, onFileSelected }: ResumeDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    [],
  );

  const runMockAnalysis = useCallback(() => {
    setAnalyzing(true);
    setFoundCount(0);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    ANALYSIS_STEPS.forEach((_, index) => {
      timersRef.current.push(
        setTimeout(
          () => {
            setFoundCount(index + 1);
            if (index === ANALYSIS_STEPS.length - 1) {
              timersRef.current.push(setTimeout(() => setAnalyzing(false), 400));
            }
          },
          (index + 1) * 500,
        ),
      );
    });
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      // Drag-and-drop bypasses the <input accept> filter — enforce it here.
      const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
      if (!ACCEPTED_EXTENSIONS.includes(extension)) return;
      onFileSelected(file);
      runMockAnalysis();
    },
    [onFileSelected, runMockAnalysis],
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onFileSelected(null);
    setAnalyzing(false);
    setFoundCount(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (fileName) {
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '16px', p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DescriptionRoundedIcon color="primary" />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography fontWeight={600} noWrap>
              {fileName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {analyzing ? 'Analyzing Resume...' : 'Ready'}
            </Typography>
          </Box>
          <Button size="small" onClick={handleRemove} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Remove
          </Button>
        </Stack>

        {(analyzing || foundCount > 0) && (
          <Box sx={{ mt: 2.5 }}>
            {analyzing && <LinearProgress sx={{ mb: 2, borderRadius: 999, height: 4 }} />}
            <Stack spacing={1}>
              {ANALYSIS_STEPS.map((label, index) => {
                const found = index < foundCount;
                return (
                  <Stack
                    key={label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ opacity: found ? 1 : 0.4, transition: 'opacity 0.3s ease' }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 18, color: found ? 'success.main' : 'text.disabled' }}
                    />
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: '16px',
        p: 5,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        bgcolor: isDragging ? 'action.hover' : 'transparent',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <CloudUploadRoundedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }} />
      <Typography fontWeight={600} sx={{ mb: 0.5 }}>
        Drag &amp; Drop Here
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        OR
      </Typography>
      <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
        Browse Files
      </Button>
      <Typography variant="caption" sx={{ display: 'block', mt: 2.5, color: 'text.secondary' }}>
        Supported: PDF, DOC, DOCX
      </Typography>
    </Box>
  );
}
