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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("../Button"));
const Pagination = ({ skip, total, limit, setState, }) => {
    const [currentLimit, setCurrentLimit] = react_1.useState(0);
    const [currentSkip, setCurrentSkip] = react_1.useState(0);
    const [currentTotal, setCurrentTotal] = react_1.useState(0);
    react_1.useEffect(() => {
        setCurrentLimit(limit);
        setCurrentSkip(skip);
        setCurrentTotal(total);
    }, [skip, total, limit]);
    const handlePrev = () => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { skip: prev.skip - prev.limit })));
    };
    const handleNext = () => {
        setState((prev) => (Object.assign(Object.assign({}, prev), { skip: prev.limit + prev.skip })));
    };
    return (react_1.default.createElement("div", { className: "d-flex space-bettwen center pagination p-xs" },
        react_1.default.createElement("div", { className: "d-flex space-bettwen center" },
            react_1.default.createElement(Button_1.default, { className: "btn small", onClick: () => handlePrev(), disabled: currentSkip <= 0 || currentLimit >= currentTotal }, '<'),
            react_1.default.createElement(Button_1.default, { className: "btn small", onClick: () => handleNext(), disabled: currentSkip >= currentTotal - currentLimit ||
                    currentLimit + currentSkip >= currentTotal }, '>'),
            react_1.default.createElement("p", { style: { paddingLeft: '10px' } },
                "Total: ",
                currentTotal)),
        currentLimit > 25 && (react_1.default.createElement("div", { className: "d-flex space-bettwen center" },
            react_1.default.createElement("p", { style: { paddingRight: '10px' } }, "Limit: "),
            react_1.default.createElement("select", { className: "select", defaultValue: currentLimit, onChange: (e) => {
                    e.target.value &&
                        setState((prev) => (Object.assign(Object.assign({}, prev), { limit: parseInt(e.target.value) })));
                } },
                react_1.default.createElement("option", { value: "25" }, "25"),
                currentLimit > 50 && react_1.default.createElement("option", { value: "50" }, "50"),
                currentLimit > 100 && react_1.default.createElement("option", { value: "100" }, "100"))))));
};
exports.default = Pagination;
//# sourceMappingURL=index.js.map