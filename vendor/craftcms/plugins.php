<?php

$vendorDir = dirname(__DIR__);
$rootDir = dirname(dirname(__DIR__));

return array (
  'carlcs/craft-redactorcustomstyles' => 
  array (
    'class' => 'carlcs\\redactorcustomstyles\\Plugin',
    'basePath' => $vendorDir . '/carlcs/craft-redactorcustomstyles/src',
    'handle' => 'redactor-custom-styles',
    'aliases' => 
    array (
      '@carlcs/redactorcustomstyles' => $vendorDir . '/carlcs/craft-redactorcustomstyles/src',
    ),
    'name' => 'Redactor Custom Styles',
    'version' => '3.0.4',
    'description' => 'Redactor Custom Styles plugin for Craft CMS',
    'developer' => 'carlcs',
    'developerUrl' => 'https://github.com/carlcs',
    'documentationUrl' => 'https://github.com/carlcs/craft-redactorcustomstyles',
    'changelogUrl' => 'https://github.com/carlcs/craft-redactorcustomstyles/raw/v3/CHANGELOG.md',
    'downloadUrl' => 'https://github.com/carlcs/craft-redactorcustomstyles/archive/v3.zip',
  ),
  'ether/seo' => 
  array (
    'class' => 'ether\\seo\\Seo',
    'basePath' => $vendorDir . '/ether/seo/src',
    'handle' => 'seo',
    'aliases' => 
    array (
      '@ether/seo' => $vendorDir . '/ether/seo/src',
    ),
    'name' => 'SEO',
    'version' => '3.7.4',
    'description' => 'SEO utilities including a unique field type, sitemap, & redirect manager',
    'developer' => 'Ether Creative',
    'developerUrl' => 'https://ethercreative.co.uk',
    'documentationUrl' => 'https://github.com/ethercreative/seo/blob/v3/README.md',
  ),
  'sebastianlenz/linkfield' => 
  array (
    'class' => 'typedlinkfield\\Plugin',
    'basePath' => $vendorDir . '/sebastianlenz/linkfield/src',
    'handle' => 'typedlinkfield',
    'aliases' => 
    array (
      '@typedlinkfield' => $vendorDir . '/sebastianlenz/linkfield/src',
    ),
    'name' => 'Typed link field',
    'version' => '1.0.25',
    'description' => 'A Craft field type for selecting links',
    'developer' => 'Sebastian Lenz',
    'developerUrl' => 'https://github.com/sebastian-lenz/',
  ),
  'verbb/cp-nav' => 
  array (
    'class' => 'verbb\\cpnav\\CpNav',
    'basePath' => $vendorDir . '/verbb/cp-nav/src',
    'handle' => 'cp-nav',
    'aliases' => 
    array (
      '@verbb/cpnav' => $vendorDir . '/verbb/cp-nav/src',
    ),
    'name' => 'Control Panel Nav',
    'version' => '3.0.17',
    'description' => 'Control Panel Nav helps you managing your Control Panel navigation.',
    'developer' => 'Verbb',
    'developerUrl' => 'http://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/cp-nav',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/cp-nav/craft-3/CHANGELOG.md',
  ),
  'verbb/redactor-tweaks' => 
  array (
    'class' => 'verbb\\redactortweaks\\RedactorTweaks',
    'basePath' => $vendorDir . '/verbb/redactor-tweaks/src',
    'handle' => 'redactor-tweaks',
    'aliases' => 
    array (
      '@verbb/redactortweaks' => $vendorDir . '/verbb/redactor-tweaks/src',
    ),
    'name' => 'Redactor Tweaks',
    'version' => '2.0.4',
    'description' => 'A small Craft CMS plugin that provides some tweaks to the default Redactor II Rich Text fieldtype.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/redactor-tweaks',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/redactor-tweaks/craft-3/CHANGELOG.md',
  ),
  'ttempleton/craft-category-groups-field' => 
  array (
    'class' => 'ttempleton\\categorygroupsfield\\Plugin',
    'basePath' => $vendorDir . '/ttempleton/craft-category-groups-field/src',
    'handle' => 'category-groups-field',
    'aliases' => 
    array (
      '@ttempleton/categorygroupsfield' => $vendorDir . '/ttempleton/craft-category-groups-field/src',
    ),
    'name' => 'Category Groups Field',
    'version' => '1.3.0',
    'description' => 'A Craft CMS field type for selecting category groups',
    'developer' => 'Thomas Templeton',
    'developerUrl' => 'https://github.com/ttempleton',
    'changelogUrl' => 'https://github.com/ttempleton/craft-category-groups-field/blob/main/CHANGELOG.md',
    'downloadUrl' => 'https://github.com/ttempleton/craft-category-groups-field/archive/main.zip',
  ),
  'topshelfcraft/supersort' => 
  array (
    'class' => 'topshelfcraft\\supersort\\SuperSort',
    'basePath' => $vendorDir . '/topshelfcraft/supersort/src',
    'handle' => 'supersort',
    'aliases' => 
    array (
      '@topshelfcraft/supersort' => $vendorDir . '/topshelfcraft/supersort/src',
    ),
    'name' => 'SuperSort',
    'version' => '3.1.0',
    'description' => '...a super-duper sorting function for your Craft templates.',
    'developer' => 'Top Shelf Craft (Michael Rog)',
    'developerUrl' => 'https://topshelfcraft.com',
    'documentationUrl' => 'https://github.com/TopShelfCraft/SuperSort',
    'changelogUrl' => 'https://github.com/TopShelfCraft/SuperSort/raw/master/CHANGELOG.md',
  ),
  'ether/tags' => 
  array (
    'class' => 'ether\\tagManager\\TagManager',
    'basePath' => $vendorDir . '/ether/tags/src',
    'handle' => 'tag-manager',
    'aliases' => 
    array (
      '@ether/tagManager' => $vendorDir . '/ether/tags/src',
    ),
    'name' => 'Tags',
    'version' => '1.0.9',
    'description' => 'A tag manager for Craft 3',
    'developer' => 'Ether Creative',
    'developerUrl' => 'https://ethercreative.co.uk',
    'documentationUrl' => 'https://github.com/ethercreative/tags/blob/master/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/ethercreative/tags/master/CHANGELOG.md',
  ),
  'verbb/field-manager' => 
  array (
    'class' => 'verbb\\fieldmanager\\FieldManager',
    'basePath' => $vendorDir . '/verbb/field-manager/src',
    'handle' => 'field-manager',
    'aliases' => 
    array (
      '@verbb/fieldmanager' => $vendorDir . '/verbb/field-manager/src',
    ),
    'name' => 'Field Manager',
    'version' => '2.2.4',
    'description' => 'Manage your fields and field groups with ease with simple field or group cloning and quicker overall management.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/field-manager',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/field-manager/craft-3/CHANGELOG.md',
  ),
  'xpertbot/craft-wheelform' => 
  array (
    'class' => 'wheelform\\Plugin',
    'basePath' => $vendorDir . '/xpertbot/craft-wheelform/src',
    'handle' => 'wheelform',
    'aliases' => 
    array (
      '@wheelform' => $vendorDir . '/xpertbot/craft-wheelform/src',
    ),
    'name' => 'Wheel Form',
    'version' => '2.7.2',
    'description' => 'Craft CMS 3 Form administrator with Database integration',
    'developer' => 'Wheel Interactive',
    'developerUrl' => 'https://wheelinteractive.com',
    'documentationUrl' => 'https://github.com/xpertbot/craft-wheelform/blob/master/README.md',
    'changelogUrl' => 'https://github.com/xpertbot/craft-wheelform/CHANGELOG.md',
    'hasCpSettings' => true,
    'hasCpSection' => true,
    'components' => 
    array (
      'mailer' => 'Wheelform\\Mailer',
    ),
  ),
  'verbb/smith' => 
  array (
    'class' => 'verbb\\smith\\Smith',
    'basePath' => $vendorDir . '/verbb/smith/src',
    'handle' => 'smith',
    'aliases' => 
    array (
      '@verbb/smith' => $vendorDir . '/verbb/smith/src',
    ),
    'name' => 'Smith',
    'version' => '1.2.3',
    'description' => 'Add copy, paste and clone functionality to Matrix blocks.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/smith',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/smith/craft-3/CHANGELOG.md',
  ),
  'craftcms/redactor' => 
  array (
    'class' => 'craft\\redactor\\Plugin',
    'basePath' => $vendorDir . '/craftcms/redactor/src',
    'handle' => 'redactor',
    'aliases' => 
    array (
      '@craft/redactor' => $vendorDir . '/craftcms/redactor/src',
    ),
    'name' => 'Redactor',
    'version' => '2.10.8',
    'description' => 'Edit rich text content in Craft CMS using Redactor by Imperavi.',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/redactor/blob/v2/README.md',
  ),
  'mmikkel/child-me' => 
  array (
    'class' => 'mmikkel\\childme\\ChildMe',
    'basePath' => $vendorDir . '/mmikkel/child-me/src',
    'handle' => 'child-me',
    'aliases' => 
    array (
      '@mmikkel/childme' => $vendorDir . '/mmikkel/child-me/src',
    ),
    'name' => 'Child Me!',
    'version' => '1.3.1',
    'schemaVersion' => '1.0.0',
    'description' => 'Easily create child elements',
    'developer' => 'Mats Mikkel Rummelhoff',
    'developerUrl' => 'https://vaersaagod.no',
    'documentationUrl' => 'https://github.com/mmikkel/ChildMe-Craft/blob/master/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/mmikkel/ChildMe-Craft/master/CHANGELOG.md',
    'hasCpSettings' => false,
    'hasCpSection' => false,
  ),
  'verbb/super-table' => 
  array (
    'class' => 'verbb\\supertable\\SuperTable',
    'basePath' => $vendorDir . '/verbb/super-table/src',
    'handle' => 'super-table',
    'aliases' => 
    array (
      '@verbb/supertable' => $vendorDir . '/verbb/super-table/src',
    ),
    'name' => 'Super Table',
    'version' => '2.7.2',
    'description' => 'Super-charge your Craft workflow with Super Table. Use it to group fields together or build complex Matrix-in-Matrix solutions.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/super-table',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/super-table/craft-3/CHANGELOG.md',
  ),
  'topshelfcraft/wordsmith' => 
  array (
    'class' => 'topshelfcraft\\wordsmith\\Wordsmith',
    'basePath' => $vendorDir . '/topshelfcraft/wordsmith/src',
    'handle' => 'wordsmith',
    'aliases' => 
    array (
      '@topshelfcraft/wordsmith' => $vendorDir . '/topshelfcraft/wordsmith/src',
    ),
    'name' => 'Wordsmith',
    'version' => '3.3.1.1',
    'schemaVersion' => '0.0.0.0',
    'description' => '...because you have the best words.',
    'developer' => 'Michael Rog',
    'developerUrl' => 'https://topshelfcraft.com',
    'documentationUrl' => 'https://wordsmith.docs.topshelfcraft.com/',
    'changelogUrl' => 'https://raw.githubusercontent.com/topshelfcraft/wordsmith/master/CHANGELOG.md',
  ),
);
