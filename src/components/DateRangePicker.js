import { Typography, TextField, Box, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import SEARCH_ICON from "../img/search.svg";

const DateRangePicker = ({
  fetchFoods,
  from,
  to,
  setFrom,
  setTo,
  refetchFood,
}) => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const handleDateChange = (newValue, setValue, type) => {
    if (new Date(newValue).getTime() < new Date().getTime()) {
      setValue(newValue);

      navigate({
        pathname: "/home",
        search: urlParams.toString(),
      });
    }
  };

  const handleSearch = async () => {
    urlParams.set("search", true);
    urlParams.set("startDate", from);
    urlParams.set("endDate", to);
    navigate({
      pathname: "/home",
      search: urlParams.toString(),
    });
    await fetchFoods({
      pageValue: 1,
    });
  };

  const handleReset = async () => {
    setFrom(null);
    setTo(null);
    urlParams.get("startDate") &&
      (await refetchFood({ pageValue: 1, removeFilter: true }));
    urlParams.delete("startDate");
    urlParams.delete("endDate");
    urlParams.delete("search");
    navigate({
      pathname: "/home",
      search: urlParams.toString(),
    });
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" className="dateRangePicker">
        <Box>
          <Typography variant="body1">From</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={from || urlParams.get("startDate")}
              onChange={(e) => handleDateChange(e, setFrom, "startDate")}
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
        </Box>

        <Box
          display="flex"
          alignItems="center"
          margin="0px 15px"
          paddingTop="20px"
        >
          -
        </Box>

        <Box>
          <Typography variant="body1">To</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={to || urlParams.get("endDate")}
              onChange={(e) => handleDateChange(e, setTo, "endDate")}
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
        </Box>

        <Box
          display="flex"
          alignItems="center"
          margin="0px 15px"
          paddingTop="25px"
        >
          {(from ||
            urlParams.get("startDate") ||
            to ||
            urlParams.get("endDate")) && (
            <Button onClick={handleReset}>Reset</Button>
          )}
          <IconButton
            className="searchButton"
            onClick={handleSearch}
            disabled={
              !from ||
              !to ||
              (from && new Date(from).getTime()) >=
                (to && new Date(to).getTime())
            }
          >
            <img src={SEARCH_ICON} alt="search" />
          </IconButton>
        </Box>
      </Box>

      {((from && new Date(from).getTime()) || new Date().getTime()) >=
        ((to && new Date(to).getTime()) || new Date().getTime() + 1) && (
        <Typography variant="body2" className="errorText">
          From time should be less than To time.
        </Typography>
      )}
    </Box>
  );
};
export default DateRangePicker;
