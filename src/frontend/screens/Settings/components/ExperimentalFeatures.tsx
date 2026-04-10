import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import useSetting from 'frontend/hooks/useSetting'
import { ToggleSwitch } from 'frontend/components/UI'
import ContextProvider from 'frontend/state/ContextProvider'
import { ExperimentalFeatures as IExperimentalFeatures } from 'common/types'

// Webhooks
import { WebhookList } from '../components'

const ExperimentalFeatures = () => {
  const FEATURES: (keyof IExperimentalFeatures)[] = [
    'enableHelp',
    'cometSupport',
    'zoomPlatform'
  ]

  const { t } = useTranslation()
  const [experimentalFeatures, setExperimentalFeatures] = useSetting(
    'experimentalFeatures',
    {
      enableHelp: false,
      cometSupport: true,
      zoomPlatform: false
    }
  )
  const { handleExperimentalFeatures } = useContext(ContextProvider)

  const toggleFeature = (feature: keyof IExperimentalFeatures) => {
    const newFeatures = {
      ...experimentalFeatures,
      [feature]: !experimentalFeatures[feature]
    }
    setExperimentalFeatures(newFeatures) // update settings
    handleExperimentalFeatures(newFeatures) // update global state
  }

  /*
    Translations:
    t('setting.experimental_features.enableNewDesign', 'New design')
    t('setting.experimental_features.enableHelp', 'Help component')
    t('setting.experimental_features.cometSupport', 'Comet support')
    t('setting.experimental_features.zoomPlatform', 'Zoom Platform support (only Linux)')
  */

  return (
    <>
      <h3>
        {t('settings.experimental_features.title', 'Experimental Features')}
      </h3>
      {FEATURES.map((feature) => {
        return (
          <div key={feature}>
            <ToggleSwitch
              htmlId={feature}
              value={experimentalFeatures[feature]}
              handleChange={() => toggleFeature(feature)}
              title={t(`setting.experimental_features.${feature}`, feature)}
            />
          </div>
        )
      })}

      <WebhookList
        settingKey="webhooksOnGameStart"
        label={t('options.webhook.on_start', 'Webhooks on game start')}
      />
      <WebhookList
        settingKey="webhooksOnGameEnd"
        label={t('options.webhook.on_end', 'Webhooks on game end')}
      />
    </>
  )
}

export default ExperimentalFeatures
