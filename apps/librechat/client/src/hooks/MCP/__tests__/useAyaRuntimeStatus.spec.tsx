import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useAyaRuntimeStatus } from '../useAyaRuntimeStatus';

const mockUseHasAccess = jest.fn();
const mockUseGetStartupConfig = jest.fn();
const mockUseMCPServersQuery = jest.fn();
const mockUseMCPToolsQuery = jest.fn();
const mockUseMCPConnectionStatus = jest.fn();

jest.mock('~/hooks/Roles/useHasAccess', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseHasAccess(...args),
}));

jest.mock('~/data-provider/Endpoints/queries', () => ({
  useGetStartupConfig: (...args: unknown[]) => mockUseGetStartupConfig(...args),
}));

jest.mock('~/data-provider/MCP/queries', () => ({
  useMCPServersQuery: (...args: unknown[]) => mockUseMCPServersQuery(...args),
  useMCPToolsQuery: (...args: unknown[]) => mockUseMCPToolsQuery(...args),
}));

jest.mock('../useMCPConnectionStatus', () => ({
  useMCPConnectionStatus: (...args: unknown[]) => mockUseMCPConnectionStatus(...args),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useAyaRuntimeStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHasAccess.mockReturnValue(true);
    mockUseGetStartupConfig.mockReturnValue({
      data: { appTitle: 'Aya' },
      isFetched: true,
    });
    mockUseMCPServersQuery.mockReturnValue({
      data: {
        aya_ops: {
          customUserVars: {
            BLUE_TOKEN_ID: { title: 'Blue Token ID' },
            BLUE_TOKEN_SECRET: { title: 'Blue Token Secret' },
          },
        },
      },
      isLoading: false,
    });
    mockUseMCPToolsQuery.mockReturnValue({
      data: {
        servers: {
          aya_ops: {
            authenticated: true,
            tools: [{ name: 'aya_search_records' }],
          },
        },
      },
      isLoading: false,
      isError: false,
    });
    mockUseMCPConnectionStatus.mockReturnValue({
      connectionStatus: {
        aya_ops: {
          connectionState: 'connected',
          requiresOAuth: false,
          inspectionFailed: false,
        },
      },
    });
  });

  it('returns ready when Aya is reachable and authenticated', () => {
    const { result } = renderHook(() => useAyaRuntimeStatus(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toMatchObject({
      state: 'ready',
      tone: 'success',
      visible: true,
      label: 'Aya ready',
    });
  });

  it('returns write_auth_needed when Aya is reachable but personal Blue auth is missing', () => {
    mockUseMCPToolsQuery.mockReturnValue({
      data: {
        servers: {
          aya_ops: {
            authenticated: false,
            tools: [{ name: 'aya_search_records' }],
          },
        },
      },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useAyaRuntimeStatus(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toMatchObject({
      state: 'write_auth_needed',
      tone: 'warning',
      visible: true,
      label: 'Aya read-only',
    });
  });

  it('returns unavailable when Aya inspection has failed', () => {
    mockUseMCPConnectionStatus.mockReturnValue({
      connectionStatus: {
        aya_ops: {
          connectionState: 'error',
          requiresOAuth: false,
          inspectionFailed: true,
        },
      },
    });

    const { result } = renderHook(() => useAyaRuntimeStatus(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toMatchObject({
      state: 'unavailable',
      tone: 'danger',
      visible: true,
      label: 'Aya unavailable',
    });
  });

  it('returns not_configured when Aya server is missing from MCP config', () => {
    mockUseMCPServersQuery.mockReturnValue({
      data: {},
      isLoading: false,
    });

    const { result } = renderHook(() => useAyaRuntimeStatus(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toMatchObject({
      state: 'not_configured',
      tone: 'danger',
      visible: true,
      label: 'Aya missing',
    });
  });
});
