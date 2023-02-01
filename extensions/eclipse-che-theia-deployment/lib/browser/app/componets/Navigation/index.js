"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("../Button"));
const Navigation = (props) => {
    const { currentView, setCurrentView, viewList } = props;
    return (react_1.default.createElement("div", { className: "Navigation--flex" }, viewList === null || viewList === void 0 ? void 0 : viewList.map((view, idx) => (react_1.default.createElement(react_1.default.Fragment, { key: idx },
        react_1.default.createElement(Button_1.default, { className: currentView === view.value ? 'btn-primary active' : '', onClick: () => setCurrentView(view.value) }, view.name))))));
};
exports.default = Navigation;
//# sourceMappingURL=index.js.map