import { Fragment, useContext, useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Badge,
  Divider,
  Button,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import WarningCard from "../../components/WarningCard";
import { AppContext } from "../../context";
import {
  getUserCalorieWarnings,
  getUserMonthlyPriceWarnings,
} from "../../apis/userApi";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AllWarnings = () => {
  const { user, noOfCalorieWarnings, noOfPriceWarnings } =
    useContext(AppContext);
  const [value, setValue] = useState(0);
  const [laoding, setLoading] = useState(true);
  const [laodingMore, setLoadingMore] = useState(false);
  const [dailyWarnings, setDailyWarnings] = useState([]);
  const [monthlyPriceWarnings, setMonthlyPriceWarnings] = useState([]);
  const [dailyWarningPage, setDailyWarningPage] = useState(1);
  const [monthlyWarningPage, setMonthlyWarningPage] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const callApi = async () => {
    try {
      setLoading(true);
      if (user) {
        const { data } = await getUserCalorieWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });

        const { data: priceWarnings } = await getUserMonthlyPriceWarnings({
          id: user._id,
          timezone: moment().format("Z"),
        });

        if (priceWarnings.warnings.data?.length) {
          setMonthlyPriceWarnings(priceWarnings.warnings.data);
        }

        if (data.warnings.data?.length) {
          setDailyWarnings(data.warnings.data);
        }
      }
    } catch (error) {
      console.log("Error::", error);
    } finally {
      setLoading(false);
    }
  };
  const loadMoreDailyWarnings = async () => {
    try {
      setLoadingMore(true);
      setDailyWarningPage(dailyWarningPage + 1);
      if (user) {
        const { data } = await getUserCalorieWarnings({
          id: user._id,
          timezone: moment().format("Z"),
          page: dailyWarningPage + 1,
        });

        if (data.warnings.data?.length) {
          setDailyWarnings([...dailyWarnings, ...data.warnings.data]);
        }
      }
    } catch (error) {
      console.log("Error::", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreMonthlyWarnings = async () => {
    try {
      setLoadingMore(true);
      setMonthlyWarningPage(monthlyWarningPage + 1);
      if (user) {
        const { data } = await getUserMonthlyPriceWarnings({
          id: user._id,
          timezone: moment().format("Z"),
          page: monthlyWarningPage + 1,
        });

        if (data.warnings.data?.length) {
          setMonthlyPriceWarnings([
            ...monthlyPriceWarnings,
            ...data.warnings.data,
          ]);
        }
      }
    } catch (error) {
      console.log("Error::", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [user]);

  return (
    <>
      {/* <Header /> */}

      <Container>
        <Box marginTop={10} sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label={
                  <Badge badgeContent={noOfCalorieWarnings} color="error">
                    Daily Calories limit Warnings
                  </Badge>
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <Badge badgeContent={noOfPriceWarnings} color="error">
                    Monthly Price Limit Warnings
                  </Badge>
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {laoding ? (
              <>Loading...</>
            ) : (
              <>
                {" "}
                {dailyWarnings.length ? (
                  dailyWarnings?.map((item) => (
                    <Fragment key={item._id}>
                      <Box padding="15px 0px">
                        <WarningCard
                          className="emptyCard warningCard"
                          mainText={"Calorie Limit Warning!"}
                          secondaryText={`You Have Reached your daily Calorie Threshold Limit for day ${moment(
                            item._id
                          ).format(
                            "MMMM DD, YYYY"
                          )}. Calorie amount on this day is ${item.amount}`}
                        />
                      </Box>
                      <Divider />
                    </Fragment>
                  ))
                ) : (
                  <Box padding="15px 0px">
                    <WarningCard
                      className="emptyCard successCard"
                      type={"noWarning"}
                      mainText={"Congratulations. You have no warning."}
                      secondaryText={
                        "You are doing great. Keep adding entries and keep it up"
                      }
                    />
                  </Box>
                )}
                <Box textAlign="center">
                  {dailyWarnings?.length < noOfCalorieWarnings && (
                    <Button
                      disabled={laodingMore}
                      onClick={loadMoreDailyWarnings}
                      className="loadMore"
                    >
                      {laodingMore ? "Loading More ..." : "Load More"}
                    </Button>
                  )}
                </Box>
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {laoding ? (
              <>Loading...</>
            ) : (
              <>
                {" "}
                {monthlyPriceWarnings.length ? (
                  monthlyPriceWarnings?.map((item) => (
                    <Fragment key={item._id}>
                      <Box padding="15px 0px">
                        <WarningCard
                          className="emptyCard warningCard"
                          mainText={"Monthly Price Limit Warning!"}
                          secondaryText={`You Have Reached your monthly price limit for month ${moment(
                            item._id
                          ).format(
                            "MMMM, YYYY"
                          )}. Price amount on this month is ${item.amount}`}
                        />
                      </Box>
                      <Divider />
                    </Fragment>
                  ))
                ) : (
                  <Box padding="15px 0px">
                    <WarningCard
                      className="emptyCard successCard"
                      type={"noWarning"}
                      mainText={"Congratulations. You have no warning."}
                      secondaryText={
                        "You are doing great. Keep adding entries and keep it up"
                      }
                    />
                  </Box>
                )}
                <Box textAlign="center">
                  {monthlyPriceWarnings?.length < noOfPriceWarnings && (
                    <Button
                      disabled={laodingMore}
                      onClick={loadMoreMonthlyWarnings}
                      className="loadMore"
                    >
                      {laodingMore ? "Loading More ..." : "Load More"}
                    </Button>
                  )}
                </Box>
              </>
            )}
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};
export default AllWarnings;
