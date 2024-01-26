import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllUsersReport } from "../../apis/userApi";
import SearchUsers from "../../components/SearchUsers";

const Report = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  const callApi = async () => {
    try {
      setLoading(true);
      const { data } = await getAllUsersReport({ userId });
      setReport(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    callApi();
  }, [userId]);
  return (
    <>
      <Container>
        <Grid className="authenticateWrapper">
          <Box
            display={"flex"}
            alignItems="center"
            justifyContent={"center"}
            marginBottom={5}
          >
            <Typography variant="h5" className="headingText">
              Report For {userName ? userName : "All Users"}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            alignItems="center"
            justifyContent={"flex-end"}
            marginBottom={5}
            className="selectUsers"
          >
            <SearchUsers
              isClearable={true}
              setSelectedValue={(val) => {
                if (val?.value) {
                  setUserId(val.value);
                  setUserName(val.label);
                } else {
                  setUserId(null);
                  setUserName("");
                }
              }}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card className="reportCard">
                <Typography variant="body2">This Week</Typography>

                {loading ? (
                  "Calculating..."
                ) : (
                  <>
                    {" "}
                    <Typography variant="h6">
                      {userId
                        ? report.lastWeekCalories || 0
                        : report.lastWeekAvg || 0}
                    </Typography>
                    <Typography variant="body1">
                      {userId ? "Total Calories" : "Average Weekly Calories"}
                    </Typography>
                    <Typography variant="h6">
                      {report.lastWeekEntries}
                    </Typography>
                    <Typography variant="body1">Weekly Entries</Typography>
                  </>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="reportCard">
                <Typography variant="body2">Previous Week</Typography>
                {loading ? (
                  "Calculating..."
                ) : (
                  <>
                    {" "}
                    <Typography variant="h6">
                      {userId
                        ? report.twoWeekBeforeCalories || 0
                        : report.twoWeekBeforeAvg || 0}
                    </Typography>
                    <Typography variant="body1">
                      {userId ? "Total  Calories" : "Average Weekly Calories"}
                    </Typography>
                    <Typography variant="h6">
                      {report.twoWeeksBeforeEntries}
                    </Typography>
                    <Typography variant="body1">Weekly Entries</Typography>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default Report;
