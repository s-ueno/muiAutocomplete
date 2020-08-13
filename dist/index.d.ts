import React from "react";
import { AutocompleteProps, AutocompleteInputChangeReason } from '@material-ui/lab';
export declare function Lazy(action: Function, msec: number): Promise<unknown>;
export interface MuiAutocompleteProps<T> extends Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput" | "options" | "open" | "onOpen" | "onClose" | "loading" | "onInputChange"> {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    textFieldClassName?: string;
    width?: string;
    widthWhenFocused?: string;
    variant?: "standard" | "filled" | "outlined";
    placeholder?: string;
    suggestSource?: "Google" | "Amazon" | "Manual";
    suggestDelaymsec?: number;
    onInputDoneDelaymsec?: number;
    onInputDone?: (event: React.ChangeEvent<{}>, value: string, reason?: AutocompleteInputChangeReason) => void;
    onInputChange?: (event: React.ChangeEvent<{}>, value: string, reason?: AutocompleteInputChangeReason) => void;
    options?: T[];
}
declare function MuiAutocomplete<T>(props: MuiAutocompleteProps<T>): JSX.Element;
export default MuiAutocomplete;
