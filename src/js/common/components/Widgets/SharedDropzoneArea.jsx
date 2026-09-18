/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Box, IconButton, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function normalizeAccept (acceptedFiles) {
  if (!acceptedFiles) return undefined;
  if (typeof acceptedFiles === 'object' && !Array.isArray(acceptedFiles)) {
    return acceptedFiles;
  }
  if (Array.isArray(acceptedFiles)) {
    const acceptObj = {};
    acceptedFiles.forEach((mimeType) => {
      acceptObj[mimeType] = [];
    });
    return acceptObj;
  }
  return undefined;
}

const DEFAULT_INITIAL_FILES = [];

export default function SharedDropzoneArea ({
  acceptedFiles = ['image/*'],
  classes = {},
  dropzoneText = 'Drag and drop a file here or click',
  filesLimit = 1,
  getDropRejectMessage,
  Icon = CloudUploadOutlinedIcon,
  initialFiles = DEFAULT_INITIAL_FILES,
  maxFileSize = 6000000,
  onChange,
  onDelete,
  previewUrl: previewUrlProp,
  showIcon = true,
  showPreviewsInDropzone = true,
  sx = {},
}) {
  const [internalPreviewUrl, setInternalPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  let initialFileKey = '';
  if (initialFiles && initialFiles.length > 0) {
    const first = initialFiles[0];
    initialFileKey = typeof first === 'string' ? first : first.name;
  }

  useEffect(() => {
    if (initialFileKey) {
      const first = initialFiles[0];
      if (typeof first === 'string' && first) {
        setInternalPreviewUrl(first);
      } else if (first instanceof File || first instanceof Blob) {
        setInternalPreviewUrl(URL.createObjectURL(first));
      }
    }
  }, [initialFileKey, initialFiles]);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected && rejected.length > 0) {
      const rejectedItem = rejected[0];
      let msg = 'File could not be uploaded.';
      if (getDropRejectMessage) {
        msg = getDropRejectMessage(rejectedItem.file || rejectedItem);
      } else if (rejectedItem.errors && rejectedItem.errors[0]) {
        msg = rejectedItem.errors[0].message;
      }
      setErrorMessage(msg);
    } else {
      setErrorMessage('');
    }

    if (accepted && accepted.length > 0) {
      const file = accepted[0];
      if (showPreviewsInDropzone) {
        const objectUrl = URL.createObjectURL(file);
        setInternalPreviewUrl(objectUrl);
      }
      if (onChange) {
        onChange(accepted);
      }
    }
  }, [getDropRejectMessage, onChange, showPreviewsInDropzone]);

  const handleRemovePreview = (event) => {
    event.stopPropagation();
    setInternalPreviewUrl(null);
    setErrorMessage('');
    if (onDelete) {
      onDelete();
    }
    if (onChange) {
      onChange([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: normalizeAccept(acceptedFiles),
    maxFiles: filesLimit,
    maxSize: maxFileSize,
    onDrop,
  });

  const activePreviewUrl = previewUrlProp || internalPreviewUrl;

  return (
    <Box
      {...getRootProps()}
      className={classes.root || ''}
      sx={{
        alignItems: 'center',
        backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.04)' : '#fff',
        border: '2px dashed',
        borderColor: isDragActive ? '#2e3c42' : 'rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '160px',
        outline: 'none',
        padding: '16px',
        position: 'relative',
        transition: 'border-color 0.2s, background-color 0.2s',
        width: '100%',
        ...sx,
      }}
    >
      <input {...getInputProps()} />

      {activePreviewUrl && showPreviewsInDropzone ? (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'inline-block',
              maxWidth: '100%',
              position: 'relative',
            }}
          >
            <img
              alt="Upload Preview"
              role="presentation"
              src={activePreviewUrl}
              style={{
                borderRadius: '4px',
                display: 'inline-block',
                maxHeight: '140px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
            <IconButton
              aria-label="Remove uploaded image"
              onClick={handleRemovePreview}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                position: 'absolute',
                right: -10,
                top: -10,
                '&:hover': {
                  backgroundColor: '#f44336',
                  color: '#fff',
                },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            className={classes.text || ''}
            sx={{
              color: '#818181',
              fontFamily: "'Poppins', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              fontSize: '14px',
              mt: 1,
              textAlign: 'center',
            }}
          >
            {dropzoneText}
          </Typography>
        </Box>
      ) : (
        <>
          {showIcon && Icon && (
            <Icon
              className={classes.icon || ''}
              sx={{
                color: '#999',
                fontSize: 48,
                mb: 1,
              }}
            />
          )}
          <Typography
            className={classes.text || ''}
            sx={{
              color: '#818181',
              fontFamily: "'Poppins', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              fontSize: '18px',
              fontWeight: '300',
              textAlign: 'center',
            }}
          >
            {dropzoneText}
          </Typography>
        </>
      )}

      {errorMessage && (
        <Typography
          sx={{
            color: '#f44336',
            fontSize: '14px',
            mt: 1,
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

SharedDropzoneArea.propTypes = {
  acceptedFiles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  classes: PropTypes.object,
  dropzoneText: PropTypes.string,
  filesLimit: PropTypes.number,
  getDropRejectMessage: PropTypes.func,
  Icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  initialFiles: PropTypes.array,
  maxFileSize: PropTypes.number,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  previewUrl: PropTypes.string,
  showIcon: PropTypes.bool,
  showPreviewsInDropzone: PropTypes.bool,
  sx: PropTypes.object,
};
