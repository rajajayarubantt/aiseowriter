import React, { useState, useRef, useEffect } from "react";


import Utils from "../../helpers/utils";
import Icons from "../../assets/Icons";
import Images from "../../assets/Images";
import Buttons from "../Buttons";

const ProfileUpload = ({
    id = Utils.getUniqueId(),
    label = "Upload Image",
    width = 'max',
    desc = "PNG or JPG",
    btn_label = "Upload",
    readonly = false,
    image = undefined,
    maxSize = 1024 * 1024, // Default 1MB
    callback = () => { }
}) => {
    const [Image, setImage] = useState(image || Images.Default);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ["image/png", "image/jpeg"];
            if (!validTypes.includes(file.type)) {
                setError("Invalid file type. Please upload a PNG or JPG.");
                return;
            }
            if (file.size > maxSize) {
                setError(`File size exceeds ${maxSize / 1024 / 1024}MB. Please upload a smaller file.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setError("");
                callback(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBtnClick = (e) => {
        console.log(fileInputRef, 'fileInputRef');

        fileInputRef.current.click()
    }

    useEffect(() => {
        setImage(image || Images.Default)
    }, [image])

    return (
        <div id={`${id}-input`} className={`profile-upload-main elem-width-${width}`}>
            <div className="upload-preview">
                <img src={Image} alt="Uploaded Preview" />
            </div>
            <div className="upload-input-main">
                <div className="input-label">{label}</div>
                <div className="input-desc">{desc} (max {maxSize / 1024 / 1024}MB)</div>
                <input
                    ref={fileInputRef}
                    className="file-input"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                {!readonly &&
                    <Buttons
                        type="primary"
                        width="auto"
                        icon={Icons.default.upload}
                        label={btn_label}
                        callback={handleBtnClick}
                        _style={{
                            height: '42px',
                            minheight: '42px',
                        }}
                    />
                }
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default ProfileUpload;
