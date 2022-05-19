<?php

namespace carlcs\redactorcustomstyles;

use carlcs\redactorcustomstyles\assets\customcp\CustomCpAsset;
use carlcs\redactorcustomstyles\assets\redactorplugin\RedactorPluginAsset;
use Craft;
use craft\helpers\Json;
use craft\redactor\Field as RedactorField;
use craft\redactor\events\RegisterPluginPathsEvent;
use yii\base\Event;

/**
 * @property Settings $settings
 * @method Settings getSettings()
 * @method static Plugin getInstance()
 */
class Plugin extends \craft\base\Plugin
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            Event::on(RedactorField::class, RedactorField::EVENT_REGISTER_PLUGIN_PATHS, [$this, 'registerRedactorPlugin']);

            $view = Craft::$app->getView();

            /** @var CustomCpAsset $customCpAsset */
            $customCpAsset = $view->registerAssetBundle(CustomCpAsset::class);
            $view->registerAssetBundle(RedactorPluginAsset::class);

            if (($iconSprite = $customCpAsset->iconSprite) === null) {
                $iconSprite = '@carlcs/redactorcustomstyles/assets/redactorplugin/dist/icons.svg';
            }

            $iconSpriteUrl = Craft::$app->getAssetManager()->getPublishedUrl($iconSprite, true);
            $iconIds = $this->getSymbolIds($iconSprite);

            $view->registerJs('Craft.RedactorCustomStyles = '.Json::encode(compact('iconSpriteUrl', 'iconIds')).';');
        }
    }

    /**
     * Registers the Redactor plugin and its assets.
     *
     * @param RegisterPluginPathsEvent $event
     */
    public function registerRedactorPlugin(RegisterPluginPathsEvent $event)
    {
        $event->paths[] = Craft::getAlias('@carlcs/redactorcustomstyles/assets/redactorplugin/_redactorplugin');
    }

    // Protected Methods
    // =========================================================================

    /**
     * Returns the symbol IDs from a SVG sprite.
     *
     * @param string $path
     * @return array
     */
    protected function getSymbolIds(string $path): array
    {
        $doc = new \DOMDocument();
        $doc->load(Craft::getAlias($path));

        $ids = [];
        foreach ($doc->getElementsByTagName('symbol') as $symbol) {
            /** @var \DOMElement $symbol */
            $ids[] = $symbol->getAttribute('id');
        }

        return $ids;
    }

    /**
     * @inheritdoc
     */
    protected function createSettingsModel(): Settings
    {
        return new Settings();
    }
}
