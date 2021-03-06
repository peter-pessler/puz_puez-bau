<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\fields\data;

use craft\base\Serializable;
use yii\base\BaseObject;

/**
 * Multi-select option field data class.
 *
 * @property string $hex
 * @property string $rgb
 * @property int $red
 * @property int $green
 * @property int $blue
 * @property int $r
 * @property int $g
 * @property int $b
 * @property float $luma
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @author Top Shelf Craft <michael@michaelrog.com>
 * @since 3.0.0
 */
class ColorData extends BaseObject implements Serializable
{
    /**
     * @var string The color’s hex value
     */
    private $_hex;

    /**
     * @var array<int, int, int>
     * @see _hsl()
     */
    private $_hsl;

    /**
     * Constructor.
     *
     * @param string $hex hex color value, beginning with `#`. (Shorthand is not supported, e.g. `#f00`.)
     * @param array $config name-value pairs that will be used to initialize the object properties
     */
    public function __construct(string $hex, array $config = [])
    {
        $this->_hex = $hex;
        parent::__construct($config);
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->_hex;
    }

    /**
     * @inheritdoc
     */
    public function serialize()
    {
        return $this->_hex;
    }

    /**
     * Returns the color as a hex.
     *
     * @return string
     */
    public function getHex(): string
    {
        return $this->_hex;
    }

    /**
     * Returns the color in `rgb()` syntax.
     *
     * @return string
     */
    public function getRgb(): string
    {
        return "rgb({$this->getRed()},{$this->getGreen()},{$this->getBlue()})";
    }

    /**
     * Returns the color in `hsl()` syntax.
     *
     * @return string
     * @since 3.7.26
     */
    public function getHsl(): string
    {
        [$h, $s, $l] = $this->_hsl();
        return "hsl($h,$s%,$l%)";
    }

    /**
     * @return int
     */
    public function getRed(): int
    {
        return hexdec(substr($this->_hex, 1, 2));
    }

    /**
     * @return int
     */
    public function getR(): int
    {
        return $this->getRed();
    }

    /**
     * @return int
     */
    public function getGreen(): int
    {
        return hexdec(substr($this->_hex, 3, 2));
    }

    /**
     * @return int
     */
    public function getG(): int
    {
        return $this->getGreen();
    }

    /**
     * @return int
     */
    public function getBlue(): int
    {
        return hexdec(substr($this->_hex, 5, 2));
    }

    /**
     * @return int
     */
    public function getB(): int
    {
        return $this->getBlue();
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getHue(): int
    {
        return $this->_hsl()[0];
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getH(): int
    {
        return $this->getHue();
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getSaturation(): int
    {
        return $this->_hsl()[1];
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getS(): int
    {
        return $this->getSaturation();
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getLightness(): int
    {
        return $this->_hsl()[2];
    }

    /**
     * @return int
     * @since 3.7.26
     */
    public function getL(): int
    {
        return $this->getLightness();
    }

    /**
     * @return array<int, int, int>
     */
    private function _hsl(): array
    {
        if (!isset($this->_hsl)) {
            // h/t https://stackoverflow.com/a/13887939/1688568
            $rPct = $this->getRed() / 255;
            $gPct = $this->getGreen() / 255;
            $bPct = $this->getBlue() / 255;

            $maxRgb = max($rPct, $gPct, $bPct);
            $minRgb = min($rPct, $gPct, $bPct);
            $chroma = $maxRgb - $minRgb;

            if ($chroma !== 0) {
                if ($rPct === $minRgb) {
                    $h = 3 - (($gPct - $bPct) / $chroma);
                } else if ($bPct === $minRgb) {
                    $h = 1 - (($rPct - $gPct) / $chroma);
                } else {
                    $h = 5 - (($bPct - $rPct) / $chroma);
                }
                $h = round($h * 60);
                if ($h === 360) {
                    $h = 0;
                }

                $s = round(100 * ($chroma / $maxRgb));
            } else {
                $h = $s = 0;
            }

            $this->_hsl = [$h, $s, round(100 * $maxRgb)];
        }

        return $this->_hsl;
    }

    /**
     * Get brightness of an image. Values closer to 0 are darker, closer to 1 are lighter.
     *
     * @see http://stackoverflow.com/a/12228906/1136822 Stack Overflow answer.
     * @see https://en.wikipedia.org/wiki/Luma_(video) Luma
     * @return float
     */
    public function getLuma(): float
    {
        return (0.2126 * $this->getRed() + 0.7152 * $this->getGreen() + 0.0722 * $this->getBlue()) / 255;
    }
}
