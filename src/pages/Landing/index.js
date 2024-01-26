import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Container, Typography, Input, Grid, Box } from "@mui/material";
import { getUserByToken } from "../../apis/userApi";
import SnackbarComponent from "../../components/SnackBar";
import { AppContext } from "../../context";

const Authenticate = () => {
  const navigate = useNavigate();
  const { user, isTokenVerified, isLoading, setUser, setIsTokenVerified } =
    useContext(AppContext);
  const [token, setToken] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const authenticateToken = async () => {
    try {
      localStorage.setItem("token", token);
      const { data } = await getUserByToken();
      setUser(data);
      setIsTokenVerified(true);
      navigate("/home");
    } catch (error) {
      localStorage.removeItem("token");
      setSnackMessage("Invalid Token");
      setSeverity("error");
    } finally {
      setOpenSnack(true);
    }
  };

  const handleClose = () => {
    setOpenSnack(false);
    setSnackMessage("");
  };

  if (isLoading) return <>Loading...</>;
  if (user && isTokenVerified) return <Navigate to="/home" />;

  return (
    <>
      <SnackbarComponent
        message={snackMessage}
        open={openSnack}
        handleClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={4000}
        severity={severity}
      />
      {/* <Header /> */}
      <Container>
        <Grid className="authenticateWrapper">
          <Grid className="authenticateForm">
            <Typography variant="h4"> Please Authenticate</Typography>

            <Typography variant="body1">Enter Your Access Token</Typography>

            <Grid>
              <Input
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                }}
                fullWidth
              />
            </Grid>

            <Box display="flex" justifyContent="flex-end" paddingTop="20px">
              <Button
                variant="contained"
                onClick={authenticateToken}
                disabled={!token}
                className="authenticateButton"
              >
                Authenticate
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default Authenticate;
