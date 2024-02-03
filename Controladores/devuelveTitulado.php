<?php

include_once '../Dao/Conexion.php';
include_once '../Dao/DaoAlumno.php';

$data = json_decode(file_get_contents('php://input', true));

$cif = $data->cif;

$daoAlum = new DaoAlumno();

//Si el alumno no existe en la bolsa de empleo devolvemos su información para que se cree el formulario con dicha información y
//se puedda registrar el alumno en la bolsa de empleo
if (!$daoAlum->existeAlumnoBolsa($cif)) {
    $alumno = $daoAlum->devuelveAlumno($cif,false);
    echo $alumno;
} else {
    echo json_encode(array("Error" => "Ese alumno ya existe en la bolsa de empleo"));
}
