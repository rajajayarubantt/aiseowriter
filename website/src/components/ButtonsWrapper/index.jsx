import React, { useEffect } from "react";

const Index = ({ classes = "", direction = "row", align = "start", children }) => {

  return (
    <div className={`button-wrapper ${classes || ""} button-wrapper-align-${align} button-wrapper-direction-${direction}`}>{children}</div>
  )
};

export default Index;
