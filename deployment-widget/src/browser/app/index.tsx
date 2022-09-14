/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'

import Dashboard from './domain/Dashboard'

import Spinner from './componets/Spinner'

import { useBackendContext } from './contexts/BackendContext'

interface AppProps {
  commandRegistry?: any
  workspaceService?: any
  backendService?: any
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  const { workspaceService, backendService, commandRegistry } = props

  const [loading, setLoading] = useState<boolean>(true)

  const { backend, setBackend } = useBackendContext()

  useEffect(() => {
    setBackend({
      workspaceService,
      commandRegistry,
      backendService,
    })
  }, [])

  useEffect(() => {
    backend && setLoading(false)
  }, [backend])

  return !loading ? (
    <>
      <Dashboard />
    </>
  ) : (
    <Spinner isVisible={loading} />
  )
}

export default App
