"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeployment = exports.getDeploymentList = exports.getDeploymentMetrics = exports.getDeploymentStatus = exports.postDeploy = void 0;
const postDeploy = async (deployUrl, stateServiceID, stateKeycloakToken, username, gitRepoUrl, repository_name, k8s_url, branch, replicas, container_port, k8sToken, gitLabToken) => {
    return await fetch(`${deployUrl}/deployments?repository_name=${repository_name}&username=${username}&repository_url=${gitRepoUrl}&branch=${branch}&container_port=${container_port}&k8s_url=${k8s_url}&replicas=${replicas}&service_id=${stateServiceID}`, {
        method: 'POST',
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + stateKeycloakToken,
            'Content-Type': 'application/json',
            'gitlab-token': gitLabToken,
            'k8s-token': k8sToken,
        },
    })
        .then((res) => res.json().then((res) => res))
        .catch((err) => err);
};
exports.postDeploy = postDeploy;
const getDeploymentStatus = async (deployUrl, stateServiceID, stateKeycloakToken, id, k8sToken) => {
    return await fetch(`${deployUrl}/deployments/${id}&service_id=${stateServiceID}`, {
        method: 'GET',
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + stateKeycloakToken,
            'Content-Type': 'application/json',
            'k8s-token': k8sToken,
        },
    })
        .then((res) => res.json().then((res) => res))
        .catch((err) => err);
};
exports.getDeploymentStatus = getDeploymentStatus;
const getDeploymentMetrics = async (deployUrl, stateServiceID, stateKeycloakToken, id, k8sToken) => {
    return await fetch(`${deployUrl}/metrics/${id}&service_id=${stateServiceID}`, {
        method: 'GET',
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + stateKeycloakToken,
            'Content-Type': 'application/json',
            'k8s-token': k8sToken,
        },
    })
        .then((res) => res.json().then((res) => res))
        .catch((err) => err);
};
exports.getDeploymentMetrics = getDeploymentMetrics;
const getDeploymentList = async (deployUrl, stateServiceID, stateKeycloakToken, username, repository_name, limit, skip) => {
    return await fetch(`${deployUrl}/deployments/?user=${username}&project=${repository_name}&skip=${skip}&limit=${limit}&service_id=${stateServiceID}`, {
        method: 'GET',
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + stateKeycloakToken,
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json().then((res) => {
        var _a;
        if (res === null || res === void 0 ? void 0 : res.message) {
            return res;
        }
        const data = (res === null || res === void 0 ? void 0 : res.data) ? res === null || res === void 0 ? void 0 : res.data : [];
        const total = (res === null || res === void 0 ? void 0 : res.count)
            ? res === null || res === void 0 ? void 0 : res.count
            : (res === null || res === void 0 ? void 0 : res.data)
                ? (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.length
                : 0;
        return {
            data,
            total,
        };
    }))
        .catch((err) => err);
};
exports.getDeploymentList = getDeploymentList;
const deleteDeployment = async (deployUrl, stateServiceID, stateKeycloakToken, id, k8sToken) => {
    return await fetch(`${deployUrl}/deployments/${id}&service_id=${stateServiceID}`, {
        method: 'DELETE',
        headers: {
            Accept: '*/*',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + stateKeycloakToken,
            'Content-Type': 'application/json',
            'k8s-token': k8sToken,
        },
    })
        .then((res) => res.json().then((res) => res))
        .catch((err) => err);
};
exports.deleteDeployment = deleteDeployment;
//# sourceMappingURL=fetchMethods.js.map