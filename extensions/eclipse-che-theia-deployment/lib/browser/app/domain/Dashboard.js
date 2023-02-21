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
const BackendContext_1 = require("../contexts/BackendContext");
const fetchMethods_1 = require("../../../common/fetchMethods");
const Spinner_1 = __importDefault(require("../componets/Spinner"));
const Pagination_1 = __importDefault(require("../componets/Pagination/"));
const Button_1 = __importDefault(require("../componets/Button"));
const TableWidhtAction_1 = __importDefault(require("../componets/Table/TableWidhtAction"));
const Monitoring_1 = __importDefault(require("./Monitoring"));
const initialPagination = {
    skip: 0,
    limit: 25,
    total: 0,
};
const Dashboard = () => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [loadingMetrics, setLoadingMetrics] = (0, react_1.useState)(false);
    const [settings, setSettings] = (0, react_1.useState)();
    const [message, setMessage] = (0, react_1.useState)('');
    const [currentDeployment, setCurrentDeployment] = (0, react_1.useState)('');
    const [metrics, setMetrics] = (0, react_1.useState)();
    const [deploymentsSource, setDeploymentsSource] = (0, react_1.useState)([]);
    const [columnsSource, setColumnsSource] = (0, react_1.useState)([]);
    const [pagination, setPagination] = (0, react_1.useState)(initialPagination);
    const { backend } = (0, BackendContext_1.useBackendContext)();
    const { workspaceService, backendService } = backend;
    (0, react_1.useEffect)(() => {
        return () => {
            setLoading(true);
            setLoadingMetrics(false);
            setDeploymentsSource([]);
            setMetrics(null);
            setCurrentDeployment('');
        };
    }, []);
    (0, react_1.useEffect)(() => {
        var _a;
        if (backendService !== undefined && workspaceService !== undefined) {
            const currentPath = ((_a = workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.path.toString()) || '';
            !currentPath &&
                setMessage('It is necessary to have at least one repository open.');
            if (currentPath) {
                backendService
                    .fileRead(`${currentPath}/.smartclide-settings.json`)
                    .then((backendRead) => {
                    !(backendRead === null || backendRead === void 0 ? void 0 : backendRead.errno)
                        ? setSettings(JSON.parse(backendRead))
                        : setMessage('It is necessary to have created a new deployment first.');
                });
            }
        }
    }, [backendService, workspaceService]);
    (0, react_1.useEffect)(() => {
        message.length !== 0 && setLoading(false);
    }, [message]);
    (0, react_1.useEffect)(() => {
        metrics && setLoadingMetrics(false);
    }, [metrics]);
    (0, react_1.useEffect)(() => {
        setLoading(true);
        if (settings !== undefined &&
            (pagination === null || pagination === void 0 ? void 0 : pagination.skip) !== null &&
            (pagination === null || pagination === void 0 ? void 0 : pagination.limit) !== null) {
            const { gitLabToken, repository_name, username, deployUrl, stateServiceID, stateKeycloakToken, } = settings;
            if (gitLabToken && repository_name && username) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                (async () => {
                    const deploymentFetchData = await (0, fetchMethods_1.getDeploymentList)(deployUrl, stateServiceID, stateKeycloakToken, username, repository_name, pagination === null || pagination === void 0 ? void 0 : pagination.limit.toString(), pagination === null || pagination === void 0 ? void 0 : pagination.skip.toString());
                    if (deploymentFetchData) {
                        if (deploymentFetchData.total === 0) {
                            setMessage('No deployments found.');
                        }
                        if (deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.message) {
                            setMessage(deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.message);
                            setDeploymentsSource([]);
                            setPagination((prev) => (Object.assign(Object.assign({}, prev), { total: 0 })));
                        }
                        else if ((deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.data) &&
                            (deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.total)) {
                            setMessage('');
                            setDeploymentsSource(deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.data);
                            setPagination((prev) => (Object.assign(Object.assign({}, prev), { total: (deploymentFetchData === null || deploymentFetchData === void 0 ? void 0 : deploymentFetchData.total) || 0 })));
                        }
                    }
                })();
            }
        }
    }, [pagination.skip, pagination.limit, settings]);
    (0, react_1.useEffect)(() => {
        deploymentsSource &&
            (deploymentsSource === null || deploymentsSource === void 0 ? void 0 : deploymentsSource.length) !== 0 &&
            setColumnsSource([
                'k8 url',
                'port',
                'replicas',
                'status',
                'created',
                'actions',
            ]);
    }, [deploymentsSource]);
    (0, react_1.useEffect)(() => {
        columnsSource && (columnsSource === null || columnsSource === void 0 ? void 0 : columnsSource.length) !== 0 && setLoading(false);
    }, [columnsSource]);
    (0, react_1.useEffect)(() => {
        let interval;
        if (currentDeployment.length !== 0) {
            getGetMetrics(currentDeployment)
                .then((response) => {
                if (response) {
                    setMetrics(response);
                    interval = setInterval(async () => {
                        const newMetrics = await getGetMetrics(currentDeployment);
                        newMetrics && setMetrics(newMetrics);
                    }, 10000);
                }
            })
                .catch(() => {
                setMessage('No metrics found.');
                return;
            });
        }
        return () => {
            setMetrics(null);
            clearInterval(interval);
        };
    }, [currentDeployment]);
    const getGetMetrics = async (id) => {
        if (!id || settings === undefined) {
            return null;
        }
        else {
            const { k8sToken, deployUrl, stateServiceID, stateKeycloakToken } = settings;
            if (!k8sToken && !deployUrl && !stateServiceID && !stateKeycloakToken) {
                return null;
            }
            const newMetric = await (0, fetchMethods_1.getDeploymentMetrics)(deployUrl, stateServiceID, stateKeycloakToken, id, k8sToken);
            return newMetric;
        }
    };
    const handleGetMetrics = async (id) => {
        setLoadingMetrics(true);
        setCurrentDeployment(id);
    };
    const handleGetCurrentDeployment = () => {
        setLoadingMetrics(true);
        const currentActive = deploymentsSource.filter((deployment) => {
            return deployment.status === 'active' && deployment.id;
        });
        currentActive.length !== 0 &&
            currentActive[0].id &&
            setCurrentDeployment(currentActive[0].id);
    };
    const handleStop = async (id) => {
        var _a, _b;
        const currentPath = ((_a = workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.resource.path.toString()) || '';
        const prevSettings = currentPath &&
            backendService &&
            JSON.parse(await backendService.fileRead(`${currentPath}/.smartclide-settings.json`));
        const { k8sToken, deployUrl, stateServiceID, stateKeycloakToken } = prevSettings;
        const deploymentDeleted = k8sToken &&
            deployUrl &&
            stateServiceID &&
            stateKeycloakToken &&
            (await (0, fetchMethods_1.deleteDeployment)(deployUrl, stateServiceID, stateKeycloakToken, id, k8sToken));
        if (deploymentDeleted) {
            const currentPath = ((_b = workspaceService.workspace) === null || _b === void 0 ? void 0 : _b.resource.path.toString()) || '';
            const prevSettings = currentPath &&
                backendService &&
                JSON.parse(await backendService.fileRead(`${currentPath}/.smartclide-settings.json`));
            const { gitLabToken, repository_name, username, deployUrl, stateServiceID, stateKeycloakToken, } = prevSettings;
            const deploymentFetchData = gitLabToken &&
                repository_name &&
                (await (0, fetchMethods_1.getDeploymentList)(deployUrl, stateServiceID, stateKeycloakToken, username, repository_name, pagination.limit.toString(), pagination.skip.toString()));
            if (deploymentFetchData) {
                if (deploymentFetchData.message) {
                    setDeploymentsSource([]);
                    setPagination((prev) => (Object.assign(Object.assign({}, prev), { total: 0 })));
                }
                else if (deploymentFetchData.data && deploymentFetchData.total) {
                    setDeploymentsSource(deploymentFetchData.data);
                    setPagination((prev) => (Object.assign(Object.assign({}, prev), { total: deploymentFetchData.total || 0 })));
                }
            }
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { id: "SmartCLIDE-Deployment-Bar" },
            react_1.default.createElement("h3", null, "Last Deployment"),
            message ? (react_1.default.createElement("h3", { style: { textAlign: 'center' } }, message)) : deploymentsSource.length !== 0 && !loadingMetrics ? (react_1.default.createElement(react_1.default.Fragment, null, !metrics && (react_1.default.createElement(Button_1.default, { className: "btn-primary small mr-xs", disabled: loadingMetrics, onClick: () => handleGetCurrentDeployment() }, "Get metrics")))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loadingMetrics })),
            react_1.default.createElement(react_1.default.Fragment, null, metrics && (react_1.default.createElement(Monitoring_1.default, { containers: metrics === null || metrics === void 0 ? void 0 : metrics.containers, price: metrics === null || metrics === void 0 ? void 0 : metrics.price })))),
        react_1.default.createElement("div", { id: "SmartCLIDE-Deployment-App" },
            react_1.default.createElement("h1", null, "Deployments"),
            !loading ? (message ? (react_1.default.createElement("h3", { style: { textAlign: 'center' } }, message)) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(TableWidhtAction_1.default, { columnsSource: columnsSource, dataSource: deploymentsSource, actionEdit: handleGetMetrics, actionStop: handleStop, loading: loadingMetrics }),
                react_1.default.createElement(Pagination_1.default, { limit: pagination.limit, skip: pagination.skip, total: pagination.total, setState: setPagination }),
                metrics && (react_1.default.createElement(Monitoring_1.default, { containers: metrics === null || metrics === void 0 ? void 0 : metrics.containers, price: metrics === null || metrics === void 0 ? void 0 : metrics.price }))))) : (react_1.default.createElement(Spinner_1.default, { isVisible: loading })))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map