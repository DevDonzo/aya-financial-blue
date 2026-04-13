import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useForm, Controller } from 'react-hook-form';
import { Input, Label, Button } from '@librechat/client';
import { useMCPAuthValuesQuery } from '~/data-provider/Tools/queries';
import { useLocalize } from '~/hooks';

export interface CustomUserVarConfig {
  title: string;
  description?: string;
}

interface CustomUserVarsSectionProps {
  serverName: string;
  fields: Record<string, CustomUserVarConfig>;
  onSave: (authData: Record<string, string>) => void;
  onRevoke: () => void;
  isSubmitting?: boolean;
}
interface AuthFieldProps {
  serverName: string;
  name: string;
  config: CustomUserVarConfig;
  hasValue: boolean;
  control: any;
  errors: any;
  autoFocus?: boolean;
}

const AYA_SERVER_NAME = 'aya_ops';

function isAyaBlueConnection(serverName: string) {
  return serverName === AYA_SERVER_NAME;
}

function getFieldTitle(serverName: string, name: string, config: CustomUserVarConfig) {
  if (!isAyaBlueConnection(serverName)) {
    return config.title;
  }

  if (name === 'AYA_BLUE_TOKEN_ID') {
    return 'Blue Token ID';
  }

  if (name === 'AYA_BLUE_TOKEN_SECRET') {
    return 'Blue Token Secret';
  }

  return config.title;
}

function getFieldDescription(serverName: string, name: string, config: CustomUserVarConfig) {
  if (!isAyaBlueConnection(serverName)) {
    return config.description;
  }

  if (name === 'AYA_BLUE_TOKEN_ID') {
    return 'Find this in Blue under Profile > API. Aya uses it only when you trigger Blue write actions.';
  }

  if (name === 'AYA_BLUE_TOKEN_SECRET') {
    return 'Shown only once when you generate the token in Blue. LibreChat stores it encrypted after you save it here.';
  }

  return config.description;
}

function getFieldInputType(serverName: string, name: string) {
  if (isAyaBlueConnection(serverName) && name === 'AYA_BLUE_TOKEN_SECRET') {
    return 'password';
  }

  return 'text';
}

function getFieldPlaceholder(
  serverName: string,
  name: string,
  title: string,
  hasValue: boolean,
  localize: (key: string, values?: Record<string, string>) => string,
) {
  if (!isAyaBlueConnection(serverName)) {
    return hasValue
      ? localize('com_ui_mcp_update_var', { 0: title })
      : localize('com_ui_mcp_enter_var', { 0: title });
  }

  if (name === 'AYA_BLUE_TOKEN_ID') {
    return hasValue ? 'Leave blank to keep your saved token ID' : 'Paste your Blue token ID';
  }

  if (name === 'AYA_BLUE_TOKEN_SECRET') {
    return hasValue
      ? 'Leave blank to keep your saved token secret'
      : 'Paste your Blue token secret';
  }

  return hasValue
    ? localize('com_ui_mcp_update_var', { 0: title })
    : localize('com_ui_mcp_enter_var', { 0: title });
}

function AyaConnectionHero() {
  return (
    <div className="rounded-2xl border border-border-medium bg-gradient-to-br from-surface-chat via-surface-chat to-surface-hover px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
            Connect Blue
          </p>
          <h3 className="mt-1 text-base font-semibold text-text-primary">
            Unlock attributable Blue writes
          </h3>
        </div>
        <div className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
          One-time setup
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Aya already works for search, summaries, reporting, and record context. Connect your Blue
        account once so moves, comments, and lead creation are written back under your own Blue
        user.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-border-light bg-surface-main px-3 py-2 text-xs text-text-secondary">
          Reads still work without this
        </div>
        <div className="rounded-xl border border-border-light bg-surface-main px-3 py-2 text-xs text-text-secondary">
          Stored encrypted in LibreChat
        </div>
        <div className="rounded-xl border border-border-light bg-surface-main px-3 py-2 text-xs text-text-secondary">
          Used only for Blue write actions
        </div>
      </div>

      <ol className="mt-4 space-y-2 text-sm text-text-secondary">
        <li>1. Open Blue and go to Profile &gt; API.</li>
        <li>2. Generate a personal token or use an existing one.</li>
        <li>3. Paste the Token ID and Secret here once, then save.</li>
      </ol>
    </div>
  );
}

