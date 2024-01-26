import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useEffect, useState, Fragment } from "react";
import { getAllUsers, getUserToken } from "../../apis/userApi";
import CreateUserDialog from "../../components/CreateUserDialog";
import DeleteDialog from "../../components/DeleteDialog";
import NoFoodEntry from "../../components/NoFoodEntry";
import SnackbarComponent from "../../components/SnackBar";

const AllUsers = () => {
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [userTokenEmail, setUserTokenEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [snackBarDuration, setSnackBarDuration] = useState(4000);

  const handleOpenDialog = () => {
    setOpenCreateUserDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenCreateUserDialog(false);
  };
  const handleCloseSnackbar = () => {
    setOpenSnack(false);
    setSnackMessage("");
  };

  const callApi = async ({ pageValue }) => {
    try {
      pageValue === 1 && setLoading(true);
      pageValue > 1 && setIsLoadingMore(true);

      setPage(pageValue);
      const { data } = await getAllUsers({ limit: 10, page: pageValue || 1 });
      setUsers(pageValue === 1 ? [...data?.docs] : [...users, ...data?.docs]);
      setHasNextPage(data?.hasNextPage);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };
  const handleLoadMore = async () => {
    await callApi({ pageValue: page + 1 });
  };

  const handleFetchToken = async (email) => {
    try {
      setIsFetchingToken(true);
      setUserTokenEmail(email);
      const { data } = await getUserToken({ email });
      setUserToken(data);
    } catch (err) {
      console.log("err::", err);
    } finally {
      setIsFetchingToken(false);
    }
  };

  useEffect(() => {
    callApi({ pageValue: 1 });
  }, []);
  return (
    <>
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
          <Box
            display={"flex"}
            alignItems="center"
            justifyContent={"center"}
            marginBottom={5}
          >
            <Typography variant="h5" className="headingText">
              All Users
            </Typography>
          </Box>
          {userToken && (
            <Box marginBottom={3}>
              <Alert
                variant="filled"
                elevation={6}
                severity={"info"}
                onClose={() => setUserToken("")}
              >
                <AlertTitle>
                  Token for User With Email {userTokenEmail}
                </AlertTitle>
                {userToken}
              </Alert>
            </Box>
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            marginBottom={5}
          >
            <CreateUserDialog
              refetchUsers={callApi}
              open={openCreateUserDialog}
              handleClickOpen={handleOpenDialog}
              handleClose={handleCloseDialog}
              {...{
                setSnackMessage,
                setSeverity,
                setOpenSnack,
                setSnackBarDuration,
              }}
            />
          </Box>

          {loading ? (
            <NoFoodEntry mainText={"Loading Data..."} />
          ) : users?.length ? (
            <Card className="entryCardTable">
              <Divider />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>

                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                {users?.map((item, index) => (
                  <Fragment key={`${index}-${item.dateTaken}`}>
                    <TableBody>
                      <TableRow>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell>{item.email}</TableCell>

                        <TableCell>
                          {item.email && (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent={"space-around"}
                            >
                              <Button
                                onClick={() => handleFetchToken(item.email)}
                                disabled={isFetchingToken}
                              >
                                {isFetchingToken &&
                                item.email === userTokenEmail
                                  ? "Fetching..."
                                  : " Fetch Token"}
                              </Button>
                              <DeleteDialog
                                id={item._id}
                                refetch={callApi}
                                type="user"
                                {...{
                                  setSnackMessage,
                                  setSeverity,
                                  setOpenSnack,
                                }}
                              />
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Fragment>
                ))}
              </Table>

              <Divider />
            </Card>
          ) : (
            <Grid className="spacingGrid">
              <NoFoodEntry mainText={"No user Exists!!!"} />
            </Grid>
          )}
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
        </Grid>
      </Container>
    </>
  );
};
export default AllUsers;
