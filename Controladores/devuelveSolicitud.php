<?php

include_once '../Dao/DaoEmpresa.php';

//Obtenemos la solicitud por parte del cliente
$solicitud = json_decode(file_get_contents('php://input'), true);

$cifEmpresa = $solicitud['cif'];

$daoEmpresa = new DaoEmpresa();

$solicitud = $daoEmpresa->obtenerSolicitud($cifEmpresa);

echo json_encode($solicitud);
