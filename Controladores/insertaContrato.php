<?php 

include_once '../Dao/DaoEmpresa.php';

//Alumno seleccionado para hacerle un contrato
$alumnoContrato = json_decode(file_get_contents('php://input'),true);

$alumno = $alumnoContrato['alumno'];
$cifEmpresa = $alumnoContrato['cif'];

$daoEmpresa = new DaoEmpresa();

$mensaje = $daoEmpresa->realizarContratacion($alumno,$cifEmpresa);

echo $mensaje;










