import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Checkbox, Tooltip } from "antd";

const CheckboxsInput = ({
  id = Utils.getUniqueId(),
  style = {},
  options = [],
  required = false,
  readonly = false,
  placeholder = "",
  checkbox_width = "max",
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
  const handleValueInput = (value, idx) => {
    let _options = [...options]
    _options[idx]['selected'] = value

    onInput(_options);
  };
  const handleValueChange = (value, idx) => {
    let _options = [...options]
    _options[idx]['selected'] = value

    onChange(_options);
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
        <div className="checkboxs-inputs-items">
          {options?.map((item, idx) => (
            <div
              key={`checkboxs-inputs-item-${id}-${idx}`}
              className={`checkboxs-inputs-item elem-width-${checkbox_width || 'max'}`}>
              <Checkbox

                style={{
                  ...style,
                  height: '44px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem'
                }}
                checked={item.selected || false}
                required={required}
                disabled={readonly}
                status={invalid ? 'error' : ''}
                onInput={(e) => handleValueInput(e.target.checked, idx)}
                onChange={(e) => handleValueChange(e.target.checked, idx)}
              >
                {item.icon &&
                  <div className="checkboxs-inputs-item-icon"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  ></div>
                }
                {item.img &&
                  <div className="checkboxs-inputs-item-icon"
                  >
                    <img src={item.img} />
                  </div>
                }
                <div className="checkboxs-inputs-item-label">{item.label}</div>

              </Checkbox>
            </div>
          ))}

        </div>

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>
    </div>
  );
};

export default CheckboxsInput;
