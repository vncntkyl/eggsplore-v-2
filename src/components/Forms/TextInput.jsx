/* eslint-disable react/prop-types */
import classNames from "classnames";

export default function TextInput({
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
  name = null,
  step = 1,
  max,
  wfull = "w-full"
}) {
  return (
    <div className={classNames("flex gap-2", `flex-${orientation}`, classes)}>
      {withLabel && (
        <label htmlFor={id} className={classNames(labelClasses)}>
          {withLabel}
        </label>
      )}
      <input
        name={name}
        value={value}
        type={type}
        id={id}
        min={0}
        max={max}
        step={step}
        placeholder={textHint}
        disabled={disabled}
        ref={inputRef}
        onChange={onChange}
        className={classNames(
          "outline-none border-none p-1 ",
          inputClasses,
          wfull
        )}
      />
    </div>
  );
}
