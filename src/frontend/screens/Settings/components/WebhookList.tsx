import { useTranslation } from 'react-i18next'
import { MenuItem } from '@mui/material'
import { SelectField, TextInputField } from 'frontend/components/UI'
import useSetting from 'frontend/hooks/useSetting'
import { WebhookConfig, WebhookHttpMethod } from 'common/types'
import { useState } from 'react'

type WebhookTestState = 'idle' | 'success' | 'error'

interface Props {
  settingKey: 'webhooksOnGameStart' | 'webhooksOnGameEnd'
  label: string
}

const WebhookList = ({ settingKey, label }: Props) => {
  const { t } = useTranslation()
  const [webhooks, setWebhooks] = useSetting(settingKey, [])
  const [webhookTestStates, setWebhookTestStates] = useState<
    Record<string, WebhookTestState>
  >({})

  const addWebhook = () => {
    const newWebhook: WebhookConfig = {
      id: crypto.randomUUID(),
      url: '',
      method: WebhookHttpMethod.POST
    }
    setWebhooks([...webhooks, newWebhook])
  }

  const updateWebhook = (id: string, changes: Partial<WebhookConfig>) => {
    setWebhooks(
      webhooks.map((wh) => (wh.id === id ? { ...wh, ...changes } : wh))
    )
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((wh) => wh.id !== id))
  }

  const testWebhook = async (
    id: string,
    url: string,
    method: WebhookHttpMethod
  ) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: t('options.webhook.test.gametitle', 'Example game title')
        })
      })

      setWebhookTestStates((prev: Record<string, WebhookTestState>) => ({
        ...prev,
        [id]: response.ok ? 'success' : 'error'
      }))
    } catch {
      setWebhookTestStates((prev: Record<string, WebhookTestState>) => ({
        ...prev,
        [id]: 'error'
      }))
    } finally {
      setTimeout(() => {
        setWebhookTestStates((prev: Record<string, WebhookTestState>) => ({
          ...prev,
          [id]: 'idle'
        }))
      }, 1000)
    }
  }

  return (
    <div className="webhook-list Field">
      <h6>
        <label>{label}</label>
      </h6>

      {webhooks.map((webhook: WebhookConfig) => (
        <div key={webhook.id} className="webhook-row">
          <TextInputField
            htmlId={`url-${webhook.id}`}
            value={webhook.url}
            onChange={(newUrl) => updateWebhook(webhook.id, { url: newUrl })}
            placeholder={t(
              'options.webhook.url_placeholder',
              'https://example.com/webhook'
            )}
            extraClass="webhook-url"
          />

          <SelectField
            htmlId={`method-${webhook.id}`}
            value={webhook.method}
            onChange={(e) =>
              updateWebhook(webhook.id, {
                method: e.target.value as WebhookHttpMethod
              })
            }
            extraClass="webhook-method"
          >
            {Object.values(WebhookHttpMethod).map((method: string) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </SelectField>

          <button
            className={`button webhook-test webhook-test-${webhookTestStates[webhook.id] ?? 'idle'}`}
            onClick={() => testWebhook(webhook.id, webhook.url, webhook.method)}
            title={t('options.webhook.test', 'Test Webhook')}
          >
            ↑
          </button>

          <button
            className="button is-danger webhook-delete"
            onClick={() => deleteWebhook(webhook.id)}
            title={t('options.webhook.delete', 'Delete webhook')}
          >
            X
          </button>
        </div>
      ))}

      <button className="button is-primary webhook-add" onClick={addWebhook}>
        {t('options.webhook.add', 'Add Webhook')}
      </button>
    </div>
  )
}

export default WebhookList
