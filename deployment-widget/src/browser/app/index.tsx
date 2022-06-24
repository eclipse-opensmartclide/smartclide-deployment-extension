/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import React, { useState, useEffect } from 'react';

import Dashboard from './domain/Dashboard';

// import Monitoring from './domain/Monitoring';
import Spinner from './componets/Spinner';

import { useBackendContext } from './contexts/BackendContext';

interface AppProps {
  commandRegistry?: any;
  workspaceService?: any;
  backendService?: any;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  const { workspaceService, backendService, commandRegistry } = props;

  const [loading, setLoading] = useState<boolean>(true);

  const { backend, setBackend } = useBackendContext();

  useEffect(() => {
    setBackend({
      workspaceService,
      commandRegistry,
      backendService,
    });
  }, []);

  useEffect(() => {
    backend && setLoading(false);
  }, [backend]);

  return !loading ? (
    <>
      <div id="SmartCLIDE-Widget-Bar">{/* <Monitoring /> */}</div>
      <div id="SmartCLIDE-Widget-App">
        <Dashboard />
      </div>
    </>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default App;
