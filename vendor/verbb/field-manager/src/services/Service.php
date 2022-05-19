<?php
namespace verbb\fieldmanager\services;

use verbb\fieldmanager\FieldManager;

use Craft;
use craft\base\FieldInterface;
use craft\db\Query;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldGroup;

use yii\base\Component;

class Service extends Component
{
    // Public Methods
    // =========================================================================

    public function isCpSectionEnabled(): bool
    {
        $settings = FieldManager::$plugin->getSettings();

        return isset($settings['cpSectionEnabled']) && $settings['cpSectionEnabled'];
    }

    public function cloneField(FieldInterface $field, FieldInterface $originField): bool
    {
        // If this is a Matrix or Super Table field, we need to do some pre-processing.
        // Because we're essentially editing a current field, we need to remove ID's for blocks and inner fields.
        // Not doing this will move all fields from one Matrix to another - instead of creating new ones.
        if (get_class($field) == 'craft\fields\Matrix') {
            $field->blockTypes = $this->processCloneMatrix($originField);
        }

        if (get_class($field) == 'verbb\supertable\fields\SuperTableField') {
            $field->blockTypes = $this->processCloneSuperTable($originField);
        }

        if (get_class($field) == 'benf\neo\Field') {
            $blockTypes = $this->processCloneNeo($originField);
            $field->blockTypes = $blockTypes;

            // Reset the keys so we can get iterate
            $blockTypes = array_values($blockTypes);

            // Have to re-assign the fieldlayout after the blocktypes have been set - ugh.
            // This is because Neo's `setBlockTypes()` relies on POST data, which we don't have here.
            // So create the blocktype as normal, filling in all other info, then populate the fieldLayout now.
            foreach ($field->blockTypes as $key => $blockType) {
                $fieldLayout = $blockTypes[$key]['fieldLayout'] ?? null;

                if ($fieldLayout) {
                    $field->blockTypes[$key]->setFieldLayout($fieldLayout);
                }
            }
        }

        // Send off to Craft's native fieldSave service for heavy lifting.
        if (!Craft::$app->fields->saveField($field)) {
            FieldManager::error('Could not clone {name} - {errors}.', ['name' => $field->name, 'errors' => print_r($field->getErrors(), true)]);

            return false;
        }

        return true;
    }

    public function cloneGroup(FieldGroup $group, $prefix, FieldGroup $originGroup): bool
    {
        if (!Craft::$app->fields->saveGroup($group)) {
            FieldManager::error('Could not clone {name} group - {errors}.', ['name' => $originGroup->name, 'errors' => print_r($group->getErrors(), true)]);

            return false;
        }

        $errors = [];

        foreach (Craft::$app->fields->getFieldsByGroupId($originGroup->id) as $originField) {
            $field = Craft::$app->fields->createField([
                'type' => \get_class($originField),
                'groupId' => $group->id,
                'name' => $originField->name,
                'handle' => $prefix . $originField->handle,
                'instructions' => $originField->instructions,
                'searchable' => $originField->searchable,
                'translationMethod' => $originField->translationMethod,
                'translationKeyFormat' => $originField->translationKeyFormat,
                'settings' => $originField->settings,
            ]);

            if (get_class($field) == 'craft\fields\Matrix') {
                $field->blockTypes = $this->processCloneMatrix($originField);
            }

            if (get_class($field) == 'verbb\supertable\fields\SuperTableField') {
                $field->blockTypes = $this->processCloneSuperTable($originField);
            }

            if (!FieldManager::$plugin->service->cloneField($field, $originField)) {
                $errors[] = $field;
            }
        }

        if ($errors) {
            foreach ($errors as $error) {
                FieldManager::error('Could not clone {errorName} in {name} group - {errors}.', [
                    'errorName' => $error->name,
                    'name'      => $originGroup->name,
                    'errors'    => print_r($group->getErrors(), true),
                ]);

                $group->addError($error->name, 'Could not clone group.');
            }

            return false;
        }

        return true;
    }

    public function getUnusedFieldIds(): array
    {
        // All fields
        $allFieldIds = (new Query())
            ->select(['id'])
            ->from(['{{%fields}}'])
            ->column();

        $usedFieldIds = (new Query())
            ->distinct(true)
            ->select(['fieldId'])
            ->from(['{{%fieldlayoutfields}}'])
            ->column();

        // Get only the unused fields
        return array_diff($allFieldIds, $usedFieldIds);
    }

