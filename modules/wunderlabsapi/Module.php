<?php
namespace modules\wunderlabsapi;

use Craft;
use yii\base\Event;
use craft\web\twig\variables\CraftVariable;


class Module extends \yii\base\Module
{
    public function init()
    {
        // Define a custom alias named after the namespace
        Craft::setAlias('@bar', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'bar\\console\\controllers';
        } else {
            $this->controllerNamespace = 'bar\\controllers';
        }

        parent::init();

        // Register our variables
        Event::on(
            CraftVariable::class,
            CraftVariable::EVENT_INIT,
            function (Event $event) {
                /** @var CraftVariable $variable */
                $variable = $event->sender;
                $variable->set('wul', wunderlabs::class);
            }
        );


        /**
         * ************************************************
         */




    }
}

class wunderlabs
{
    /**
     * Beispiel
     * Aufruf: {{ craft.wul.example(40)  }}
     * @param $id
     * @return string
     */
    public function example($id)
    {
        return 'Ergebnis' .$id;
    }


    /**
     * Nneueren Versionen von Browsern wie dem Internet Explorer, Google Chrome & Co. senden die
     * NOT TRACK-OPTION im Header, diese Option wird mit true oder false zurückgegeben.
     * Aufruf: {{ craft.wul.doNotTrack()  }}
     * @return bool
     */
    public function doNotTrack()
    {
        if (isset($_SERVER['HTTP_DNT']) && $_SERVER['HTTP_DNT'] == 1) {
            $result = true;
        } else {
            $result = false;
        }

        return $result;
    }

    /**
     * Findet:  [[  irgend etwas...  ]]
     * Bereinigt Leerzeichen
     * Ergebnis: [[irgend etwas...]]
     * Aufruf: {{ craft.wul.findReplaceElementRemoveSpaces(myElement) }}
     * @param $element
     * @return mixed
     */
    public function findReplaceElementRemoveSpaces($text)
    {
        $cleanElement = str_replace("[[ ", "[[", $text);
        $cleanElement = str_replace("[[  ", "[[", $cleanElement);
        $cleanElement = str_replace("[[   ", "[[", $cleanElement);
        $cleanElement = str_replace("[[    ", "[[", $cleanElement);
        $cleanElement = str_replace("[[     ", "[[", $cleanElement);

        $cleanElement = str_replace(" ]]", "]]", $cleanElement);
        $cleanElement = str_replace("  ]]", "]]", $cleanElement);
        $cleanElement = str_replace("   ]]", "]]", $cleanElement);
        $cleanElement = str_replace("    ]]", "]]", $cleanElement);
        $cleanElement = str_replace("     ]]", "]]", $cleanElement);

        return $cleanElement;
    }




    /**
     * @param string $phone
     * @param string $class
     * @param string $label
     * @param string $dataName
     * @param string $dataValue
     * @return string
     */

    public function  phone($phone = "", $class = "", $label = "", $dataName = "", $dataValue = "", $onlyNumber = "0") {

        if($phone != ''){
            // Alles bis auf Zahlen herausfiltern
            $href = preg_replace('/[^\d+]+/', '', $phone);

            // Label (0 = kein Inhalt, "" = default, ansonsten eigener Wert)
            if ($label === "0") {
                $label = "";
            } elseif ($label == "") {
                $label = $phone;
            }

            // Attribute setzen & Ausgabe der Telefonnummer
            $setClass = ($class != '')? ' class="'.$class.'"' : '';
            $setData = ($dataName != '' && $dataValue != '')?' data-' . $dataName . '="' . $dataValue . '"' : '';

            if($onlyNumber == '1'){
                return $href;
            } else {

                if($label == ""){
                    return '<a href="tel:'.$href.'" title="Telefon"'. $setClass . $setData .'>';
                } else {
                    return '<a href="tel:'.$href.'" title="Telefon"'. $setClass . $setData .'>'.$label.'</a>';
                }

            }

        } else{
            return '';
        }

    }


    public function  dataConstant($var) {

        if($var == ''){
            return constant("DATA");
        } else {
            define("DATA", $var);
        }

    }

}



