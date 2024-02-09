<?php

include_once '../Dao/DaoEmpresa.php';

//Recogemos lo que nos ha enviado el cliente en este caso el cif de empresa
$datos = json_decode(file_get_contents('php://input',true));

$cifEmpresa = $datos->cif;
$idSolicitud = $datos->id;


$daoEmpresa = new DaoEmpresa();

$alumnos = $daoEmpresa->obtenerAlumnosSolici($cifEmpresa,$idSolicitud);

echo json_encode($alumnos);


















