import "./ThemeRadio.css"

const ThemeRadio = () => {
    return (
        <div className="uiverse-pixel-radio-group">
            <label className="uiverse-pixel-radio">
                <input type="radio" name="pixel-choice" defaultChecked/>
                <span className="label-text">Option 1</span>
            </label>
            <label className="uiverse-pixel-radio">
                <input type="radio" name="pixel-choice"/>
                <span className="label-text">Option 2</span>
            </label>
            <label className="uiverse-pixel-radio">
                <input type="radio" name="pixel-choice"/>
                <span className="label-text">Option 3</span>
            </label>
        </div>
    );
}


export default ThemeRadio;
