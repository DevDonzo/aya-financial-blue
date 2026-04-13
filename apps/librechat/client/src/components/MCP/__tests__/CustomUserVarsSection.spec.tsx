import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CustomUserVarsSection from '../CustomUserVarsSection';

const mockUseMCPAuthValuesQuery = jest.fn();

jest.mock('~/data-provider/Tools/queries', () => ({
  useMCPAuthValuesQuery: (...args: unknown[]) => mockUseMCPAuthValuesQuery(...args),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string, values?: Record<string, string>) => {
    const translations: Record<string, string> = {
      com_ui_set: 'Set',
      com_ui_unset: 'Unset',
      com_ui_revoke: 'Revoke',
      com_ui_save: 'Save',
      com_ui_saving: 'Saving',
      com_ui_mcp_enter_var: `Enter ${values?.[0] ?? ''}`.trim(),
      com_ui_mcp_update_var: `Update ${values?.[0] ?? ''}`.trim(),
    };

    return translations[key] ?? key;
  },
}));

jest.mock('@librechat/client', () => {
  const React = require('react');

  return {
    Input: React.forwardRef(({ children, ...props }: any, ref: React.ForwardedRef<HTMLInputElement>) =>
      React.createElement('input', { ref, ...props }, children),
    ),
    Label: ({ children, ...props }: any) => React.createElement('label', props, children),
    Button: ({ children, ...props }: any) => React.createElement('button', props, children),
  };
});

describe('CustomUserVarsSection', () => {
  const onSave = jest.fn();
  const onRevoke = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMCPAuthValuesQuery.mockReturnValue({
      data: {
        authValueFlags: {
          AYA_BLUE_TOKEN_ID: true,
          AYA_BLUE_TOKEN_SECRET: false,
        },
      },
    });
  });

  it('renders Aya-specific Blue connection copy and secure secret input', () => {
    const { container } = render(
      <CustomUserVarsSection
        serverName="aya_ops"
        fields={{
          AYA_BLUE_TOKEN_ID: { title: 'Blue Token ID' },
          AYA_BLUE_TOKEN_SECRET: { title: 'Blue Token Secret' },
        }}
        onSave={onSave}
        onRevoke={onRevoke}
      />,
    );

    expect(screen.getByText('Connect Blue')).toBeInTheDocument();
    expect(screen.getByText('Unlock attributable Blue writes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Blue connection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disconnect Blue' })).toBeInTheDocument();
    expect(container.querySelector('#AYA_BLUE_TOKEN_SECRET')).toHaveAttribute('type', 'password');
  });

  it('submits the saved Blue connection values', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <CustomUserVarsSection
        serverName="aya_ops"
        fields={{
          AYA_BLUE_TOKEN_ID: { title: 'Blue Token ID' },
          AYA_BLUE_TOKEN_SECRET: { title: 'Blue Token Secret' },
        }}
        onSave={onSave}
        onRevoke={onRevoke}
      />,
    );

    const tokenIdInput = container.querySelector('#AYA_BLUE_TOKEN_ID');
    const tokenSecretInput = container.querySelector('#AYA_BLUE_TOKEN_SECRET');

    expect(tokenIdInput).toBeTruthy();
    expect(tokenSecretInput).toBeTruthy();

    await user.type(tokenIdInput as HTMLElement, 'token-id');
    await user.type(tokenSecretInput as HTMLElement, 'token-secret');
    await user.click(screen.getByRole('button', { name: 'Save Blue connection' }));

    expect(onSave).toHaveBeenCalledWith({
      AYA_BLUE_TOKEN_ID: 'token-id',
      AYA_BLUE_TOKEN_SECRET: 'token-secret',
    });
  });
});
