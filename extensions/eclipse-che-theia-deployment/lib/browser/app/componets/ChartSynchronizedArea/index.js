"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const recharts_1 = require("recharts");
const ChartSynchronizedArea = ({ data, }) => {
    return data ? (react_1.default.createElement("div", { className: "d-flex space-bettwen center mt-1" }, data.map((container, index) => {
        const serie = container.series.cpu.map((value, index) => {
            return { cpu: value, memory: container.series.memory[index] };
        });
        return (react_1.default.createElement("div", { key: `${index}-asdasd`, className: "w-100 pr-2" },
            react_1.default.createElement("h4", null, container.name),
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: '100%', height: 200 },
                react_1.default.createElement(recharts_1.AreaChart, { width: 600, height: 200, data: serie, syncId: "anyId", margin: {
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                    react_1.default.createElement(recharts_1.XAxis, null),
                    react_1.default.createElement(recharts_1.YAxis, { type: "number" }),
                    react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                            backgroundColor: '#333333',
                            color: '#ccccc',
                        }, label: true, labelFormatter: () => '' }),
                    react_1.default.createElement(recharts_1.Area, { isAnimationActive: true, type: "monotone", dataKey: "memory", stroke: "#d8848c", fill: "#d8848c", unit: "Ki" }),
                    react_1.default.createElement(recharts_1.Area, { isAnimationActive: true, type: "monotone", dataKey: "cpu", unit: "kn", stroke: "#8884d8", fill: "#8884d8" })))));
    }))) : (react_1.default.createElement("p", null, "Non data provive"));
};
exports.default = ChartSynchronizedArea;
//# sourceMappingURL=index.js.map