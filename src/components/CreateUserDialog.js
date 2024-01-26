import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  Typography,
  InputBase,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

import { createUser } from "../apis/userApi";

const CreateUserDialog = ({
  refetchUsers,
  open,
  handleClickOpen,
  handleClose,
  setSnackMessage,
  setSeverity,
  setOpenSnack,
  setSnackBarDuration,
}) => {
  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .min(3)
      .required("Required")
      .matches(
        /^([Aa-zZ]{1})+([Aa-zZ0-9\s])*$/i,
        "Only alphanumerics are allowed with username starting with alphabet"
      )
      .trim(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Required")
      .trim(),
  });

  return (
    <Grid>
      <Button
        variant="contained"
        className="addEntryButton"
        onClick={handleClickOpen}
      >
        Create User
      </Button>

      <Formik
        initialValues={{
          userName: "",
          email: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const { data } = await createUser({
              ...values,
              userName: values.userName.trim(),
            });
            setSnackMessage(data.message);
            setSeverity("success");

            await refetchUsers({ pageValue: 1 });
          } catch (error) {
            setSnackMessage(error?.response?.data?.message);
            setSeverity("error");
          } finally {
            setSubmitting(false);
            setOpenSnack(true);
            resetForm();
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
          resetForm,
        }) => {
          const isError = Object.keys(errors).length;
          return (
            <Dialog
              open={open}
              onClose={handleClose}
              className="addEntryDialog"
            >
              <Grid>
                <Typography variant="h6">Create User</Typography>

                <Grid className="inputSpacing">
                  <Typography variant="body1">User Name</Typography>
                  <InputBase
                    value={values.userName}
                    autoComplete="off"
                    type="text"
                    placeholder="User Name"
                    required
                    onChange={(e) => {
                      setFieldValue("userName", e.target.value);
                    }}
                  />{" "}
                  {errors.userName ? (
                    <div className="errorText">{errors.userName}</div>
                  ) : null}{" "}
                </Grid>

                <Grid className="inputSpacing">
                  <Typography variant="body1">Email</Typography>
                  <InputBase
                    value={values.email}
                    autoComplete="off"
                    type="email"
                    placeholder="User Email"
                    required
                    onChange={(e) => {
                      setFieldValue("email", e.target.value);
                    }}
                  />{" "}
                  {errors.email ? (
                    <div className="errorText">{errors.email}</div>
                  ) : null}{" "}
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  onClick={() => {
                    resetForm();
                    handleClose();
                  }}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isError || isSubmitting || !dirty}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </Grid>
  );
};
export default CreateUserDialog;
