"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Spinner = (props) => {
    const { isVisible } = props;
    return react_1.default.createElement("div", { id: "Spinner", className: `${isVisible ? 'd-show' : 'd-hide'}` });
};
exports.default = Spinner;
//# sourceMappingURL=index.js.map