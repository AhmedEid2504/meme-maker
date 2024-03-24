import PropTypes from "prop-types";

const TextInput = ({ textInput, index, handleChange, handleRemoveTextInput, showSettings, handleShowSettings }) => {
    return (
        <div className="input-container">
            <div className="input">
                <label htmlFor={`text${index + 1}`}>Text:</label>
                <input
                    type="text"
                    name="text"
                    placeholder={`Text ${index + 1}`}
                    className="form-input text"
                    value={textInput.text}
                    onChange={(event) => handleChange(event, index)}
                />
            </div>
            {showSettings && ( 
                <>
                    <div className="input">
                        <label htmlFor="fontSize">Font Size: </label>
                        <input
                            id="fontSize"
                            type="number"
                            name="size"
                            className="form-input size"
                            placeholder="px"
                            value={textInput.size}
                            min={13}
                            list="defaultNumbers"
                            onChange={(event) => handleChange(event, index)}
                        />
                        <datalist id="defaultNumbers">
                            {textInput.defaultSizes.map((size, i) => (
                                <option key={i} value={size}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className="input">
                        <label htmlFor={`color${index + 1}`}>Color:</label>
                        <input
                            id={`color${index + 1}`}
                            type="color"
                            name="color"
                            className="form-input color"
                            value={textInput.color}
                            onChange={(event) => handleChange(event, index)}
                        />
                    </div>
                    {/* Other settings */}
                </>
            )}
            <div className="input-buttons">
                <button className="form-button remove" onClick={() => handleRemoveTextInput(index)}><img src="images/delete.png" alt="delete icon" /></button>
                <button className="form-button settings" onClick={handleShowSettings} ><img src="/images/settings.png" alt="settings icon" /></button>
            </div>
        </div>
    );
}

TextInput.propTypes = {
    textInput: PropTypes.shape({
        text: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        defaultSizes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleRemoveTextInput: PropTypes.func.isRequired,
    showSettings: PropTypes.bool.isRequired,
    handleShowSettings: PropTypes.func.isRequired,
};

export default TextInput;
