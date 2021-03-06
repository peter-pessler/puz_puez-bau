<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\helpers;

/**
 * Class Path
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0.0
 */
class Path
{
    /**
     * Ensures that a relative path never goes deeper than its root directory.
     *
     * @param string $path
     * @return bool
     */
    public static function ensurePathIsContained(string $path): bool
    {
        // Sanitize
        $path = StringHelper::convertToUtf8($path);

        $segs = ArrayHelper::filterEmptyStringsFromArray(preg_split('/[\\/\\\\]/', $path));
        $level = 0;

        foreach ($segs as $seg) {
            if ($seg === '..') {
                $level--;
            } elseif ($seg !== '.') {
                $level++;
            }

            if ($level < 0) {
                return false;
            }
        }

        return true;
    }
}
