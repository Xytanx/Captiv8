import React from "react";
import UploadIcon from "./UploadIcon"; // Adjust path if needed

export default function UploadButton({ onChange, className = "" }) {
  return (
    <div className={`button ${className}`}>
      {/* Hidden file input */}
      <input
        id="button"
        type="file"
        className="hidden"
        onChange={onChange}
      />

      {/* The label is our "button" */}
      <label htmlFor="button">
        <div className="button_inner q">
          {/* Use UploadIcon on the left side */}
          <UploadIcon className="l" />

          {/* Button text */}
          <span className="t">Choose File</span>

          {/* The checkmark icon (shown after checkbox is checked) */}
          <span>
            <i className="tick ion-checkmark-round"></i>
          </span>

          {/* Fizzy spots (52) for the confetti-like effect */}
          <div className="b_l_quad">
            {Array.from({ length: 52 }).map((_, i) => (
              <div key={i} className="button_spots"></div>
            ))}
          </div>
        </div>
      </label>
    </div>
  );
}
