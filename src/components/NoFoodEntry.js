import * as React from "react";
import { Card, Typography } from "@mui/material";

const NoFoodEntry = ({ mainText, secondaryText }) => {
  return (
    <Card className="emptyCard">
      <Typography variant="h6">{mainText}</Typography>
      <Typography variant="body1">{secondaryText}</Typography>
    </Card>
  );
};
export default NoFoodEntry;
