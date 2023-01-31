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
const Spinner_1 = __importDefault(require("../componets/Spinner"));
const ChartSynchronizedArea_1 = __importDefault(require("../componets/ChartSynchronizedArea"));
const Price_1 = __importDefault(require("../componets/Card/Price"));
const truncateEndString = (str, chars) => {
    if ((!str && str.length <= 0) || (!chars && typeof chars !== 'number')) {
        return '';
    }
    return str.substring(0, str.length - chars);
};
const getEndString = (str, chars) => {
    if ((!str && str.length <= 0) || (!chars && typeof chars !== 'number')) {
        return '';
    }
    return str.substring(str.length - chars, str.length);
};
const Monitoring = (props) => {
    var _a, _b, _c, _d;
    const { containers, price } = props;
    const [loadingChart, setLoadingChart] = react_1.useState(true);
    const [loadingPrice, setLoadingPrice] = react_1.useState(true);
    const [containersData, setContainersData] = react_1.useState();
    const [priceData, setPriceData] = react_1.useState();
    react_1.useEffect(() => {
        setLoadingChart(false);
        containers && (containers === null || containers === void 0 ? void 0 : containers.map((container) => {
            setContainersData((prev) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (!prev) {
                    return [
                        {
                            name: container === null || container === void 0 ? void 0 : container.name,
                            series: {
                                cpu: [
                                    parseInt(truncateEndString((_a = container === null || container === void 0 ? void 0 : container.usage) === null || _a === void 0 ? void 0 : _a.cpu, 1)) /
                                        1000,
                                ],
                                memory: [
                                    parseInt(truncateEndString((_b = container === null || container === void 0 ? void 0 : container.usage) === null || _b === void 0 ? void 0 : _b.memory, 2)),
                                ],
                            },
                            units: {
                                cpu: getEndString((_c = container === null || container === void 0 ? void 0 : container.usage) === null || _c === void 0 ? void 0 : _c.cpu, 1),
                                memory: getEndString((_d = container === null || container === void 0 ? void 0 : container.usage) === null || _d === void 0 ? void 0 : _d.memory, 2),
                            },
                        },
                    ];
                }
                else {
                    const containerNames = prev.map((i) => i.name);
                    if (containerNames.indexOf(container === null || container === void 0 ? void 0 : container.name) === -1) {
                        const newContainer = {
                            name: container === null || container === void 0 ? void 0 : container.name,
                            series: {
                                cpu: [
                                    parseInt(truncateEndString((_e = container === null || container === void 0 ? void 0 : container.usage) === null || _e === void 0 ? void 0 : _e.cpu, 1)) /
                                        1000,
                                ],
                                memory: [
                                    parseInt(truncateEndString((_f = container === null || container === void 0 ? void 0 : container.usage) === null || _f === void 0 ? void 0 : _f.memory, 2)),
                                ],
                            },
                            units: {
                                cpu: getEndString((_g = container === null || container === void 0 ? void 0 : container.usage) === null || _g === void 0 ? void 0 : _g.cpu, 1),
                                memory: getEndString((_h = container === null || container === void 0 ? void 0 : container.usage) === null || _h === void 0 ? void 0 : _h.memory, 2),
                            },
                        };
                        return [...prev, newContainer];
                    }
                    else {
                        return prev === null || prev === void 0 ? void 0 : prev.map((item) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            if ((item === null || item === void 0 ? void 0 : item.name) === (container === null || container === void 0 ? void 0 : container.name)) {
                                // Set array length to 6 elemt max
                                ((_b = (_a = item === null || item === void 0 ? void 0 : item.series) === null || _a === void 0 ? void 0 : _a.cpu) === null || _b === void 0 ? void 0 : _b.length) >= 6 && ((_c = item === null || item === void 0 ? void 0 : item.series) === null || _c === void 0 ? void 0 : _c.cpu.shift());
                                ((_e = (_d = item === null || item === void 0 ? void 0 : item.series) === null || _d === void 0 ? void 0 : _d.memory) === null || _e === void 0 ? void 0 : _e.length) >= 6 && ((_f = item === null || item === void 0 ? void 0 : item.series) === null || _f === void 0 ? void 0 : _f.memory.shift());
                                // Add to prev item new data
                                const editedItem = {
                                    name: container === null || container === void 0 ? void 0 : container.name,
                                    series: {
                                        cpu: [
                                            ...item.series.cpu,
                                            parseInt(truncateEndString((_g = container === null || container === void 0 ? void 0 : container.usage) === null || _g === void 0 ? void 0 : _g.cpu, 1)) /
                                                1000,
                                        ],
                                        memory: [
                                            ...item.series.memory,
                                            parseInt(truncateEndString((_h = container === null || container === void 0 ? void 0 : container.usage) === null || _h === void 0 ? void 0 : _h.memory, 2)),
                                        ],
                                    },
                                    units: {
                                        cpu: getEndString((_j = container === null || container === void 0 ? void 0 : container.usage) === null || _j === void 0 ? void 0 : _j.cpu, 1),
                                        memory: getEndString((_k = container === null || container === void 0 ? void 0 : container.usage) === null || _k === void 0 ? void 0 : _k.memory, 2),
                                    },
                                };
                                return editedItem;
                            }
                            return item;
                        });
                    }
                }
            });
        }));
    }, [containers]);
    react_1.useEffect(() => {
        setLoadingPrice(false);
        setPriceData(price);
    }, [price]);
    return !loadingChart && !loadingPrice ? (react_1.default.createElement("div", { id: "SmartCLIDE-Widget-Monitorig", className: "text-center" },
        !loadingChart ? (containersData && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ChartSynchronizedArea_1.default, { data: containersData }),
            react_1.default.createElement("hr", null)))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loadingChart })),
        !loadingPrice ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h4", null, "Costs"),
            react_1.default.createElement("div", { id: "WrapperPrice", className: "d-flex mt-1" },
                priceData && (priceData === null || priceData === void 0 ? void 0 : priceData.current_provider) && (react_1.default.createElement(Price_1.default, { price: (_a = priceData === null || priceData === void 0 ? void 0 : priceData.current_provider) === null || _a === void 0 ? void 0 : _a.price, cost_type: (_b = priceData === null || priceData === void 0 ? void 0 : priceData.current_provider) === null || _b === void 0 ? void 0 : _b.cost_type, name: (_c = priceData === null || priceData === void 0 ? void 0 : priceData.current_provider) === null || _c === void 0 ? void 0 : _c.name, current: true })),
                priceData && (priceData === null || priceData === void 0 ? void 0 : priceData.competitor_provider) && ((_d = priceData === null || priceData === void 0 ? void 0 : priceData.competitor_provider) === null || _d === void 0 ? void 0 : _d.map((data, index) => {
                    const { price, cost_type, name } = data;
                    return (react_1.default.createElement(Price_1.default, { key: index, price: price, cost_type: cost_type, name: name, current: false }));
                }))))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loadingPrice })))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loadingChart && loadingPrice }));
};
exports.default = Monitoring;
//# sourceMappingURL=Monitoring.js.map