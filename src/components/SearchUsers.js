import React from "react";
import AsyncSelect from "react-select/async";
import { Grid } from "@mui/material";
import { getAllUsers } from "../apis/userApi";

const SearchUsers = ({ setSelectedValue, isClearable, value }) => {
  const loadOptions = (inputValue) => {
    return new Promise((resolve) => {
      // API call
      getAllUsers({ userName: inputValue }).then((res) => {
        if (res?.data?.docs?.length) {
          const options = res?.data?.docs?.map((item) => ({
            value: item._id,
            label: `${item.userName || ""}`,
          }));
          resolve(options);
        } else {
          resolve([]);
        }
      });
    });
  };

  const handleInputChange = (newValue) => newValue;

  return (
    <Grid>
      <AsyncSelect
        isClearable={isClearable ? true : false}
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        value={value}
        placeholder="Select User"
        onChange={(value) => {
          if (!value) {
            setSelectedValue({ value: "", label: "" });
          } else {
            setSelectedValue(value);
          }
        }}
        className="react-select-container"
        classNamePrefix="react-select"
        onInputChange={handleInputChange}
      />
    </Grid>
  );
};
export default SearchUsers;
