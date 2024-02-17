<?php
session_start();


include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Modelos/Empresa.php';
include_once '../Modelos/Tutor.php';
include_once '../Dao/DaoUsuario.php';


// Obtén los datos del cuerpo de la solicitud POST
$datos = json_decode(file_get_contents('php://input'), true);

// Extrae el usuario y el rol de los datos
$usuario = $datos['usuario'];
$rol = $datos['rol'];

$daoUser = new DaoUsuario();

//Objecto vacio que pasaremos al dao
$objeto = "";

switch ($rol) {
        //Alumno
    case 1:
        $objeto = new AlumnoBolsa(
            $usuario['nombre'],
            $usuario['apellidos'],
            $usuario['dni'],
            //Como de momento no vamos actulizar ni quitar cursos que ya tenga el alumno lo dejamos así
            null,
            $usuario['email'],
            $usuario['Teléfono'],
            $usuario['residencia'],
            $usuario['posViaje'],
            $usuario["Experiencia Laboral"],
            $usuario['posDis']
        );
        break;
        //Empresas    
    case 2:
        $objeto = new Empresa($usuario['cif'], $usuario['nombre'], $usuario['lugar'], $usuario['telefono'], $usuario['direccion'], $usuario['email']);
        break;
        //Tutor
    case 3:
        $objeto = new Tutor($usuario['dni'],$usuario['nombre'],$usuario['apellidos'],
                                    $usuario['telefono'],$usuario['email'],$usuario['curso']);
        break;

    default:
        break;
}

$mensaje = $daoUser->actualizarUsuarioBolsa($objeto,$rol);

echo $mensaje;
