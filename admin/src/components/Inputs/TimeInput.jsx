import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import dayjs from 'dayjs';
import { TimePicker, Tooltip } from "antd";

const TIME_FORMAT = 'HH:mm';

const TimeInput = ({
  id = Utils.getUniqueId(),
  type = "text",
  style = {},
  value = null,
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
    if (!e) return onInput(null);
    let value = dayjs(`${e.$H}:${e.$m}`, TIME_FORMAT)
    onInput(value);
  };
  const handleValueChange = (e) => {
    if (!e) return onChange(null);
    let value = dayjs(`${e.$H}:${e.$m}`, TIME_FORMAT)
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

        <TimePicker
          format={TIME_FORMAT}
          style={{
            ...style,

            width: '100%',
            height: '42px'
          }}
          allowClear={!readonly}
          value={value}
          prefix={icon_position == 'left' ? getIcon(icon) || null : null}
          suffix={icon_position != 'left' ? getIcon(icon) || null : null}
          required={required}
          disabled={readonly}
          placeholder={placeholder || ""}
          status={invalid ? 'error' : ''}
          onInput={handleValueInput}
          onChange={handleValueChange}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>
    </div>
  );
};

export default TimeInput;
