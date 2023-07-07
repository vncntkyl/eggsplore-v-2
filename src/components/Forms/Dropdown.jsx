/* eslint-disable react/prop-types */
import classNames from "classnames";

export default function Dropdown({
  id,
  disabled,
  textHint,
  labelClasses,
  inputClasses,
  classes,
  type = "text",
  withLabel = null,
  orientation = "row",
  inputRef,
  onChange,
  value,
}) {
  return (
    <div className={classNames("flex gap-2", `flex-${orientation}`, classes)}>
      {withLabel && (
        <label htmlFor={id} className={classNames(labelClasses)}>
          {withLabel}
        </label>
      )}
      <select>
        
      </select>
      <input
        value={value}
        type={type}
        id={id}
        placeholder={textHint}
        disabled={disabled}
        ref={inputRef}
        onChange={onChange}
        className={classNames(
          "outline-none border-none p-1 w-full",
          inputClasses
        )}
      />
    </div>
  );
}
