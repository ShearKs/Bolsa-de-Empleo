<?php

include_once '../Dao/DaoEmpresa.php';

$daoEmpresa = new DaoEmpresa();

$modalidades = $daoEmpresa->devuleveModalidadFCT();

echo $modalidades;
