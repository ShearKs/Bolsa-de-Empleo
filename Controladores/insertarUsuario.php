<?php

include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Dao/DaoAlumno.php';


//Obtenemos todo del formulario desde el js
$alumnoJs = json_decode(file_get_contents('php://input'),true);

$nombreUser = $alumnoJs['usuario'];

//Creamos el objeto alumno
$alumnoB = new AlumnoBolsa($alumnoJs['nombre'],$alumnoJs['apellidos'],$alumnoJs['dni'],
            $alumnoJs['curso'],$alumnoJs['email'],$alumnoJs['telefono'],$alumnoJs['residencia'],$alumnoJs['posViajar']
            //Como estamos dando de alta aal alumno le ponemos la disponibilildad a true
            ,$alumnoJs['experienciaLaboral'],true);

$daoAlumno = new DaoAlumno();

$mensaje = $daoAlumno->insertarAlumno($alumnoB,$nombreUser,1);

echo $mensaje;




