/* eslint-disable react/prop-types */
import classNames from "classnames";

export default function BigTextInput({
  id,
  disabled,
  textHint,
  labelClasses,
  inputClasses,
  classes,
  withLabel = null,
  orientation = "row",
  inputRef,
  onChange,
  value,
  important = false,
}) {
  return (
    <div className={classNames("flex gap-2", `flex-${orientation}`, classes)}>
      {withLabel && (
        <label htmlFor={id} className={classNames(labelClasses)}>
          {withLabel}
        </label>
      )}
      <textarea
        value={value}
        id={id}
        placeholder={textHint}
        disabled={disabled}
        ref={inputRef}
        onChange={onChange}
        required={important}
        className={classNames(
          "outline-none border-none p-1 w-full",
          inputClasses
        )}
      />
    </div>
  );
}
