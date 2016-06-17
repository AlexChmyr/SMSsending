<?php

require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule("crm");

//define("LOG_FILENAME", $_SERVER["DOCUMENT_ROOT"]."/log.txt");

if(isset($_POST['phone'])){

    try {

        $client = new SoapClient('http://turbosms.in.ua/api/wsdl.html');

        $auth = [
            'login' => 'CLIENT',
            'password' => 'client2016'
        ];

        // авторизация
        $authResult = $client->Auth($auth);
        $text = $_POST['text'];

        $sms = [
            'sender' => 'CLIENT.com.ua',
            'destination' => '+'.$phone,
            'text' => $text
        ];

        // Отправка СМС
        $result = $client->SendSMS($sms);

        if(is_array($result->SendSMSResult->ResultArray)){

            echo $result->SendSMSResult->ResultArray[0];

            // регистрация события отправки СМС
            if(!empty($_POST['entity'])){
                $arEntity = array(
                    'lead' => '1',
                    'deal' => '2',
                    'contact' => '3',
                );
                if(!empty($arEntity[$_POST['entity']])){
                    $now = date("Y-m-d H:i:s");
                    $activityFields = array(
                        'TYPE_ID' => 4,
                        'SUBJECT' => 'SMS',
                        'COMPLETED' => 'N',
                        'PRIORITY' => CCrmActivityPriority::Medium,
                        'DESCRIPTION' => $text,
                        'DESCRIPTION_TYPE' => CCrmContentType::PlainText,
                        'LOCATION' => '',
                        'DIRECTION' => CCrmActivityDirection::Outgoing,
                        'NOTIFY_TYPE' => CCrmActivityNotifyType::None,
                        'SETTINGS' => array(),
                        'STORAGE_TYPE_ID' => CCrmActivity::GetDefaultStorageTypeID(),
                        'START_TIME' => $now,
                        'END_TIME' => $now,
                        'OWNER_ID' => intval($_POST['id']),
                        'OWNER_TYPE_ID' => $arEntity[$_POST['entity']],
                        'RESPONSIBLE_ID' => $USER->GetID(),
                        // 'BINDINGS' => '',
                    );
                    $callId = CCrmActivity::Add($activityFields, false, true, array('REGISTER_SONET_EVENT' => true));
                }
            }
        }

    }
    catch(Exception $e) {
        echo 'Ошибка: ' . $e->getMessage() . PHP_EOL;
    }

}

?>
