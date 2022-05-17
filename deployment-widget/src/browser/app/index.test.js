import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { BackendContext, useBackendContext, BackendContextProvider } from './contexts/BackendContext';

import App from './index.tsx';

afterEach(cleanup);

const AppProps = {
  commandRegistry any;
  workspaceService?: any;
  backendService?: any;
}

describe('SmartCLIDE-Widget-Bar', () => {
  test('First child is a H2', () => {
    const { container } = render(<App props={..AppProps} />);
    expect(container.firstChild.nodeName).toBe('H2');
  });

});
// describe('SmartCLIDE-Widget-App', () => {
 
// });
