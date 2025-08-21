import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Segmented, Tooltip } from "antd";

const SegmentInput = ({
  id = Utils.getUniqueId(),
  options = [],
  has_option_icon = false,
  style = {},
  value = null,
  vertical = false,
  required = false,
  readonly = false,
  allowclear = true,
  invalid = false,
  invalid_label = "",
  icon = null,
  icon_position = "left",
  label = "",
  label_icon = null,
  label_icon_left = true,
  info_tooltip = "",
  onChange = () => { },
}) => {
  const [Options, setOptions] = useState([...options]);



  useEffect(() => {
    setOptions(options);
  }, [options]);

  return (
    <div
      key={`${id}-input`}
      id={`${id}-input`}
      className={`select-input-main ${required ? "input-required" : ""} ${invalid ? "input-invalid" : ""}`}
    >
      {label && (
        <label className="input-label-main" htmlFor={`${id}-input`}>
          {label_icon && label_icon_left && (
            <div
              className="label-icon"
              dangerouslySetInnerHTML={{ __html: label_icon }}
            ></div>
          )}
          <div className="label-txt">{label}</div>
          {label_icon && !label_icon_left && (
            <div
              className="label-icon"
              dangerouslySetInnerHTML={{ __html: label_icon }}
            ></div>
          )}
          {info_tooltip && (
            <div className="input-info_tooltip-main">
              <Tooltip title={info_tooltip}>
                <div
                  className="info_tooltip-icon"
                  dangerouslySetInnerHTML={{ __html: Icons.default.info }}
                ></div>
              </Tooltip>
            </div>
          )}
        </label>
      )}
      <div className="input-input-main" id={`${id}input-input-main`}>

        <Segmented
          className="segment-input"
          options={Options}
          vertical={vertical}
          style={{
            ...style,

            width: '100%',
            minHeight: '42px',
            borderRadius: '0.5rem'
          }}
          block
          onChange={onChange}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>


    </div>
  );
};

export default SegmentInput;
