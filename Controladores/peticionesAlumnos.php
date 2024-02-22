<?php
//Donde el tutor obtendrá sus alumnos y toda información acerca de las fcts...
include_once '../Dao/DaoTutor.php';
include_once '../Modelos/Tutor.php';

//lo que hemos obtenido del cliente..
$data = json_decode(file_get_contents('php://input'), true);

//Todos tendrán un modo en las fcts así que va fuera...
$modo = $data['modo'];

$daoT = new DaoTutor();

switch ($modo) {

    case 1:
        $tutor = $data['tutor'];
        //Creamos un objeto en php con lo que nos ha pasado
        $tutorOb = new Tutor($tutor['dni'], $tutor['nombre'], $tutor['apellidos'], $tutor['telefono'], $tutor['email'], $tutor['idCursoT']);
        $alumnos = $daoT->devuelveAlumnosTutor($tutorOb);
        //Devolvemos los alumnos al cliente..
        echo $alumnos;
        break;
    case 2:
        $idCurso = $data['idCurso'];
        $peticiones = $daoT->devuelvePeticiones($idCurso);
        echo $peticiones;
        break;
    case 3:
        $idPeticion = $data['id'];
        $idCurso = $data['idCurso'];
        $alumnosp = $daoT->getAlumnosPorPeticion($idPeticion,$idCurso);
        echo $alumnosp;
        break;
    //Asigna los alumnos a la empresa    
    case 4:
        $cifEmpresa = $data['cif'];
        $alumnos = $data['alumnos'];
        $dniTutor =$data['dniTutor'];
        $mensaje = $daoT->realizarAsignacion($cifEmpresa,$alumnos,$dniTutor);
        echo $mensaje;
        break;
}
