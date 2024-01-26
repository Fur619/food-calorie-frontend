import { Fragment, useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import moment from "moment";
import WarningCard from "./WarningCard";

import EDIT_ICON from "../img/edit.svg";
import DeleteDialog from "./DeleteDialog";
import { getFoodEntries } from "../apis/foodApi";
import { AppContext } from "../context";
import { getUserCalorieWarnings } from "../apis/userApi";
import AddEntryDialog from "./AddEntryDialog";

const EntryCard = ({
  heading,
  totalCalories,
  caloriesNumber,
  date,
  refetchFood,
  startDate,
  endDate,
  setSnackMessage,
  setSeverity,
  setOpenSnack,
  setSnackBarDuration,
}) => {
  const { user } = useContext(AppContext);
  const [entries, setEntries] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [dailyWarning, setDailyWarning] = useState(null);
  const [page, setPage] = useState(1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);

  const handleOpenAddDialog = (item) => {
    setSelectedForEdit(item);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      await callApi({ pageValue: page + 1 });
      setPage(page + 1);
    } catch (error) {
      console.log("error::", error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  const callApi = async ({ pageValue }) => {
    try {
      setIsLoadingFoods(true);
      if (user) {
        const { data } = await getFoodEntries({
          userId: user._id,
          page: pageValue || 1,
          limit: 5,
          role: user?.userRole,
          populateUser: user?.userRole === "Admin" ? true : false,
          startDate: startDate
            ? moment(startDate).isBefore(moment(date).startOf("day").toDate())
              ? moment(date).startOf("day").toDate()
              : startDate
            : moment(date).startOf("day").toDate(),
          endDate: endDate
            ? moment(endDate).isAfter(moment(date).endOf("day").toDate())
              ? moment(date).endOf("day").toDate()
              : endDate
            : moment(date).endOf("day").toDate(),
        });

        if (user?.userRole === "User") {
          const { data: warningData } = await getUserCalorieWarnings({
            id: user._id,
            timezone: moment().format("Z"),
            date,
          });

          setDailyWarning(warningData?.warnings?.data[0] || null);
        }

        setEntries(
          pageValue === 1
            ? [...data.foodEntries.docs]
            : [...entries, ...data.foodEntries.docs]
        );
        setHasNextPage(data.foodEntries.hasNextPage);
      }
    } catch (error) {
      console.log("Error:::", error);
    } finally {
      setIsLoadingFoods(false);
    }
  };

  useEffect(() => {
    callApi({ pageValue: 1 });
  }, [user, heading, caloriesNumber]);

  return (
    <Card className="entryCardTable">
      <Box className="entryHeader">
        <Typography variant="h6">{heading}</Typography>

        <Badge
          className={
            user.userRole === "Admin"
              ? "default"
              : Number(caloriesNumber) >= Number(totalCalories)
              ? "error"
              : "default"
          }
        >
          {user.userRole === "Admin"
            ? caloriesNumber
            : `${caloriesNumber} / ${totalCalories}`}
        </Badge>
      </Box>

      <Divider />

      {dailyWarning && (
        <>
          {" "}
          <Box padding="20px 15px">
            <WarningCard
              className="emptyCard warningCard"
              mainText={"Calorie Limit Warning!"}
              secondaryText={`You Have Reached your daily Calorie Threshold Limit for ${moment(
                dailyWarning._id
              ).format("MMMM DD, YYYY")}. Calorie amount on this day is ${
                dailyWarning.amount
              }`}
            />
          </Box>
          <Divider />
        </>
      )}
      <AddEntryDialog
        refetchFood={refetchFood}
        open={openAddDialog}
        handleClickOpen={handleOpenAddDialog}
        handleClose={handleCloseAddDialog}
        foodName={selectedForEdit?.foodName}
        Calorie={selectedForEdit?.Calorie}
        price={selectedForEdit?.price}
        dateTaken={selectedForEdit?.dateTaken}
        foodId={selectedForEdit?._id}
        type={"edit"}
        {...(user.userRole === "Admin" && {
          userId: selectedForEdit?.user?._id,
          userName: selectedForEdit?.user?.userName,
        })}
        {...{
          setSnackMessage,
          setSeverity,
          setOpenSnack,
          setSnackBarDuration,
        }}
      />

      <Table>
        <TableHead>
          <TableRow>
            {user.userRole === "Admin" && <TableCell>User Name</TableCell>}
            <TableCell>Food</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Date</TableCell>
            {user.userRole === "Admin" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>

        {isLoadingFoods && !entries.length ? (
          <Box display={"flex"} justifyContent={"center"} alignItems="center">
            Loading...
          </Box>
        ) : (
          entries
            ?.sort(
              (a, b) =>
                new Date(a.dateTaken).getTime() -
                new Date(b.dateTaken).getTime()
            )
            ?.map((item, index) => (
              <Fragment key={`${index}-${item.dateTaken}`}>
                <TableBody>
                  <TableRow>
                    {user.userRole === "Admin" && (
                      <TableCell>{item.user.userName}</TableCell>
                    )}
                    <TableCell>{item.foodName}</TableCell>
                    <TableCell>{item.Calorie}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      {moment(item.dateTaken).format("MMM DD, YYYY hh:mm a")}
                    </TableCell>
                    {user.userRole === "Admin" && (
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <IconButton onClick={() => handleOpenAddDialog(item)}>
                            <img src={EDIT_ICON} alt="edit" />
                          </IconButton>

                          <DeleteDialog
                            id={item._id}
                            refetch={refetchFood}
                            type="food"
                            {...{ setSnackMessage, setSeverity, setOpenSnack }}
                          />
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Fragment>
            ))
        )}
      </Table>

      <Divider />

      <Box textAlign="center" padding="20px 15px">
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
    </Card>
  );
};

export default EntryCard;
