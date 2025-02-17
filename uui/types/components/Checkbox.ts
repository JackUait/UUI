import { ICanBeInvalid, ICanBeReadonly, ICheckable, IHasCX, IHasLabel, IAnalyticableOnChange, IHasRawProps } from "../props";

export interface CheckboxCoreProps extends ICheckable, IHasCX, ICanBeInvalid, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLLabelElement> {}