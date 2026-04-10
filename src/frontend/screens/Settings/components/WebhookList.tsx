import { useTranslation } from 'react-i18next'
import { MenuItem } from '@mui/material'
import { SelectField, TextInputField } from 'frontend/components/UI'
import useSetting from 'frontend/hooks/useSetting'
import { WebhookConfig, WebhookHttpMethod } from 'common/types'

interface Props {
  settingKey: 'webhooksOnGameStart' | 'webhooksOnGameEnd'
  label: string
}

const WebhookList = ({ settingKey, label }: Props) => {
  const { t } = useTranslation()
  const [webhooks, setWebhooks] = useSetting(settingKey, [])

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

  return (
    <div className="webhookList Field">
      <h6>
        <label>{label}</label>
      </h6>
      <br />

      {webhooks.map((webhook: WebhookConfig) => (
        <div key={webhook.id} className="webhookRow">
          <SelectField
            htmlId={`method-${webhook.id}`}
            value={webhook.method}
            onChange={(e) =>
              updateWebhook(webhook.id, {
                method: e.target.value as WebhookHttpMethod
              })
            }
            extraClass="webhookMethod"
          >
            {Object.values(WebhookHttpMethod).map((method: string) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </SelectField>

          <TextInputField
            htmlId={`url-${webhook.id}`}
            value={webhook.url}
            onChange={(newUrl) => updateWebhook(webhook.id, { url: newUrl })}
            placeholder={t(
              'options.webhook.url_placeholder',
              'https://example.com/webhook'
            )}
            extraClass="webhookUrl"
          />

          <button
            className="button is-danger is-small webhookDelete"
            onClick={() => deleteWebhook(webhook.id)}
            title={t('options.webhook.delete', 'Delete webhook')}
          >
            X
          </button>
        </div>
      ))}

      <br />

      <button className="button is-primary is-small" onClick={addWebhook}>
        {t('options.webhook.add', 'Add Webhook')}
      </button>
    </div>
  )
}

export default WebhookList
