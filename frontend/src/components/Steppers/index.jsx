import React from "react";

const Index = ({ width = "100%", steps = 3, done = 0 }) => {
    return (
        <div className="stepper-line-main" style={{ width }}>
            {Array.from({ length: steps }).map((_, index) => (
                <div
                    key={`stepper-line-${index}`}
                    className={`stepper-line ${index < done ? "stepper-line-done" : ""}`}
                ></div>
            ))}
        </div>
    );
};

export default Index;
