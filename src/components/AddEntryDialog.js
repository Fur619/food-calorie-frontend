import { useContext } from "react";
import moment from "moment";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  Typography,
  InputBase,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createFoodEntry, updateFoodEntry } from "../apis/foodApi";
import { AppContext } from "../context";
import {
  getUserCalorieWarnings,
  getUserMonthlyPriceWarnings,
} from "../apis/userApi";
import SearchUsers from "./SearchUsers";

const AddEntryDialog = ({
  refetchFood,
  foodName,
  Calorie,
  price,
  dateTaken,
  open,
  type,
  handleClickOpen,
  handleClose,
  foodId,
  userId,
  userName,
  setSnackMessage,
  setSeverity,
  setOpenSnack,
  setSnackBarDuration,
}) => {
  const { user, setNoOfCalorieWarnings, setNoOfPriceWarnings } =
    useContext(AppContext);

  const handleDateChange = (newValue, setValue) => {
    setValue("dateTaken", newValue);
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

  const validationSchema = Yup.object().shape({
    foodName: Yup.string()
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .trim(),
    Calorie: Yup.number()
      .min(1)
      .max(5000)
      .required("Required")
      .test(
        "maxDigitsAfterDecimal",
        "Calorie must have 2 digits after decimal or less",
        (number) => /^\d+(\.\d{1,2})?$/.test(number)
      ),
    price: Yup.number()
      .min(0.1)
      .max(10000)
      .required("Required")
      .test(
        "maxDigitsAfterDecimal",
        "Price must have 2 digits after decimal or less",
        (number) => /^\d+(\.\d{1,2})?$/.test(number)
      ),
    dateTaken: Yup.date().required("Required"),
    ...(user.userRole === "Admin" && {
      userId: Yup.string().required("Required"),
    }),
  });

  return (
    <Grid>
      {type !== "edit" && (
        <Button
          variant="contained"
          className="addEntryButton"
          onClick={handleClickOpen}
        >
          Add Entry
        </Button>
      )}

      <Formik
        initialValues={{
          foodName: foodName || "",
          Calorie: Calorie || "",
          price: price || "",
          dateTaken: dateTaken || new Date(),
          ...(user.userRole === "Admin" && {
            userId,
            userValue: { value: userId, label: userName },
          }),
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { data } = foodId
              ? await updateFoodEntry({
                  ...values,
                  foodName: values.foodName.trim(),
                  userId: values?.userId || user._id,
                  timezone: moment().format("Z"),
                  foodId,
                })
              : await createFoodEntry({
                  ...values,
                  foodName: values.foodName.trim(),
                  userId: values?.userId || user._id,
                  timezone: moment().format("Z"),
                });
            if (data.calorieLimitExceeded && user.userRole !== "Admin") {
              setSnackMessage(data.calorieLimitExceeded);
              setSeverity("error");
              setSnackBarDuration(10000);
            } else if (data.priceLimitExceeded && user.userRole !== "Admin") {
              setSnackMessage(data.priceLimitExceeded);
              setSeverity("error");
              setSnackBarDuration(10000);
            } else {
              setSnackMessage(data.message);
              setSeverity("success");
            }
            if (user.userRole === "User") await callUserWarningApi();
            await refetchFood({ pageValue: 1 });
          } catch (error) {
            console.log("Error::", error);
            setSnackMessage(error.message);
            setSeverity("error");
          } finally {
            setSubmitting(false);
            setOpenSnack(true);
            handleClose();
          }
        }}
      >
        {({
          values,
          errors,
          setFieldValue,
          handleSubmit,
          isSubmitting,
          dirty,
        }) => {
          const isError = Object.keys(errors).length;
          return (
            <Dialog
              open={open}
              onClose={handleClose}
              className="addEntryDialog"
            >
              <Grid>
                <Typography variant="h6">Add Entry</Typography>

                {user.userRole === "Admin" && (
                  <Grid className="inputSpacing">
                    <Typography variant="body1">Users</Typography>
                    <SearchUsers
                      value={values.userValue}
                      setSelectedValue={(val) => {
                        if (val?.value) {
                          setFieldValue("userValue", val);
                          setFieldValue("userId", val.value);
                        }
                      }}
                    />{" "}
                    {errors?.userId ? (
                      <div className="errorText">{errors?.userId}</div>
                    ) : null}{" "}
                  </Grid>
                )}

                <Grid className="inputSpacing">
                  <Typography variant="body1">Food Name</Typography>
                  <InputBase
                    value={values.foodName}
                    autoComplete="off"
                    type="text"
                    placeholder="Name"
                    required
                    onChange={(e) => {
                      setFieldValue("foodName", e.target.value);
                    }}
                  />{" "}
                  {errors.foodName ? (
                    <div className="errorText">{errors.foodName}</div>
                  ) : null}{" "}
                </Grid>

                <Grid className="inputSpacing">
                  <Typography variant="body1">Calories</Typography>
                  <InputBase
                    value={values.Calorie}
                    type="number"
                    placeholder="Calories"
                    required
                    onChange={(e) => {
                      //   if (Number(e.target.value) > 0) {
                      setFieldValue("Calorie", Number(e.target.value));
                      //   }
                    }}
                  />
                  {errors.Calorie ? (
                    <div className="errorText">{errors.Calorie}</div>
                  ) : null}{" "}
                </Grid>
                <Grid className="inputSpacing">
                  <Typography variant="body1">Price ($)</Typography>
                  <InputBase
                    value={values.price}
                    type="number"
                    placeholder="Price"
                    required
                    onChange={(e) => {
                      setFieldValue("price", Number(e.target.value));
                    }}
                  />
                  {errors.price ? (
                    <div className="errorText">{errors.price}</div>
                  ) : null}{" "}
                </Grid>

                <Grid className="inputSpacing dateTimeInput">
                  <Typography variant="body1">Date/TIme</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      // label="Date&Time picker"
                      value={values.dateTaken}
                      onChange={(e) => handleDateChange(e, setFieldValue)}
                      disableFuture={true}
                      maxDateTime={new Date()}
                      renderInput={(params) => {
                        const newParams = {
                          ...params,
                          inputProps: {
                            ...params.inputProps,
                            disabled: true,
                          },
                          disabled: true,
                        };
                        return <TextField {...newParams} />;
                      }}
                    />
                  </LocalizationProvider>
                  {errors.dateTaken ? (
                    <div className="errorText">{errors.dateTaken}</div>
                  ) : null}{" "}
                </Grid>
              </Grid>

              <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isError || isSubmitting || !dirty}
                >
                  {isSubmitting
                    ? foodId
                      ? "Updating..."
                      : "Saving..."
                    : foodId
                    ? "Update"
                    : "Save"}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </Grid>
  );
};
export default AddEntryDialog;
