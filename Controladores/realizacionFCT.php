<?php

include_once '../Dao/DaoEmpresa.php';

$solicitud = json_decode(file_get_contents('php://input'), true);

$modo = $solicitud['modo'];

$daoEmpresa = new DaoEmpresa();

//Según que modo tendrá una distinta funcionalidad
switch ($modo) {
    case 1:
        $modalidades = $daoEmpresa->devuleveModalidadFCT();
        echo $modalidades;
        break;
    case 2:

        //Vemos que alumnos cumplen con
        $tipoFct = $solicitud['tipo'];
        $alumnosFct = $daoEmpresa->alumnosModalidadFct($tipoFct);
        echo $alumnosFct;
    case 3:
        break;

    default:
        echo json_encode(array('Error' => "No se ha asignado ningun modo para la funcionalidad de Fcts"));
        break;
}
