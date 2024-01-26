import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import moment from "moment";

import { getUserFoodEntriesDays } from "../../apis/foodApi";
import AddEntryDialog from "../../components/AddEntryDialog";
import EntryCard from "../../components/EntryCard";
import NoFoodEntry from "../../components/NoFoodEntry";
import { AppContext } from "../../context";
import DateRangePicker from "../../components/DateRangePicker";
import SnackbarComponent from "../../components/SnackBar";
import { getUserMonthlyPriceWarnings } from "../../apis/userApi";
import WarningCard from "../../components/WarningCard";

const Home = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AppContext);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [foodEntriesDays, setFoodEntriesDays] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [snackBarDuration, setSnackBarDuration] = useState(4000);
  const [currentMonthPriceWarnings, setCurrentMonthPriceWarnings] =
    useState(null);

  const limit = 7;

  const getCardHeading = (date) => {
    if (
      moment(date).format("MMM DD, YYYY") ===
      moment(new Date()).format("MMM DD, YYYY")
    )
      return "Today";
    return moment(date).format("MMM DD, YYYY");
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await callApi({ pageValue: page + 1 });
    setPage(page + 1);
    setIsLoadingMore(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnack(false);
    setSnackMessage("");
  };

  const callApi = async ({ pageValue, removeFilter }) => {
    try {
      pageValue === 1 && setIsLoadingFoods(true);
      if (user) {
        const { data } = await getUserFoodEntriesDays({
          userId: user._id,
          page: pageValue,
          limit,
          role: user?.userRole,
          timezone: moment().format("Z"),
          ...((urlParams.get("startDate") || startDate) &&
            !removeFilter && {
              startDate: startDate || urlParams.get("startDate"),
            }),
          ...((urlParams.get("endDate") || endDate) &&
            !removeFilter && { endDate: endDate || urlParams.get("endDate") }),
        });

        const { data: priceWarnings } = await getUserMonthlyPriceWarnings({
          id: user._id,
          timezone: moment().format("Z"),
          date: new Date(),
        });

        if (priceWarnings.warnings.data?.length) {
          setCurrentMonthPriceWarnings(priceWarnings.warnings.data?.[0]);
        } else setCurrentMonthPriceWarnings(null);

        const newArr =
          pageValue === 1
            ? [...data.foodEntriesDays[0].data]
            : [...foodEntriesDays, ...data.foodEntriesDays[0].data];
        setHasNextPage(
          (data.foodEntriesDays[0]?.metadata?.[0]?.total || 0) > newArr.length
        );
        setFoodEntriesDays(newArr);
      }
    } catch (error) {
      console.log("Error::", error);
    } finally {
      setIsLoadingFoods(false);
    }
  };
  useEffect(() => {
    callApi({ pageValue: 1 });
  }, []);

  if (!user) return <Navigate to="/" />;

  return (
    <>
      {/* <Header /> */}
      <Container>
        <SnackbarComponent
          message={snackMessage}
          open={openSnack}
          handleClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={snackBarDuration}
          severity={severity}
        />

        <Grid className="authenticateWrapper">
          {user.userRole !== "Admin" ? (
            <Typography variant="h5" className="headingText">
              Hi {user.userName}
            </Typography>
          ) : (
            <Box display={"flex"} justifyContent="center" marginBottom={5}>
              <Typography variant="h5" className="headingText">
                Admin View
              </Typography>
            </Box>
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <AddEntryDialog
              refetchFood={callApi}
              open={openAddDialog}
              handleClickOpen={handleOpenAddDialog}
              handleClose={handleCloseAddDialog}
              type={"add"}
              {...{
                setSnackMessage,
                setSeverity,
                setOpenSnack,
                setSnackBarDuration,
              }}
            />

            <DateRangePicker
              fetchFoods={callApi}
              from={startDate}
              to={endDate}
              setFrom={setStartDate}
              setTo={setEndDate}
              refetchFood={callApi}
            />
          </Box>
          {currentMonthPriceWarnings && (
            <Box padding="15px 0px">
              <WarningCard
                className="emptyCard warningCard"
                mainText={"Monthly Price Limit Warning For Current Month!"}
                secondaryText={`You Have Reached your monthly price limit for month ${moment(
                  currentMonthPriceWarnings._id
                ).format("MMM, YYYY")}. Price amount on this month is ${
                  currentMonthPriceWarnings.amount
                }`}
              />
            </Box>
          )}

          {isLoadingFoods ? (
            <Grid className="spacingGrid">
              <NoFoodEntry mainText={"Loading..."} secondaryText={""} />
            </Grid>
          ) : foodEntriesDays.length ? (
            foodEntriesDays?.map((item) => (
              <EntryCard
                key={item._id}
                heading={getCardHeading(item._id)}
                date={item._id}
                totalCalories={user.calorieLimit || 0}
                caloriesNumber={item.amount || 0}
                refetchFood={callApi}
                startDate={urlParams.get("startDate")}
                endDate={urlParams.get("endDate")}
                {...{
                  setSnackMessage,
                  setSeverity,
                  setOpenSnack,
                  setSnackBarDuration,
                }}
              />
            ))
          ) : (
            <Grid className="spacingGrid">
              <NoFoodEntry
                mainText={
                  user?.userRole === "Admin"
                    ? "None of the user have added any entry yet!"
                    : urlParams.get("search")
                    ? "No Result for specific Dates!"
                    : "You have not add any food entry yet!"
                }
                secondaryText={
                  user?.userRole === "Admin"
                    ? "You can add Entries for them"
                    : urlParams.get("search")
                    ? ""
                    : "Start Adding Food Entries"
                }
              />
            </Grid>
          )}
        </Grid>

        <Box textAlign="center">
          {hasNextPage && (
            <Button
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              className="loadMore"
            >
              {isLoadingMore ? "Loading More ..." : "Load More"}
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};
export default Home;
