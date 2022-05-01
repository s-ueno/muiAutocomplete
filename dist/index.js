"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const jsonp_1 = __importDefault(require("jsonp"));
const urls = {
    Google: "https://www.google.com/complete/search?client=firefox&q=",
    Amazon: "https://completion.amazon.co.jp/search/complete?mkt=6&method=completion&search-alias=aps&q=",
    YOUTUBE: "http://clients1.google.com/complete/search?client=firefox&q=",
    YAHOO: "http://ff.search.yahoo.com/gossip?output=json&command=",
};
function MuiAutocomplete(props) {
    var _a, _b, _c;
    const { startAdornment, endAdornment, textFieldClassName, width, widthWhenFocused, variant, placeholder, suggestSource, suggestDelaymsec, onInputDoneDelaymsec, onInputDone, onInputChange, options, sx } = props, baseProps = __rest(props, ["startAdornment", "endAdornment", "textFieldClassName", "width", "widthWhenFocused", "variant", "placeholder", "suggestSource", "suggestDelaymsec", "onInputDoneDelaymsec", "onInputDone", "onInputChange", "options", "sx"]);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [dynamicOptions, setDynamicOptions] = (0, react_1.useState)(options !== null && options !== void 0 ? options : new Array());
    const [loading, setLoading] = (0, react_1.useState)(false);
    const theme = (0, material_1.useTheme)();
    useEffectAsync(() => __awaiter(this, void 0, void 0, function* () {
        setOpen(false);
        if (!baseProps.value) {
            setDynamicOptions([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        if (!suggestSource || suggestSource !== "Manual") {
            const q = String(baseProps.value);
            if (!q || q === "" || q === undefined) {
                setDynamicOptions([]);
                return;
            }
            const enq = encodeURI(String(baseProps.value));
            const url = urls[suggestSource !== null && suggestSource !== void 0 ? suggestSource : "Google"];
            const arr = yield lazy(() => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    (0, jsonp_1.default)(`${url}${enq}`, (error, data) => {
                        resolve(data[1]);
                    });
                });
            }), suggestDelaymsec !== null && suggestDelaymsec !== void 0 ? suggestDelaymsec : 500);
            setDynamicOptions(arr);
        }
        setLoading(false);
        setOpen(true);
    }), [baseProps.value]);
    function onLocalInputChanged(event, value, reason) {
        if (onInputChange) {
            onInputChange(event, value, reason);
        }
        if (onInputDone) {
            lazy(() => {
                onInputDone(event, value, reason);
            }, onInputDoneDelaymsec !== null && onInputDoneDelaymsec !== void 0 ? onInputDoneDelaymsec : 500);
        }
    }
    return (react_1.default.createElement(material_1.Autocomplete, Object.assign({}, baseProps, { options: dynamicOptions, autoComplete: (_a = baseProps === null || baseProps === void 0 ? void 0 : baseProps.autoComplete) !== null && _a !== void 0 ? _a : true, open: open, onOpen: () => {
            if (!loading) {
                setOpen(true);
            }
        }, onClose: () => {
            setOpen(false);
        }, id: (_b = baseProps === null || baseProps === void 0 ? void 0 : baseProps.id) !== null && _b !== void 0 ? _b : `ac-${uuidv4()}`, freeSolo: (_c = baseProps === null || baseProps === void 0 ? void 0 : baseProps.freeSolo) !== null && _c !== void 0 ? _c : true, sx: Object.assign({ position: "relative", marginLeft: 0, width: props === null || props === void 0 ? void 0 : props.width, transition: theme.transitions.create("width"), "&.Mui-focused": {
                width: props === null || props === void 0 ? void 0 : props.widthWhenFocused,
            } }, sx), loading: loading, onInputChange: onLocalInputChanged, renderInput: (params) => {
            var _a, _b, _c, _d;
            return (react_1.default.createElement(material_1.TextField, Object.assign({}, params, { variant: (_a = props === null || props === void 0 ? void 0 : props.variant) !== null && _a !== void 0 ? _a : "standard", className: props === null || props === void 0 ? void 0 : props.textFieldClassName, InputProps: Object.assign(Object.assign({}, params.InputProps), { style: {
                        paddingRight: 30,
                    }, placeholder: (_b = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _b !== void 0 ? _b : "Search…", startAdornment: (_c = props === null || props === void 0 ? void 0 : props.startAdornment) !== null && _c !== void 0 ? _c : (react_1.default.createElement(material_1.SvgIcon, null,
                        react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24", viewBox: "0 0 24 24", width: "24" },
                            react_1.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
                            react_1.default.createElement("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" })))), endAdornment: (react_1.default.createElement(react_1.default.Fragment, null,
                        loading
                            ? (_d = props === null || props === void 0 ? void 0 : props.endAdornment) !== null && _d !== void 0 ? _d : (react_1.default.createElement(material_1.CircularProgress, { color: "inherit", size: 20 }))
                            : null,
                        params.InputProps.endAdornment)) }) })));
        } })));
}
exports.default = MuiAutocomplete;
function useEffectAsync(action, deps) {
    (0, react_1.useEffect)(() => {
        let unmount = false;
        let result;
        const asyncAction = () => __awaiter(this, void 0, void 0, function* () {
            if (unmount)
                return;
            try {
                result = yield action();
            }
            catch (e) {
                console.error(e);
            }
        });
        asyncAction();
        return () => {
            if (unmount)
                return;
            unmount = true;
            if (result instanceof Function) {
                try {
                    result();
                }
                catch (_a) { }
            }
        };
    }, deps);
}
var setTimeoutHandle = {};
function lazy(action, msec) {
    const key = action.toString();
    clearTimeout(setTimeoutHandle[key]);
    return new Promise((resolve, reject) => {
        setTimeoutHandle[key] = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            resolve(yield Promise.resolve(action()));
        }), msec);
    });
}
function uuidv4() {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}
