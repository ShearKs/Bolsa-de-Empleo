<?php

include_once '../Dao/DaoEmpresa.php';

//Obtenemos la solicitud por parte del cliente
$solicitud = json_decode(file_get_contents('php://input'), true);

$daoEmpresa = new DaoEmpresa();

$modo = $solicitud['modo'];

switch ($modo) {
    case 1:
        $cifEmpresa = $solicitud['cif'];
        $solicitud = $daoEmpresa->obtenerSolicitud($cifEmpresa);
        echo $solicitud;
        break;
    case 2:
        $cifEmpresa = $solicitud['cif'];
        $idSolicitud = $solicitud['id'];
        $alumnos = $daoEmpresa->obtenerAlumnosSolici($cifEmpresa, $idSolicitud);
        echo $alumnos;
        break;
    default:
        echo json_encode(array("Error" => "No ha habido ningún modo asignado en contratación..."));
}
