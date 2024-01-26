import { Snackbar, Alert } from "@mui/material";

const SnackbarComponent = ({
  open,
  handleClose,
  message,
  anchorOrigin,
  autoHideDuration,
  severity,
  styles,
}) => {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      style={styles ? { ...styles } : {}}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        variant="filled"
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
export default SnackbarComponent;
