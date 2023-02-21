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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const Dashboard_1 = __importDefault(require("./domain/Dashboard"));
const Spinner_1 = __importDefault(require("./componets/Spinner"));
const BackendContext_1 = require("./contexts/BackendContext");
const App = (props) => {
    const { workspaceService, backendService, commandRegistry } = props;
    const [loading, setLoading] = (0, react_1.useState)(true);
    const { backend, setBackend } = (0, BackendContext_1.useBackendContext)();
    (0, react_1.useEffect)(() => {
        setBackend({
            workspaceService,
            commandRegistry,
            backendService,
        });
    }, []);
    (0, react_1.useEffect)(() => {
        backend && setLoading(false);
    }, [backend]);
    return !loading ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Dashboard_1.default, null))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loading }));
};
exports.default = App;
//# sourceMappingURL=index.js.map