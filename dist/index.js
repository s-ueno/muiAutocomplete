"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.Lazy = void 0;
const react_1 = __importStar(require("react"));
const lab_1 = require("@material-ui/lab");
const Search_1 = __importDefault(require("@material-ui/icons/Search"));
const uuid_1 = require("uuid");
const use_async_effect_1 = __importDefault(require("use-async-effect"));
const jsonp_1 = __importDefault(require("jsonp"));
/** css in js(ts)  */
const clsx_1 = __importDefault(require("clsx"));
const core_1 = require("@material-ui/core");
const cssInCode = core_1.makeStyles((theme) => ({
    search: {
        position: 'relative',
        marginLeft: 0,
    },
}));
var setTimeoutHandle = {};
function Lazy(action, msec) {
    const key = action.toString();
    clearTimeout(setTimeoutHandle[key]);
    return new Promise((resolve, reject) => {
        setTimeoutHandle[key] = setTimeout(() => {
            resolve(action());
        }, msec);
    });
}
exports.Lazy = Lazy;
function MuiAutocomplete(props) {
    var _a, _b, _c;
    //const baseProps = props;
    const { startAdornment, endAdornment, textFieldClassName, width, widthWhenFocused, variant, placeholder, suggestSource, suggestDelaymsec, onInputDoneDelaymsec, onInputDone, onInputChange, options } = props, baseProps = __rest(props, ["startAdornment", "endAdornment", "textFieldClassName", "width", "widthWhenFocused", "variant", "placeholder", "suggestSource", "suggestDelaymsec", "onInputDoneDelaymsec", "onInputDone", "onInputChange", "options"]);
    const classes = cssInCode();
    const [open, setOpen] = react_1.useState(false);
    const [defaultOptions, setDefaultOptions] = react_1.useState([]);
    const loading = open && ((options !== null && options !== void 0 ? options : []).length === 0);
    const dynamicCssInCode = core_1.makeStyles((theme) => ({
        inputInput: {
            width: props === null || props === void 0 ? void 0 : props.width,
            transition: theme.transitions.create('width'),
            '&.Mui-focused': {
                width: props === null || props === void 0 ? void 0 : props.widthWhenFocused,
            },
        },
    }));
    const dynamicClasses = dynamicCssInCode();
    use_async_effect_1.default(() => __awaiter(this, void 0, void 0, function* () {
        if (!suggestSource || suggestSource === "Amazon" || suggestSource === "Google") {
            const q = String(baseProps.value);
            if (!q || q === "" || q === undefined) {
                setDefaultOptions([]);
                return;
            }
            const enq = encodeURI(String(baseProps.value));
            if (!suggestSource || suggestSource === "Google") {
                yield Lazy(() => __awaiter(this, void 0, void 0, function* () {
                    jsonp_1.default(`https://www.google.com/complete/search?q=${enq}&client=firefox`, (error, data) => {
                        setDefaultOptions(data[1]);
                    });
                }), suggestDelaymsec !== null && suggestDelaymsec !== void 0 ? suggestDelaymsec : 500);
            }
            else if (suggestSource === "Amazon") {
                yield Lazy(() => __awaiter(this, void 0, void 0, function* () {
                    jsonp_1.default(`https://completion.amazon.co.jp/search/complete?mkt=6&method=completion&search-alias=aps&q=${enq}`, (error, data) => {
                        setDefaultOptions(data[1]);
                    });
                }), suggestDelaymsec !== null && suggestDelaymsec !== void 0 ? suggestDelaymsec : 500);
            }
        }
    }), () => {
    }, [baseProps.value]);
    function onLocalInputChanged(event, value, reason) {
        if (onInputChange) {
            onInputChange(event, value, reason);
        }
        if (onInputDone) {
            Lazy(() => {
                onInputDone(event, value, reason);
            }, onInputDoneDelaymsec !== null && onInputDoneDelaymsec !== void 0 ? onInputDoneDelaymsec : 500);
        }
    }
    return (react_1.default.createElement(lab_1.Autocomplete, Object.assign({}, baseProps, { options: options !== null && options !== void 0 ? options : defaultOptions, autoComplete: (_a = baseProps === null || baseProps === void 0 ? void 0 : baseProps.autoComplete) !== null && _a !== void 0 ? _a : true, open: open, onOpen: () => {
            setOpen(true);
        }, onClose: () => {
            setOpen(false);
        }, id: (_b = baseProps === null || baseProps === void 0 ? void 0 : baseProps.id) !== null && _b !== void 0 ? _b : `ac-${uuid_1.v4()}`, freeSolo: (_c = baseProps === null || baseProps === void 0 ? void 0 : baseProps.freeSolo) !== null && _c !== void 0 ? _c : true, className: clsx_1.default(classes.search, dynamicClasses.inputInput, baseProps === null || baseProps === void 0 ? void 0 : baseProps.className), loading: loading, onInputChange: onLocalInputChanged, renderInput: (params) => {
            var _a, _b, _c, _d;
            return (react_1.default.createElement(core_1.TextField, Object.assign({}, params, { variant: (_a = props === null || props === void 0 ? void 0 : props.variant) !== null && _a !== void 0 ? _a : "standard", className: clsx_1.default(props === null || props === void 0 ? void 0 : props.textFieldClassName), InputProps: Object.assign(Object.assign({}, params.InputProps), { style: {
                        paddingRight: 30,
                    }, placeholder: (_b = props === null || props === void 0 ? void 0 : props.placeholder) !== null && _b !== void 0 ? _b : "Search…", startAdornment: ((_c = props === null || props === void 0 ? void 0 : props.startAdornment) !== null && _c !== void 0 ? _c : react_1.default.createElement(Search_1.default, null)), endAdornment: (react_1.default.createElement(react_1.Fragment, null,
                        loading ? ((_d = props === null || props === void 0 ? void 0 : props.endAdornment) !== null && _d !== void 0 ? _d : react_1.default.createElement(core_1.CircularProgress, { color: "inherit", size: 20 })) : null,
                        params.InputProps.endAdornment)) }) })));
        } })));
}
;
exports.default = MuiAutocomplete;
