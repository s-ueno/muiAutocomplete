import React, { useState, Fragment } from "react";
import { Autocomplete, AutocompleteProps, AutocompleteInputChangeReason } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import { v4 as uuidv4 } from 'uuid';
import useAsyncEffect from "use-async-effect";
import jsonp from "jsonp";

/** css in js(ts)  */
import clsx from "clsx";
import {
    makeStyles,
    CircularProgress,
    TextField
} from '@material-ui/core';

const cssInCode = makeStyles((theme) => ({
    search: {
        position: 'relative',
        marginLeft: 0,
    },
}));

var setTimeoutHandle: { [key: string]: any } = {};
export function Lazy(action: Function, msec: number) {
    const key = action.toString();
    clearTimeout(setTimeoutHandle[key]);
    return new Promise((resolve, reject) => {
        setTimeoutHandle[key] = setTimeout(() => {
            resolve(action());
        }, msec);
    });
}

export interface MuiAutocompleteProps<T> extends
    Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>,
    "renderInput" | "options" | "open" | "onOpen" | "onClose" | "loading" | "onInputChange"> {

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

function MuiAutocomplete<T>(props: MuiAutocompleteProps<T>) {
    //const baseProps = props;
    const {
        startAdornment,
        endAdornment,
        textFieldClassName,
        width,
        widthWhenFocused,
        variant,
        placeholder,
        suggestSource,
        suggestDelaymsec,
        onInputDoneDelaymsec,
        onInputDone,
        onInputChange,
        options,
        ...baseProps
    } = props;

    const classes = cssInCode();
    const [open, setOpen] = useState(false);
    const [defaultOptions, setDefaultOptions] = useState([]);

    const loading = open && ((options ?? []).length === 0);
    const dynamicCssInCode = makeStyles((theme) => ({
        inputInput: {
            width: props?.width,
            transition: theme.transitions.create('width'),
            '&.Mui-focused': {
                width: props?.widthWhenFocused,
            },
        },
    }));
    const dynamicClasses = dynamicCssInCode();

    useAsyncEffect(async () => {

        if (!suggestSource || suggestSource === "Amazon" || suggestSource === "Google") {
            const q: string = String(baseProps.value);
            if (!q || q === "" || q === undefined) {
                setDefaultOptions([]);
                return;
            }

            const enq = encodeURI(String(baseProps.value));
            if (!suggestSource || suggestSource === "Google") {
                await Lazy(async () => {
                    jsonp(`https://www.google.com/complete/search?q=${enq}&client=firefox`, (error, data) => {
                        setDefaultOptions(data[1]);
                    });
                }, suggestDelaymsec ?? 500);
            } else if (suggestSource === "Amazon") {
                await Lazy(async () => {
                    jsonp(`https://completion.amazon.co.jp/search/complete?mkt=6&method=completion&search-alias=aps&q=${enq}`, (error, data) => {
                        setDefaultOptions(data[1]);
                    });
                }, suggestDelaymsec ?? 500);
            }
        }
    }, () => {

    }, [baseProps.value]);

    function onLocalInputChanged(event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) {
        if (onInputChange) {
            onInputChange(event, value, reason);
        }
        if (onInputDone) {
            Lazy(() => {
                onInputDone(event, value, reason);
            }, onInputDoneDelaymsec ?? 500);
        }
    }

    return (
        <Autocomplete
            {...baseProps}

            options={options ?? defaultOptions}
            autoComplete={baseProps?.autoComplete ?? true}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            id={baseProps?.id ?? `ac-${uuidv4()}`}
            freeSolo={baseProps?.freeSolo ?? true}
            className={clsx(classes.search, dynamicClasses.inputInput, baseProps?.className)}
            loading={loading}
            onInputChange={onLocalInputChanged}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={props?.variant ?? "standard"}
                    className={clsx(props?.textFieldClassName)}
                    InputProps={{
                        ...params.InputProps,
                        style: {
                            paddingRight: 30,
                        },
                        placeholder: props?.placeholder ?? "Search…",
                        startAdornment: (
                            props?.startAdornment ?? <SearchIcon />
                        ),
                        endAdornment: (
                            <Fragment>
                                {loading ? (props?.endAdornment ?? <CircularProgress color="inherit" size={20} />) : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};
export default MuiAutocomplete;
