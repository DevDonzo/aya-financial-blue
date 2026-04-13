import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '@librechat/client';
import { Constants, QueryKeys, type TUpdateUserPlugins } from 'librechat-data-provider';
import { useUpdateUserPluginsMutation } from 'librechat-data-provider/react-query';
import { useMCPServersQuery } from '~/data-provider/MCP/queries';
import { useLocalize } from '~/hooks';
import { useAyaRuntimeStatus } from '~/hooks/MCP/useAyaRuntimeStatus';
import CustomUserVarsSection, {
  type CustomUserVarConfig,
} from '~/components/MCP/CustomUserVarsSection';

const AYA_SERVER_NAME = 'aya_ops';

const toneStyles: Record<
  ReturnType<typeof useAyaRuntimeStatus>['tone'],
  {
    border: string;
    badge: string;
    dot: string;
  }
> = {
  neutral: {
    border: 'border-border-medium',
    badge: 'bg-surface-hover text-text-primary',
    dot: 'bg-border-heavy',
  },
  success: {
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  warning: {
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  danger: {
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
};

export default function BlueConnection() {
  const localize = useLocalize();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();
  const runtimeStatus = useAyaRuntimeStatus();
  const { data: loadedServers, isLoading } = useMCPServersQuery();

  const ayaConfig = loadedServers?.[AYA_SERVER_NAME];
  const fields = (ayaConfig?.customUserVars ?? null) as Record<string, CustomUserVarConfig> | null;

  const updateUserPluginsMutation = useUpdateUserPluginsMutation({
    onSuccess: async (_data, variables) => {
      const isRevoke = variables.action === 'uninstall';
      showToast({
        message: isRevoke
          ? localize('com_nav_mcp_access_revoked')
          : localize('com_nav_mcp_vars_updated'),
        status: 'success',
      });

      await Promise.all([
        queryClient.invalidateQueries([QueryKeys.mcpServers]),
        queryClient.invalidateQueries([QueryKeys.mcpTools]),
        queryClient.invalidateQueries([QueryKeys.mcpAuthValues]),
        queryClient.invalidateQueries([QueryKeys.mcpConnectionStatus]),
      ]);
    },
    onError: () => {
      showToast({
        message: localize('com_nav_mcp_vars_update_error'),
        status: 'error',
      });
    },
  });

  const handleSave = useCallback(
    (authData: Record<string, string>) => {
      const payload: TUpdateUserPlugins = {
        pluginKey: `${Constants.mcp_prefix}${AYA_SERVER_NAME}`,
        action: 'install',
        auth: authData,
      };
      updateUserPluginsMutation.mutate(payload);
    },
    [updateUserPluginsMutation],
  );

  const handleRevoke = useCallback(() => {
    const payload: TUpdateUserPlugins = {
      pluginKey: `${Constants.mcp_prefix}${AYA_SERVER_NAME}`,
      action: 'uninstall',
      auth: {},
    };
    updateUserPluginsMutation.mutate(payload);
  }, [updateUserPluginsMutation]);

  if (isLoading || !fields || Object.keys(fields).length === 0) {
    return null;
  }

  const tone = toneStyles[runtimeStatus.tone];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
          Aya Workspace
        </p>
        <h3 className="mt-1 text-base font-semibold text-text-primary">Blue connection</h3>
        <p className="mt-1 text-sm leading-6 text-text-secondary">
          Connect Blue once so Aya can read and write against the CRM under your own identity.
          This keeps comments, moves, and lead creation attributable to the employee who triggered
          them.
        </p>
      </div>

      {runtimeStatus.visible ? (
        <div className={`rounded-2xl border px-4 py-3 ${tone.border}`}>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${tone.dot}`} aria-hidden="true" />
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone.badge}`}
            >
              {runtimeStatus.label}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{runtimeStatus.detail}</p>
        </div>
      ) : null}

      <CustomUserVarsSection
        serverName={AYA_SERVER_NAME}
        fields={fields}
        onSave={handleSave}
        onRevoke={handleRevoke}
        isSubmitting={updateUserPluginsMutation.isLoading}
      />
    </section>
  );
}
