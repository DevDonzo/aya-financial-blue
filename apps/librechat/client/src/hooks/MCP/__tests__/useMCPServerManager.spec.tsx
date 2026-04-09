import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useMCPServerManager } from '../useMCPServerManager';

const mockUseAuthContext = jest.fn();
const mockUseGetStartupConfig = jest.fn();
const mockUseMCPServersQuery = jest.fn();
const mockUseMCPToolsQuery = jest.fn();
const mockUseUserTermsQuery = jest.fn();

jest.mock('@librechat/client', () => ({
  useToastContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('~/hooks', () => ({
  useAuthContext: () => mockUseAuthContext(),
  useLocalize: () => (key: string) => key,
  useHasAccess: () => true,
  useMCPSelect: () => ({
    mcpValues: [],
    setMCPValues: jest.fn(),
    isPinned: false,
    setIsPinned: jest.fn(),
  }),
  useMCPConnectionStatus: () => ({
    connectionStatus: {},
  }),
}));

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: (...args: unknown[]) => mockUseGetStartupConfig(...args),
  useMCPServersQuery: (...args: unknown[]) => mockUseMCPServersQuery(...args),
  useMCPToolsQuery: (...args: unknown[]) => mockUseMCPToolsQuery(...args),
  useUserTermsQuery: (...args: unknown[]) => mockUseUserTermsQuery(...args),
}));

jest.mock('librechat-data-provider/react-query', () => ({
  useCancelMCPOAuthMutation: () => ({
    mutate: jest.fn(),
  }),
  useUpdateUserPluginsMutation: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
  useReinitializeMCPServerMutation: () => ({
    mutateAsync: jest.fn(),
  }),
  useGetAllEffectivePermissionsQuery: () => ({
    data: {},
  }),
}));

const mockLoadedServers = {
  aya_ops: {
    command: 'echo',
    args: [],
    chatMenu: true,
    customUserVars: {
      BLUE_TOKEN_ID: {
        title: 'Blue Token ID',
        description: 'Token ID',
      },
      BLUE_TOKEN_SECRET: {
        title: 'Blue Token Secret',
        description: 'Token Secret',
      },
    },
  },
};

const mockToolServer = (authenticated = false) => ({
  servers: {
    aya_ops: {
      authenticated,
      authConfig: [
        {
          authField: 'BLUE_TOKEN_ID',
          label: 'Blue Token ID',
          description: 'Token ID',
        },
        {
          authField: 'BLUE_TOKEN_SECRET',
          label: 'Blue Token Secret',
          description: 'Token Secret',
        },
      ],
      tools: [],
    },
  },
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useMCPServerManager auto prompt sequencing', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ isAuthenticated: true });
    mockUseGetStartupConfig.mockReturnValue({
      data: {
        interface: {
          termsOfService: {
            modalAcceptance: false,
          },
        },
      },
      isFetched: true,
    });
    mockUseMCPServersQuery.mockReturnValue({
      data: mockLoadedServers,
      isLoading: false,
    });
    mockUseMCPToolsQuery.mockReturnValue({
      data: mockToolServer(false),
    });
    mockUseUserTermsQuery.mockReturnValue({
      data: {
        termsAccepted: true,
      },
      isFetched: true,
    });
  });

  it('waits for startup config before auto-prompting for aya_ops credentials', async () => {
    mockUseGetStartupConfig.mockReturnValue({
      data: undefined,
      isFetched: false,
    });

    const { result, rerender } = renderHook(
      () => useMCPServerManager({ autoPromptMissingAuth: true }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isConfigModalOpen).toBe(false);
    expect(result.current.selectedToolForConfig).toBeNull();

    mockUseGetStartupConfig.mockReturnValue({
      data: {
        interface: {
          termsOfService: {
            modalAcceptance: false,
          },
        },
      },
      isFetched: true,
    });

    rerender();

    await waitFor(() => {
      expect(result.current.isConfigModalOpen).toBe(true);
      expect(result.current.selectedToolForConfig?.name).toBe('aya_ops');
    });
  });

  it('waits for terms acceptance before auto-prompting and opens after the terms modal resolves', async () => {
    let termsAccepted = false;

    mockUseGetStartupConfig.mockReturnValue({
      data: {
        interface: {
          termsOfService: {
            modalAcceptance: true,
          },
        },
      },
      isFetched: true,
    });
    mockUseUserTermsQuery.mockImplementation(() => ({
      data: {
        termsAccepted,
      },
      isFetched: true,
    }));

    const { result, rerender } = renderHook(
      () => useMCPServerManager({ autoPromptMissingAuth: true }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isConfigModalOpen).toBe(false);
    expect(result.current.selectedToolForConfig).toBeNull();

    termsAccepted = true;
    rerender();

    expect(result.current.isConfigModalOpen).toBe(false);
    expect(result.current.selectedToolForConfig).toBeNull();

    window.dispatchEvent(new CustomEvent('librechat:terms-accepted'));

    await waitFor(() => {
      expect(result.current.isConfigModalOpen).toBe(true);
      expect(result.current.selectedToolForConfig?.name).toBe('aya_ops');
    });
  });

  it('does not auto-prompt when aya_ops credentials already exist', async () => {
    mockUseMCPToolsQuery.mockReturnValue({
      data: mockToolServer(true),
    });

    const { result } = renderHook(() => useMCPServerManager({ autoPromptMissingAuth: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isConfigModalOpen).toBe(false);
      expect(result.current.selectedToolForConfig).toBeNull();
    });
  });
});
