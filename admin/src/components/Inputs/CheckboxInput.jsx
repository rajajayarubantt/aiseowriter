import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Checkbox, Tooltip } from "antd";

const CheckboxInput = ({
  id = Utils.getUniqueId(),
  style = {},
  value = false,
  required = false,
  readonly = false,
  placeholder = "",
  invalid = false,
  invalid_label = "",
  icon = null,
  icon_position = "left",
  label = "",
  label_icon = null,
  label_icon_left = true,
  info_tooltip = "",
  onInput = () => { },
  onChange = () => { },
}) => {
  const handleValueInput = (e) => {
    let value = e.target.checked;
    onInput(value);
  };
  const handleValueChange = (e) => {
    let value = e.target.checked;
    onChange(value);
  };

  return (
    <div
      key={`${id}-input`}
      id={`${id}-input`}
      className={`text-input-main ${required ? "input-required" : ""} ${invalid ? "input-invalid" : ""}`}
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
      <div className="input-input-main">

        <Checkbox
          style={{
            ...style,

            width: '100%',
            height: '42px'
          }}
          value={value}
          required={required}
          disabled={readonly}
          status={invalid ? 'error' : ''}
          placeholder={placeholder || ""}
          onInput={handleValueInput}
          onChange={handleValueChange}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>
    </div>
  );
};

export default CheckboxInput;
