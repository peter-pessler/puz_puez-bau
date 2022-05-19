<?php
session_start();
$api_url           = "www.staffITproCloudDemo.de/staffITproWebApi/";
$_SESSION["token"] = GetToken();

function GetToken()
{
    GLOBAL $api_url;

    $authString = sprintf('SIP sip_username=%s sip_password=%s sip_database=%s app_key=%s',
        "TEP", //Username
        "SIP*2009T", //Password
        "staffITproWebApiDemo", //Database
        "462EA3BCFD95444AB4C7B0C4B87EE2252B778E0065AE453C969383D2281F45036FC3B69D044F4997A23F9D1DF96BFF327E23910200E3474C899335E01F1A9EF9"); //App GUID

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $api_url . 'Token/');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array(
        'AppliesTo' => $api_url,
        'TokenType' => "http://staffITpro.com/tokens/staffITproSecurityToken/type"
    )));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: ' . $authString
    ));

    $result = json_decode(curl_exec($ch));
    if (curl_errno($ch)) {
        return curl_error($ch);
    }
    curl_close($ch);

    if (isset($result->TokenId)) {
        return $result->TokenId;
    } else {
        return $result;
    }
}


function CandidateCount()
{
    GLOBAL $api_url;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $api_url . 'Candidate/count');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: SIP sip_token='.$_SESSION['token'] //Token required
    ));
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

echo GetToken();

echo '<br />';

echo CandidateCount();



$simple = "<para><note>simple note</note></para>";
$p = xml_parser_create();
xml_parse_into_struct($p, $simple, $vals, $index);
xml_parser_free($p);
echo "Index array\n";
print_r($index);
echo "\nVals array\n";
print_r($vals);
?>

?>