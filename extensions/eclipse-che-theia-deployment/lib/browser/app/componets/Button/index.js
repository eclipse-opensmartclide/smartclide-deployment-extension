"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button = (props) => {
    const { className, onClick, children, disabled } = props;
    return (react_1.default.createElement("button", { className: `btn ${className}`, onClick: onClick, disabled: disabled }, children));
};
exports.default = Button;
//# sourceMappingURL=index.js.map