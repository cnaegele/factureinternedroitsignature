<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
if (isset($_GET['iduniteorg'])) {
    $idUniteOrg = $_GET['iduniteorg'];
    $dbgo = new DBGoeland();
    $dbgo->queryRetJson2("cn_AffFactureInt_dico_employe_signature_liste_par_service $idUniteOrg");
    echo $dbgo->resString;
    unset($dbgo);
} else {
    echo '[]';
}