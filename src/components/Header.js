import { useContext, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  AppBar,
  Container,
  Box,
  Badge,
} from "@mui/material";
import { AppContext } from "../context";
import {
  getUserCalorieWarnings,
  getUserMonthlyPriceWarnings,
} from "../apis/userApi";

const Header = () => {
  const navigate = useNavigate();
  const {
    user,
    isTokenVerified,
    noOfCalorieWarnings,
    noOfPriceWarnings,
    setUser,
    setIsTokenVerified,
    setNoOfPriceWarnings,
    setNoOfCalorieWarnings,
    setIsLoading,
  } = useContext(AppContext);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsTokenVerified(false);
    setNoOfPriceWarnings(0);
    setNoOfCalorieWarnings(0);
    setIsLoading(false);
    navigate("/");
  };

  const callApi = async () => {
    try {
      if (user && user.userRole === "User") {
        const { data } = await getUserCalorieWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });
        const { data: priceWarnings } = await getUserMonthlyPriceWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });

        if (priceWarnings.warnings.metadata?.length) {
          setNoOfPriceWarnings(
            priceWarnings.warnings.metadata?.[0]?.total || 0
          );
        }

        if (data.warnings.metadata?.length) {
          setNoOfCalorieWarnings(data.warnings.metadata?.[0]?.total || 0);
        }
      }
    } catch (error) {
      console.log("Error::", error);
    }
  };
  useEffect(() => {
    callApi();
  }, [user]);
  return (
    <AppBar position="static" className="header">
      <Container>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="h6"> Calorie App</Typography>

            {user && (
              <Button onClick={() => navigate("/home")} className="navbarLink">
                Home
              </Button>
            )}
            {user?.userRole === "User" && (
              <Badge
                badgeContent={
                  (noOfCalorieWarnings || 0) + (noOfPriceWarnings || 0)
                }
                color="error"
              >
                <Button
                  onClick={() => navigate("/warnings")}
                  className="navbarLink"
                >
                  Warnings
                </Button>
              </Badge>
            )}
            {user?.userRole === "Admin" && (
              <>
                <Button
                  onClick={() => navigate("/report")}
                  className="navbarLink"
                >
                  Reports
                </Button>
                <Button
                  onClick={() => navigate("/users")}
                  className="navbarLink"
                >
                  Users
                </Button>
              </>
            )}
          </Box>

          {user && isTokenVerified && (
            <Button variant="contained" color="error" onClick={handleLogOut}>
              Log Out
            </Button>
          )}
        </Box>
      </Container>
    </AppBar>
  );
};
export default Header;
