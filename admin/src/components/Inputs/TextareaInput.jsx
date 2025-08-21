import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Input, Tooltip } from "antd";

const TextareaInput = ({
  id = Utils.getUniqueId(),
  value = "",
  style = {},
  placeholder = "",
  invalid = false,
  invalid_label = "",
  icon = null,
  icon_position = 'left',
  required = false,
  readonly = false,
  label = "",
  label_icon = null,
  label_icon_left = true,
  info_tooltip = "",
  onInput = () => { },
  onChange = () => { },
}) => {

  const handleValueInput = (e) => {
    let value = e.target.value;
    onInput(value);
  };
  const handleValueChange = (e) => {

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
      className={`textarea-input-main ${required ? "input-required" : ""} ${invalid ? "input-invalid" : ""}`}
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
        <Input.TextArea
          style={{
            width: '100%',
            height: '80px',
            ...style,
          }}
          allowClear={!readonly}
          value={value}
          prefix={icon_position == 'left' ? getIcon(icon) || null : null}
          suffix={icon_position != 'left' ? getIcon(icon) || null : null}
          status={invalid ? 'error' : ''}
          placeholder={placeholder || ""}
          onChange={handleValueChange}
          required={required}
          readOnly={readonly}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>
    </div>
  );
};

export default TextareaInput;
