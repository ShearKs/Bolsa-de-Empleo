<?php

include_once '../Dao/DaoEmpresa.php';


//Obetenemos del cliente los alumnos que han sido ofertados para la bolsa de empleo
$data = json_decode(file_get_contents('php://input'), true);

$alumnos = $data['alumnos'];
$empresa = $data['empresa'];

$daoEmpresa = new DaoEmpresa();

$mensaje = $daoEmpresa->realizarSolicitud($alumnos,$empresa);


echo json_encode($mensaje);



