import React from "react";
import { AutocompleteInputChangeReason, AutocompleteProps } from "@mui/material";
interface MuiAutocompleteProps<T> extends Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput" | "options" | "open" | "onOpen" | "onClose" | "loading" | "onInputChange"> {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    textFieldClassName?: string;
    width?: string;
    widthWhenFocused?: string;
    variant?: "standard" | "filled" | "outlined";
    placeholder?: string;
    suggestSource?: "Google" | "Amazon" | "YOUTUBE" | "YAHOO" | "Manual";
    suggestDelaymsec?: number;
    onInputDoneDelaymsec?: number;
    onInputDone?: (event: React.ChangeEvent<{}>, value: string, reason?: AutocompleteInputChangeReason) => void;
    onInputChange?: (event: React.ChangeEvent<{}>, value: string, reason?: AutocompleteInputChangeReason) => void;
    options?: T[];
}
declare function MuiAutocomplete<T>(props: MuiAutocompleteProps<T>): JSX.Element;
export default MuiAutocomplete;
