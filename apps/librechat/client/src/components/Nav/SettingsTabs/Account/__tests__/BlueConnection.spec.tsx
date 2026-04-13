import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlueConnection from '../BlueConnection';

const mockMutate = jest.fn();
const mockUseMCPServersQuery = jest.fn();
const mockUseAyaRuntimeStatus = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockShowToast = jest.fn();

jest.mock('~/data-provider/MCP/queries', () => ({
  useMCPServersQuery: (...args: unknown[]) => mockUseMCPServersQuery(...args),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => {
    const translations: Record<string, string> = {
      com_nav_mcp_access_revoked: 'Access revoked',
      com_nav_mcp_vars_updated: 'Connection saved',
      com_nav_mcp_vars_update_error: 'Could not save connection',
    };

    return translations[key] ?? key;
  },
}));

jest.mock('~/hooks/MCP/useAyaRuntimeStatus', () => ({
  useAyaRuntimeStatus: (...args: unknown[]) => mockUseAyaRuntimeStatus(...args),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@librechat/client', () => ({
  useToastContext: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('librechat-data-provider/react-query', () => ({
  useUpdateUserPluginsMutation: () => ({
    mutate: mockMutate,
    isLoading: false,
  }),
}));

jest.mock('~/components/MCP/CustomUserVarsSection', () => ({
  __esModule: true,
  default: ({ onSave, onRevoke }: { onSave: (auth: Record<string, string>) => void; onRevoke: () => void }) => (
    <div>
      <button onClick={() => onSave({ AYA_BLUE_TOKEN_ID: 'token-id', AYA_BLUE_TOKEN_SECRET: 'token-secret' })}>
        Save Blue connection
      </button>
      <button onClick={onRevoke}>Disconnect Blue</button>
    </div>
  ),
}));

describe('BlueConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMCPServersQuery.mockReturnValue({
      isLoading: false,
      data: {
        aya_ops: {
          customUserVars: {
            AYA_BLUE_TOKEN_ID: { title: 'Blue Token ID' },
            AYA_BLUE_TOKEN_SECRET: { title: 'Blue Token Secret' },
          },
        },
      },
    });

    mockUseAyaRuntimeStatus.mockReturnValue({
      state: 'write_auth_needed',
      label: 'Aya read-only',
      detail: 'Reads are available. Connect Blue once in Aya settings.',
      tone: 'warning',
      visible: true,
    });
  });

  it('renders the account-level Blue connection experience', () => {
    render(<BlueConnection />);

    expect(screen.getByText('Aya Workspace')).toBeInTheDocument();
    expect(screen.getByText('Blue connection')).toBeInTheDocument();
    expect(screen.getByText('Aya read-only')).toBeInTheDocument();
  });

  it('saves Blue credentials through the existing plugin auth flow', async () => {
    const user = userEvent.setup();
    render(<BlueConnection />);

    await user.click(screen.getByRole('button', { name: 'Save Blue connection' }));

    expect(mockMutate).toHaveBeenCalledWith({
      pluginKey: 'mcp_aya_ops',
      action: 'install',
      auth: {
        AYA_BLUE_TOKEN_ID: 'token-id',
        AYA_BLUE_TOKEN_SECRET: 'token-secret',
      },
    });
  });

  it('revokes Blue credentials through the existing plugin auth flow', async () => {
    const user = userEvent.setup();
    render(<BlueConnection />);

    await user.click(screen.getByRole('button', { name: 'Disconnect Blue' }));

    expect(mockMutate).toHaveBeenCalledWith({
      pluginKey: 'mcp_aya_ops',
      action: 'uninstall',
      auth: {},
    });
  });
});
