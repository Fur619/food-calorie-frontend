import * as React from "react";
import { Card, Typography } from "@mui/material";

const WarningCard = ({ type, mainText, secondaryText, className }) => {
  return (
    <Card className={className}>
      <Typography variant="h6">{mainText}</Typography>
      <Typography variant="body1">{secondaryText}</Typography>
    </Card>
  );
};
export default WarningCard;
