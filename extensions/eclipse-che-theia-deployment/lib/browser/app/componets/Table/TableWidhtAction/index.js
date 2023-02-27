"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("../../Button"));
const TableWidthAction = (props) => {
    const { columnsSource, dataSource, actionEdit, actionStop, loading } = props;
    return (react_1.default.createElement("div", { className: "table" },
        react_1.default.createElement("table", { className: "deployment-table" },
            react_1.default.createElement("thead", null, columnsSource && (columnsSource === null || columnsSource === void 0 ? void 0 : columnsSource.length) !== 0 && (react_1.default.createElement("tr", null, columnsSource.map((col, key) => (react_1.default.createElement("th", { key: key }, col)))))),
            react_1.default.createElement("tbody", null, dataSource && (dataSource === null || dataSource === void 0 ? void 0 : dataSource.length) > 0 ? (dataSource === null || dataSource === void 0 ? void 0 : dataSource.map((data, index) => {
                return (react_1.default.createElement("tr", { key: index },
                    react_1.default.createElement("td", null, data.k8s_url),
                    react_1.default.createElement("td", null, data.port),
                    react_1.default.createElement("td", null, data.replicas),
                    react_1.default.createElement("td", null, data.status),
                    react_1.default.createElement("td", null, new Date(data.created_at).toLocaleDateString()),
                    react_1.default.createElement("td", null, data.status === 'active' && (react_1.default.createElement(react_1.default.Fragment, null,
                        actionEdit && (react_1.default.createElement(Button_1.default, { className: "btn-primary small mr-xs", disabled: loading, onClick: () => actionEdit(data.id) }, "Metrics")),
                        actionStop && (react_1.default.createElement(Button_1.default, { className: "btn-danger small", disabled: loading, onClick: () => actionStop(data.id) }, "Stop")))))));
            })) : (react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { colSpan: (columnsSource === null || columnsSource === void 0 ? void 0 : columnsSource.length) !== 0 ? columnsSource === null || columnsSource === void 0 ? void 0 : columnsSource.length : 1 }, "No data")))))));
};
exports.default = TableWidthAction;
//# sourceMappingURL=index.js.map