function AuthField({
  serverName,
  name,
  config,
  hasValue,
  control,
  errors,
  autoFocus,
}: AuthFieldProps) {
  const localize = useLocalize();
  const statusText = hasValue ? localize('com_ui_set') : localize('com_ui_unset');
  const fieldTitle = getFieldTitle(serverName, name, config);
  const fieldDescription = getFieldDescription(serverName, name, config);
  const inputType = getFieldInputType(serverName, name);

  const sanitizer = useMemo(() => {
    const instance = DOMPurify();
    instance.addHook('afterSanitizeAttributes', (node) => {
      if (node.tagName && node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return instance;
  }, []);

  const sanitizedDescription = useMemo(() => {
    if (!fieldDescription) {
      return '';
    }
    try {
      return sanitizer.sanitize(fieldDescription, {
        ALLOWED_TAGS: ['a', 'strong', 'b', 'em', 'i', 'br', 'code'],
        ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
        ALLOW_ARIA_ATTR: false,
      });
    } catch (error) {
      console.error('Sanitization failed', error);
      return fieldDescription;
    }
  }, [fieldDescription, sanitizer]);

  return (
    <div className="space-y-2 rounded-2xl border border-border-light bg-surface-main px-4 py-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {fieldTitle} <span className="sr-only">({statusText})</span>
        </Label>
        <div aria-hidden="true">
          {hasValue ? (
            <div className="flex min-w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border-light px-2 py-0.5 text-xs font-medium text-text-secondary">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>{localize('com_ui_set')}</span>
            </div>
          ) : (
            <div className="flex min-w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border-light px-2 py-0.5 text-xs font-medium text-text-secondary">
              <div className="h-1.5 w-1.5 rounded-full border border-border-medium" />
              <span>{localize('com_ui_unset')}</span>
            </div>
          )}
        </div>
      </div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            id={name}
            type={inputType}
            /* autoFocus is generally disabled due to the fact that it can disorient users,
             * but in this case, the required field would logically be immediately navigated to anyways, and the component's
             * functionality emulates that of a new modal opening, where users would expect focus to be shifted to the new content */
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            {...field}
            placeholder={
              getFieldPlaceholder(serverName, name, fieldTitle, hasValue, localize)
            }
            className="w-full rounded border border-border-medium bg-transparent px-2 py-1 text-text-primary placeholder:text-text-secondary focus:outline-none sm:text-sm"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        )}
      />
      {isAyaBlueConnection(serverName) && hasValue ? (
        <p className="text-xs text-text-secondary">
          Stored securely. Leave this blank if you want to keep the current saved value.
        </p>
      ) : null}
      {sanitizedDescription && (
        <p
          className="text-xs text-text-secondary [&_a]:text-blue-500 [&_a]:hover:underline"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      )}
      {errors[name] && <p className="text-xs text-red-500">{errors[name]?.message}</p>}
    </div>
  );
}

export default function CustomUserVarsSection({
  fields,
  onSave,
  onRevoke,
  serverName,
  isSubmitting = false,
}: CustomUserVarsSectionProps) {
  const localize = useLocalize();
  const isAyaServer = isAyaBlueConnection(serverName);

  const { data: authValuesData } = useMCPAuthValuesQuery(serverName, {
    enabled: !!serverName,
  });

  const {
    reset,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues: useMemo(() => {
      const initial: Record<string, string> = {};
      Object.keys(fields).forEach((key) => {
        initial[key] = '';
      });
      return initial;
    }, [fields]),
  });

  const onFormSubmit = (data: Record<string, string>) => {
    clearErrors();

    let hasValidationError = false;
    for (const [key, config] of Object.entries(fields)) {
      const hasExistingValue = authValuesData?.authValueFlags?.[key] || false;
      const trimmedValue = data[key]?.trim() || '';

      if (!hasExistingValue && trimmedValue.length === 0) {
        setError(key, {
          type: 'required',
          message: localize('com_ui_mcp_enter_var', { 0: config.title }),
        });
        hasValidationError = true;
      }
    }

    if (hasValidationError) {
      return;
    }

    onSave(data);
  };

  const handleRevokeClick = () => {
    onRevoke();
    reset();
  };

  if (!fields || Object.keys(fields).length === 0) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4">
      {isAyaServer ? <AyaConnectionHero /> : null}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {Object.entries(fields).map(([key, config], index) => {
          const hasValue = authValuesData?.authValueFlags?.[key] || false;

          return (
            <AuthField
              key={key}
              serverName={serverName}
              name={key}
              config={config}
              hasValue={hasValue}
              control={control}
              errors={errors}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- See AuthField autoFocus comment for more details
              autoFocus={index === 0}
            />
          );
        })}
      </form>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="destructive"
          disabled={isSubmitting}
          onClick={handleRevokeClick}
        >
          {isAyaServer ? 'Disconnect Blue' : localize('com_ui_revoke')}
        </Button>
        <Button
          type="button"
          variant="submit"
          disabled={isSubmitting}
          onClick={handleSubmit(onFormSubmit)}
        >
          {isSubmitting
            ? localize('com_ui_saving')
            : isAyaServer
              ? 'Save Blue connection'
              : localize('com_ui_save')}
        </Button>
      </div>
    </div>
  );
}
