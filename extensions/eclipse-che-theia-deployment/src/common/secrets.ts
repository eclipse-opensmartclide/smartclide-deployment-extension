export const mockSettings = {
  deployUrl: 'http://10.128.27.31:3001',
  user: 'pberrocal',
  gitRepoUrl: 'https://gitlab.dev.smartclide.eu/pberrocal/test-kubernetes',
  project: 'test-kubernetes',
  k8sUrl: 'https://smartclide-dns-99f66729.hcp.northeurope.azmk8s.io:443',
  hostname: 'test-smartclide.eu',
  branch: 'main',
  replicas: 1,
  deploymentPort: 8080,
  k8sToken:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6InEtZVZFWGNiMXFESnIxSVlKQThXTTVNUUxrRFV5YnhXTUp4ZXltTTBuYm8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrOHNhZG1pbi10b2tlbi16Y3dkOSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrOHNhZG1pbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjIxYzc3MzM2LTM2MDktNGFmYy1hNWNiLTFlYTUzZmZkZGRmYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTprOHNhZG1pbiJ9.T_NnTPF_ETYQfD_Ii_UlQXboaZkAXryan1_feGuC_Qinymf8iI54oEldYyV4pT3BDkeNn-5Gm-TTk1eXCDk1NQLD9538uAGfsfq1lsXaY5L2vtTZphD3-nrwRgqEKrJDt8nd84yePTrjrps7ul_XCrZ4mCDlcjLTzPb1Lycp5nrOpsHzSBIx5HZVbfqgh5z3dKDSkT1W65JaCBI36y7NME-OYbcdG2DR4pTU6CTNUKVjT5IyAOboXJBc2bdAtQzu_qQlxYflcXuLyu5URcGI0U4zHB__BqhlteUCJhJRvBqzwfTQyEa6a7MBgPV3k5GM9J5q7mLNClMh7AziwdhlDEnZcd5dd50nBA2WON8XzoPjxQfmIZC_MHqtgVs00spk137Ngg0CnIM9NxzlYiHXmgP4kDr_BfpJ0EYiCIXvbX93xQLxbvOHOLulghyYqgguo9Ixw3UA5rmAbUCrBsVuO9uW5eo79n9mzqBjEQ-G5E7FN_8iBNL85L6FuhQyLvtEyA2JPY-okhP22SmStBipwXoInS8TOL8Jf460eKFqHN8aqd_Ei8c5Gn5FksAQ9RKapM307lg84GtQ57bx5Rag-W9Vgm1Mvu2MWyT4fvOwcsYtrkcXZGGODHvIXl1o-fXmeWqSuOrZqKOa1H-tcq7Ue_LXifBy3CvusPCYxV7gqgo',
  gitLabToken: 'oEFB82mtzww5S7-JA2n9',
  lastDeploy: '',
};

// kubernetes.docker.internal
// https://127.0.0.1:54511

// export const mockSettingsPedro = {
//   user: 'pberrocal',
//   gitRepoUrl: 'https://gitlab.dev.smartclide.eu/pberrocal/test-kubernetes',
//   project: 'test-kubernetes',
//   k8sUrl: 'https://192.168.39.96:8443',
//   hostname: 'test-smartclide.eu',
//   branch: 'master',
//   replicas: 1,
//   deploymentPort: 8080,
//   k8sToken:
//     'eyJhbGciOiJSUzI1NiIsImtpZCI6InYtLU5OSjhxMm5tUF9xd2JfOVo3Tm9aa3ktNTlEVXRLeG83d0FhWENHTkUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrOHNhZG1pbi10b2tlbi0yd2JiNiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrOHNhZG1pbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ5NmJkMTI5LTMyMjEtNDczMy05NjM5LWRhNTA2ZmMyM2EwNCIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTprOHNhZG1pbiJ9.Y9jvzFYEaMEoXgwUqS9PLpiHdXiQ1hocaSs7T1r_P4xmSDwp1jYMZXM4PQR2oCpSP8uJnsndRVFPlRrlPKWF4-5A6R7vVlb5CI_0368bp0X-laR4vSv55CL2xit9fma9srfgz7HjLh7hF-fF6lFDWLKsljSeDtXzy59OllPfcaKanRAI4cosc7dqKFB7z_UWMvWaRXU7L_j9pyWyF83hjcoD_47a8EEXZWV3-vYxNng-RGHNn7MY4TcRjimErzrgkZWRhSNBPFKKBu_m15l9QFcefZlOo3yyxFuWecQ-OFRhte1tMtLYS8Ih44qvAYylK6mz9vasejr3CfpoyvVd2Q',
//   gitLabToken: 'oEFB82mtzww5S7-JA2n9',
// };
