/* eslint-disable react/prop-types */
import classNames from "classnames";

export default function Dropdown({
  id,
  disabled,
  textHint,
  labelClasses,
  inputClasses,
  classes,
  options,
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
      <select id={id}>
        <option value="" disabled>
          Select {withLabel}
        </option>

      </select>
      <input
        value={value}
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
