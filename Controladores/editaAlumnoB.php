<?php
session_start();

include_once '../Dao/DaoAlumno.php';
include_once '../Modelos/AlumnoBolsa.php';


//Obtenemos todo del formulario desde el js
$datos = json_decode(file_get_contents('php://input'), true);

$idCurso = (int)$datos['idCurso'];

//Creamos el objeto Alumno Bolsa
$alumnoBolsa = new AlumnoBolsa(
    $datos['nombre'],
    $datos['apellidos'],
    $_SESSION['dni'],
    $idCurso,
    $datos['email'],
    $datos['Teléfono'],
    $datos['Experiencia Laboral']
);

$daoAlum = new DaoAlumno();




if ($daoAlum->actualizaAlumno($alumnoBolsa, true)) {
    echo json_encode(array('Exito' => 'La información ha sido modificada correctamente'));
} else {
    echo json_encode(array('Error' => 'Ha habido algún problema al modificar el alumno...'));
}
