<?php

require_once($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule("iblock");

if(isset($_POST['infoType'])){

    // идентификатор инфоблока с шаблонами и свойства с текстом шабона указать здесь
    $IBlocID = 41;
    $propID = 166;

    $infoType = $_POST['infoType'];
    $arFilter = Array("IBLOCK_ID"=>$IBlocID);
    $result = CIBlockElement::GetList(Array(), $arFilter, false, array("nPageSize"=>999));

    if($infoType === 'contents'){
        echo '<span name = "snippers" style="display: none">';
    }

    while($snipper = $result->GetNextElement()) {

        $arFields = $snipper->GetFields();
        $name = preg_replace('/[^a-zA-Zа-яА-Я0-9]/ui', '',$arFields['NAME']);

        // это заголовки щаблонов
        if($infoType === 'labels'){
            echo '<option value="'.$name.'">'.$arFields['NAME'].'</option>';
        }
        // это тексты щаблонов
        elseif($infoType === 'contents'){

            $id = $arFields['ID'];
            $db_props = CIBlockElement::GetProperty($IBlocID,$id,"sort","asc",array());
            while($snipper_props = $db_props->Fetch()){
                if($snipper_props['ID'] === $propID){
                    echo '<span snpname = "'.$name.'" style="display: none" >'.$snipper_props['VALUE'].'</span>';
                }
            }
        }
    }

    if($infoType === 'contents'){
        echo '</span>';
    }
}

?>