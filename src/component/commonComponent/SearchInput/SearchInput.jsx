import React from "react";
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "280px",
        marginBottom: "15px",
        marginTop: "15px",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: "8px 35px 8px 10px",
          width: "100%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#888",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        <IoSearchSharp />
      </span>
    </div>
  );
};

export default SearchInput;
