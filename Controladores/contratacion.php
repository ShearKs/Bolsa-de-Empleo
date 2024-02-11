<?php

include_once '../Dao/DaoEmpresa.php';

//Obtenemos la solicitud por parte del cliente
$solicitud = json_decode(file_get_contents('php://input'), true);

$daoEmpresa = new DaoEmpresa();

//Atributos comunues en todos
$modo = $solicitud['modo'];
$cifEmpresa = $solicitud['cif'];
switch ($modo) {
    case 1:
  
        $solicitud = $daoEmpresa->obtenerSolicitud($cifEmpresa);
        echo $solicitud;
        break;
    case 2:
       
        $idSolicitud = $solicitud['id'];
        $alumnos = $daoEmpresa->obtenerAlumnosSolici($cifEmpresa, $idSolicitud);
        echo $alumnos;
        break;

    case 3:
        $alumno = $solicitud['alumno'];
        $mensaje = $daoEmpresa->realizarContratacion($alumno,$cifEmpresa);
        echo $mensaje;
        break;    
    default:
        echo json_encode(array("Error" => "No ha habido ningún modo asignado en contratación..."));
}
