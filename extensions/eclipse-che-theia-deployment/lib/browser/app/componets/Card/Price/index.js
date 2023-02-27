"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const PriceCard = (props) => {
    const { price, cost_type, name, current } = props;
    return (react_1.default.createElement("div", { id: "Price", className: current ? 'current' : '' },
        react_1.default.createElement("h3", null, name),
        react_1.default.createElement("h4", null,
            react_1.default.createElement("span", { className: "currency" }, "$"),
            price.toFixed(5),
            react_1.default.createElement("br", null),
            react_1.default.createElement("span", null, cost_type))));
};
exports.default = PriceCard;
//# sourceMappingURL=index.js.map