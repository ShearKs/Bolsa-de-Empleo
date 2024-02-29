<?php

include_once '../Dao/DaoEmpresa.php';

$data = json_decode(file_get_contents('php://input'),true);

$cif = $data['cif'];

$daoEmpresa = new DaoEmpresa();

$camposEmpres = $daoEmpresa->devuelveCampos($cif);

echo $camposEmpres;





