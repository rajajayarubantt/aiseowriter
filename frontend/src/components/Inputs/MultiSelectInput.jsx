import React, { useState, useEffect } from "react";
import Utils from "../../helpers/utils";

import Icons from "../../assets/Icons";
import Images from "../../assets/Images";

import { Select, Tooltip } from "antd";

const SelectInput = ({
  id = Utils.getUniqueId(),
  options = [],
  style = {},
  value = [],
  placeholder = "",
  required = false,
  readonly = false,
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


  const handleValueChange = (e) => {
    onChange(e)
  };

  const getIcon = (icon) => {

    return icon ? <div className="icon-default"
      dangerouslySetInnerHTML={{ __html: icon }}
    ></div> : null
  }


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
        <Select
          style={{
            ...style,

            width: '100%',
            height: '80px'
          }}
          allowClear={!readonly}
          showSearch
          mode="multiple"
          prefix={icon_position == 'left' ? getIcon(icon) || null : null}
          suffix={icon_position != 'left' ? getIcon(icon) || null : null}
          status={invalid ? 'error' : ''}
          placeholder={placeholder}
          aria-required={required}
          disabled={readonly}
          optionFilterProp="label"
          value={value || null}
          onChange={handleValueChange}
          options={Options}
        />

        {(invalid && invalid_label) && <div className="input-invalid-label">{invalid_label}</div>}
      </div>


    </div>
  );
};

export default SelectInput;
