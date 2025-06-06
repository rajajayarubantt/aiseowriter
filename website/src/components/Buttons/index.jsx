import React, { useEffect } from "react";

/*Helpers */
import Utils from "../../helpers/utils";

const Index = ({
  id = Utils.getUniqueId(),
  type = "default",
  button_type = "button",
  width = "md",
  classes = "",
  icon = null,
  icon_left = true,
  label = "",
  disable = false,
  callback_type = "function",
  link = "#",
  callback = () => { },
}) => {
  const handleClick = (e) => {
    if (callback_type == "function") callback(e);
  };

  return (
    <button
      type={button_type}
      key={`${id}-button-main`}
      id={`${id}-button-main`}
      className={`button button-${type} elem-width-${width} ${classes} ${disable && 'button-disable'}`}
      onClick={handleClick}
      disabled={disable}
    >
      {icon && icon_left && (
        <div
          dangerouslySetInnerHTML={{ __html: icon }}
          className="button-icon"
        ></div>
      )}
      <div className="button-label">{label}</div>
      {icon && !icon_left && (
        <div
          dangerouslySetInnerHTML={{ __html: icon }}
          className="button-icon"
        ></div>
      )}
    </button>
  );
};

export default Index;
