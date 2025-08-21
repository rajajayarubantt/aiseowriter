import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Input, Tooltip } from "antd";

const TextInput = ({
  id = Utils.getUniqueId(),
  type = "text",
  style = {},
  value = "",
  readonly = false,
  required = false,
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
    if (!e) return onChange("");
    let value = e.target.value;
    onInput(value);
  };
  const handleValueChange = (e) => {

    if (!e) return onChange("");

    let value = e.target.value;

    onChange(value);
  };

  const getIcon = (icon) => {

    return icon ? <div className="icon-default"
      dangerouslySetInnerHTML={{ __html: icon }}
    ></div> : null
  }


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
            <Tooltip title="prompt text">
              <div className="input-info_tooltip-main">
                <div
                  className="info_tooltip-icon"
                  dangerouslySetInnerHTML={{ __html: Icons.default.info }}
                ></div>
                {/* <div className="info_tooltip-label">{info_tooltip}</div> */}
              </div>
            </Tooltip>
          )}
        </label>
      )}
      <div className="input-input-main">
        <Input
          style={{
            ...style,
            width: '100%',
            height: '42px'
          }}
          allowClear={!readonly}
          prefix={icon_position == 'left' ? getIcon(icon) || null : null}
          suffix={icon_position != 'left' ? getIcon(icon) || null : null}
          type={type}
          value={value}
          status={invalid ? 'error' : ''}
          required={required}
          readOnly={readonly}
          placeholder={placeholder || ""}
          onClear={handleValueChange}
          onInput={handleValueInput}
          onChange={handleValueChange}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>
    </div>
  );
};

export default TextInput;
