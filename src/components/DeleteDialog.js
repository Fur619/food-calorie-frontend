import { useContext, useState } from "react";
import moment from "moment";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";

import DELETE_ICON from "../img/delete.svg";
import { deleteFoodEntry } from "../apis/foodApi";
import {
  deleteUser,
  getUserCalorieWarnings,
  getUserMonthlyPriceWarnings,
} from "../apis/userApi";
import { AppContext } from "../context";

const DeleteDialog = ({
  id,
  refetch,
  setSnackMessage,
  setSeverity,
  setOpenSnack,
  type,
}) => {
  const { user, setNoOfCalorieWarnings, setNoOfPriceWarnings } =
    useContext(AppContext);
  const [open, setOpen] = useState(false);

  const [isLoading, seIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async () => {
    try {
      seIsLoading(true);
      if (id) {
        let message = "";
        if (type === "food") {
          const { data } = await deleteFoodEntry({ id });
          if (user?.userRole === "User") await callUserWarningApi();
          message = data.message;
        } else if (type === "user") {
          const { data } = await deleteUser({ id });
          message = data.message;
        }
        await refetch({ pageValue: 1 });
        setSnackMessage(message);
        setSeverity("success");
      }
    } catch (error) {
      console.log("Error::", error);
      setSnackMessage(error.message);
      setSeverity("success");
    } finally {
      setOpenSnack(true);
      seIsLoading(false);
      handleClose();
    }
  };

  const callUserWarningApi = async () => {
    try {
      if (user) {
        const { data } = await getUserCalorieWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });

        const { data: priceWarnings } = await getUserMonthlyPriceWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });

        setNoOfPriceWarnings(priceWarnings.warnings.metadata?.[0]?.total || 0);
        setNoOfCalorieWarnings(data.warnings.metadata[0]?.total || 0);
      }
    } catch (error) {
      console.log("Error::", error);
    }
  };

  return (
    <Grid>
      <IconButton
        variant="contained"
        className="addEntryButton"
        onClick={handleClickOpen}
      >
        <img src={DELETE_ICON} alt="delete" />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        className="addEntryDialog deleteDialog"
      >
        <Typography variant="h6">Delete Entry</Typography>

        <Typography variant="body1">
          Are you sure to delete this entry?
        </Typography>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Keep
          </Button>
          <Button type="submit" variant="contained" onClick={handleDelete}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};
export default DeleteDialog;
