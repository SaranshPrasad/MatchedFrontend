import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas from qrcode.react

const QRDisplay = ({ open, handleClose, qrData }) => {
  const url = `https://matchedfrontend.onrender.com/attendee/${qrData}/register`; // URL with event_id

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center' }}>
          <QRCodeCanvas value={url} size={256} /> {/* Use QRCodeCanvas */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRDisplay;