    public function processCloneMatrix(FieldInterface $originField)
    {
        $blockTypes = [];

        foreach ($originField->blockTypes as $i => $blockType) {
            $fields = [];
            $blockKey = 'new' . ($i + 1);

            foreach ($blockType->getFields() as $j => $blockField) {
                $fieldKey = 'new' . ($j + 1);
                $width = 100;

                $fieldLayout = $blockType->getFieldLayout();
                $fieldLayoutElements = $fieldLayout->getTabs()[0]->elements ?? [];

                if ($fieldLayoutElements) {
                    $fieldLayoutElement = ArrayHelper::firstWhere($fieldLayoutElements, 'field.uid', $blockField->uid);
                    $width = (int)($fieldLayoutElement->width ?? 0) ?: 100;
                }

                $fields[$fieldKey] = [
                    'type' => get_class($blockField),
                    'name' => $blockField['name'],
                    'handle' => $blockField['handle'],
                    'instructions' => $blockField['instructions'],
                    'required' => (bool)$blockField['required'],
                    'searchable' => (bool)$blockField['searchable'],
                    'translationMethod' => $blockField['translationMethod'],
                    'translationKeyFormat' => $blockField['translationKeyFormat'],
                    'typesettings' => $blockField['settings'],
                    'width' => $width,
                ];

                if (get_class($blockField) == 'verbb\supertable\fields\SuperTableField') {
                    $fields['new' . ($j + 1)]['typesettings']['blockTypes'] = $this->processCloneSuperTable($blockField);
                }
            }

            $blockTypes[$blockKey] = [
                'name' => $blockType->name,
                'handle' => $blockType->handle,
                'sortOrder' => $blockType->sortOrder,
                'fields' => $fields,
            ];
        }

        return $blockTypes;
    }

    public function processCloneNeo(FieldInterface $originField)
    {
        $blockTypes = [];

        foreach ($originField->blockTypes as $i => $blockType) {
            $layout = new \craft\models\FieldLayout();
            $layout->type = \benf\neo\elements\Block::class;

            $tabs = [];

            foreach ($blockType->fieldLayout->getTabs() as $oldTab) {
                $tab = new \craft\models\FieldLayoutTab();
                $tab->name = $oldTab->name;
                $tab->sortOrder = $oldTab->sortOrder;
                $tab->elements = $oldTab->elements;

                $tabs[] = $tab;
            }

            $layout->setTabs($tabs);

            $blockTypes['new' . $i] = [
                'name' => $blockType->name,
                'handle' => $blockType->handle,
                'sortOrder' => $blockType->sortOrder,
                'maxBlocks' => $blockType->maxBlocks,
                'maxSiblingBlocks' => $blockType->maxSiblingBlocks,
                'maxChildBlocks' => $blockType->maxChildBlocks,
                'childBlocks' => is_string($blockType->childBlocks) ? Json::decodeIfJson($blockType->childBlocks) : $blockType->childBlocks,
                'topLevel' => (bool)$blockType->topLevel,
                'fieldLayout' => $layout,
            ];
        }

        return $blockTypes;
    }

    public function processCloneSuperTable(FieldInterface $originField)
    {
        $blockTypes = [];

        foreach ($originField->blockTypes as $i => $blockType) {
            $fields = [];

            foreach ($blockType->getFields() as $j => $blockField) {
                $fields['new' . $j] = [
                    'type' => get_class($blockField),
                    'name' => $blockField['name'],
                    'handle' => $blockField['handle'],
                    'instructions' => $blockField['instructions'],
                    'required' => (bool)$blockField['required'],
                    'searchable' => (bool)$blockField['searchable'],
                    'translationMethod' => $blockField['translationMethod'],
                    'translationKeyFormat' => $blockField['translationKeyFormat'],
                    'typesettings' => $blockField['settings'],
                ];

                if (get_class($blockField) == 'craft\fields\Matrix') {
                    $fields['new' . $j]['typesettings']['blockTypes'] = $this->processCloneMatrix($blockField);
                }
            }

            $blockTypes['new' . $i] = [
                'fields' => $fields,
            ];
        }

        return $blockTypes;
    }
}
