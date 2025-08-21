import React, { useState } from "react";

/*Helpers */
import Utils from "../../helpers/utils";

const Index = ({ id = Utils.getUniqueId(), width = "100%", value = '', options = [], option_style = {}, callback = () => { } }) => {

    const [selectedOption, setSelectedOption] = useState(value || "");

    const handleSelect = (option) => {
        setSelectedOption(option.value);
        callback(option.value);
    };

    return (
        <div key={`options-selector-${id}`} className="options-selector-main" style={{ width }}>
            <div className="options-selector-items">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`options-selector-item ${selectedOption == option.value && "options-active"}`}
                        style={option_style}
                        onClick={() => handleSelect(option)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Index;
