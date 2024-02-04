<?php 

include_once '../Dao/DaoAlumno.php';

$solicitud = json_decode(file_get_contents('php://input'), true);

$daoAlumn =  new DaoAlumno();

$mensaje = $daoAlumn->insertaTitulo($solicitud['idCurso'],$solicitud['dni']);

echo $mensaje;





