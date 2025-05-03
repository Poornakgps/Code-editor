import classes from './InputComponent.module.css'; // Import the CSS file for styling

// eslint-disable-next-line react/prop-types
const InputComponent=({ input, setInput })=>{
  return (
    <div className={classes.ioCont}>
      <h3>Input</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input here..."
        className={classes.ioTextArea}
      />
    </div>
  );
}

export default InputComponent;