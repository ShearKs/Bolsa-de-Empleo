<?php

include_once '../Dao/DaoEmpresa.php';
include_once '../Modelos/Empresa.php';

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
        //En este modo nos encargamos de obtener los alumnos de la modalidad seleccionada
        $tipoFct = $solicitud['tipo'];
        $alumnosFct = $daoEmpresa->alumnosModalidadFct($tipoFct);
        echo $alumnosFct;
        break;
    case 3:
        $alumnos = $solicitud['alumnos'];   
        $tipoPeticion = $solicitud['tipo']; 
        $empresa = $solicitud['empresa'];
        $empresaOb = new Empresa($empresa['cif'],$empresa['nombre'],$empresa['lugar'],$empresa['telefono'],$empresa['direccion']
                    ,$empresa['email'],$empresa['usuario']);
        $mensaje = $daoEmpresa->realizarPeticion($alumnos,$tipoPeticion,$empresaOb);
        echo $mensaje;
        break;
    default:
        echo json_encode(array('Error' => "No se ha asignado ningun modo para la funcionalidad de Fcts"));
        break;
}
