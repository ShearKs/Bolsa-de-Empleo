<?php

include_once '../Dao/DaoEmpresa.php';


$daoEmpresa = new DaoEmpresa();

$camposEmpres = $daoEmpresa->devuelveCampos();

echo json_encode($camposEmpres);





