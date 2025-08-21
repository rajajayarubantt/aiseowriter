import React, { useEffect } from "react";

/*Helpers */
import Utils from "../../helpers/utils";

import TextInput from "./TextInput";
import TagsInput from "./TagsInput";
import NumberInput from "./NumberInput";
import CheckboxInput from "./CheckboxInput";
import CheckboxsInput from "./CheckboxsInput";
import SegmentInput from "./SegmentInput";
import SwitchInput from "./SwitchInput";
import RadioInput from "./RadioInput";
import TextareaInput from "./TextareaInput";
import SelectInput from "./SelectInput";
import MultiSelectInput from "./MultiSelectInput";
import DateRangeInput from "./DateRangeInput";
import TimeInput from "./TimeInput";

const Index = ({
  id = Utils.getUniqueId(),
  type = "text",
  _style = "default",
  width = "md",
  input_props = {
    type: "text",
    style: {},
    value: null,
    readonly: false,
    options: [],
    placeholder: "",
    icon: null,
    icon_position: "left",
    label: "",
    label_icon: null,
    label_icon_left: true,
    info_tooltip: "",
    invalid: false,
    invalid_label: "",
    onInput: () => { },
    onChange: () => { },
  },
}) => {
  const renderInput = () => {
    if (type == "text") return <TextInput id={id} {...input_props} />
    if (type == "password") return <TextInput id={id} {...input_props} />
    if (type == "tags") return <TagsInput id={id} {...input_props} />
    if (type == "number") return <NumberInput id={id} {...input_props} />
    if (type == "checkbox") return <CheckboxInput id={id} {...input_props} />
    if (type == "checkboxs") return <CheckboxsInput id={id} {...input_props} />
    if (type == "switch") return <SwitchInput id={id} {...input_props} />
    if (type == "radio") return <RadioInput id={id} {...input_props} />
    if (type == "segment") return <SegmentInput id={id} {...input_props} />
    else if (type == "textarea") return <TextareaInput id={id} {...input_props} />;
    else if (type == "select") return <SelectInput id={id} {...input_props} />
    else if (type == "multiselect") return <MultiSelectInput id={id} {...input_props} />
    else if (type == "daterange") return <DateRangeInput id={id} {...input_props} value={input_props.value || []} />
    else if (type == "time") return <TimeInput id={id} {...input_props} />
  };


  return (
    <div
      key={`${id}-input-main`}
      id={`${id}-input-main`}
      className={`input-main elem-width-${width} input-style-${_style}`}
    >
      {renderInput()}
    </div>
  );
};

export default Index;
