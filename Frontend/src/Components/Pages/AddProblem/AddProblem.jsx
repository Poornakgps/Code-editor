import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./AddProblem.module.css";

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    input: "",
    output: "",
    memorylimit: "",
    timelimit: "",
    inputformat: "",
    outputformat: "",
    constrains: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate= useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await axios.post("/addproblem", formData);
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        rating: "",
        input: "",
        output: "",
        memorylimit: "",
        timelimit: "",
        inputformat: "",
        outputformat: "",
        constrains: "",
      });
      navigate('/problems')
    } catch (err) {
      setError("Failed to add problem");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    "title",
    "description",
    "rating",
    "input",
    "output",
    "memorylimit",
    "timelimit",
    "inputformat",
    "outputformat",
    "constrains",
  ];

  return (
    <div className={classes["add-problem-container"]}>
      <div className={classes.addProbWrap}>
        <h1 className={classes.title}>Add a Problem</h1>
        <form className={classes["problem-form"]} onSubmit={handleSubmit}>
          {formFields.map((field, idx) => (
            <div className={classes["form-group"]} key={idx}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "memorylimit" && " (MB)"}
                {field === "timelimit" && " (seconds)"}
              </label>
              {[
                "description",
                "input",
                "output",
                "inputformat",
                "outputformat",
                "constraints",
              ].includes(field) ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={
                    ["rating", "memorylimit", "timelimit"].includes(field)
                      ? "number"
                      : "text"
                  }
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  min={0}
                  step={field === "rating" ? 0.1 : 1}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className={`${classes["submit-button"]} ${
              loading ? classes.loading : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Problem"}
          </button>
          {error && <p className={classes.error}>{error}</p>}
          {success && (
            <p className={classes.success}>Problem added successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
