import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const TypingMarkdown = ({ has_animation = false, text = [], speed = 10, }) => {

    const [displayText, setDisplayText] = useState("");

    const handleTypingAnimation = (text, speed) => {
        setDisplayText("");

        let index = 0;
        const minSpeed = 10;
        const maxSpeed = 100;
        const adjustedSpeed = minSpeed + (maxSpeed - speed) * 0.9;

        if (has_animation) {
            function typeText() {
                if (index < text.length) {
                    setDisplayText(prev => prev + (text[index] === "\n" ? "\n" : text[index]));
                    index++;
                    setTimeout(typeText, Math.random() * adjustedSpeed + 10);
                }
            }

            typeText();
        } else setDisplayText(text)

    }

    useEffect(() => {
        handleTypingAnimation(text, speed)
    }, [text, speed]);

    return (
        <ReactMarkdown>{displayText}</ReactMarkdown>
    );
};

export default TypingMarkdown;
