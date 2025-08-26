<?php
require 'gdt/gautentificationf5.php';
require_once '/data/dataweb/GoelandWeb/webservice/employe/clCNWSEmployeSecurite.php';
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:  *");
header("Access-Control-Allow-Methods:  POST");
$idCaller = 0;
if (array_key_exists('empid', $_SESSION)) {
    $idCaller = $_SESSION['empid'];
}
if ($idCaller > 0) {
    $pseudoWSEmployeSecurite = new CNWSEmployeSecurite();
    if ($pseudoWSEmployeSecurite->isInGroupe($idCaller, 'AffFactureIntGestionDroitsSignature')) {
        $jsonData = file_get_contents('php://input');
        $oData = json_decode($jsonData);
        $idOrgunit = $oData->idorgunit;
        $idEmploye = $oData->idemploye;
        $sSql = "cn_AffFactureInt_dico_employe_signature_sauve $idEmploye, $idOrgunit, NULL, NULL";
        $dbgo = new DBGoeland();
        $dbgo->queryRetNothing($sSql, 'W');
        unset($dbgo);
        echo '{"message":"ok"}';
    } else {
        echo '{"message":"ERREUR GoelandManager requis"}';
    }
} else {
    echo '{"message":"ERREUR athentification F5"}';
}
