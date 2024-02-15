<?php

include_once '../Modelos/Empresa.php';
include_once '../Dao/DaoEmpresa.php';
include_once '../Dao/DaoAlumno.php';
include_once '../Modelos/AlumnoBolsa.php';

//Obtenemos la solicitud de la empresa con sus datos
$solicitud = json_decode(file_get_contents('php://input'), true);

//Datos de la Empresa
$empresa = $solicitud['empresa'];
//Criterios para la búsqueda de empleo
$criterios = $solicitud['criterios'];

$daoAlumno = new DaoAlumno();
$daoEmpresa = new DaoEmpresa();

$alumnoCriteria = $daoAlumno->devuelveAlumnoOferta($criterios);


echo $alumnoCriteria;


