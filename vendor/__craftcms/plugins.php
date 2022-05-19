<?php

$vendorDir = dirname(__DIR__);
$rootDir = dirname(dirname(__DIR__));

return array (
  'craftcms/contact-form' => 
  array (
    'class' => 'craft\\contactform\\Plugin',
    'basePath' => $vendorDir . '/craftcms/contact-form/src',
    'handle' => 'contact-form',
    'aliases' => 
    array (
      '@craft/contactform' => $vendorDir . '/craftcms/contact-form/src',
    ),
    'name' => 'Contact Form',
    'version' => '2.2.7',
    'description' => 'Add a simple contact form to your Craft CMS site',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/contact-form/blob/v2/README.md',
    'components' => 
    array (
      'mailer' => 'craft\\contactform\\Mailer',
    ),
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
    'version' => '2.7.0',
    'description' => 'Super-charge your Craft workflow with Super Table. Use it to group fields together or build complex Matrix-in-Matrix solutions.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/super-table',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/super-table/craft-3/CHANGELOG.md',
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
    'version' => '2.8.8',
    'description' => 'Edit rich text content in Craft CMS using Redactor by Imperavi.',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/redactor/blob/v2/README.md',
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
    'version' => '2.6.3',
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
);
