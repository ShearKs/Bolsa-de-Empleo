<?php

include_once 'Conexion.php';
include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Modelos/Usuario.php';
include_once '../Modelos/Utilidades.php';


class DaoAlumno
{

    private $conexion;
    private $utils;


    public function __construct()
    {
        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    //Función que comprueba si el alumno está en la bolsa de empleo
    public function existeAlumnoBolsa($cif)
    {


        $sql = "SELECT * FROM Alumno_Bolsa WHERE  dni = ?";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $cif);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        if ($estado && $resultado->num_rows == 1) {
            return true;
        }

        return false;
    }



    public function devuelveAlumno($dni, $esbolsa)
    {
        $sql = "SELECT alu.dni, alu.nombre, apellidos, email, telefono, cur.nombre as 'curso'";
        $sql .= $esbolsa ? ", idCurso, expLaboral as 'Experiencia Laboral', telefono as 'Teléfono', usu.nombre as 'usuario'" : "";
        $sql .= " FROM alumnoies alu";
        $sql .= " JOIN cursa_alumn c ON alu.dni = c.dniAlum";
        $sql .= " JOIN curso cur ON c.idCurso = cur.id";
        $sql .= $esbolsa ? " LEFT JOIN alumno_bolsa b ON alu.dni = b.dni" : "";
        $sql .= $esbolsa ? " LEFT JOIN usuario usu ON b.idUsuario = usu.id" : "";
        $sql .= " WHERE alu.dni = ?";
        $sql .= " GROUP BY alu.dni";


        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $dni);
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        if ($resultado->num_rows == 1 && $estado != null) {
            $alumno = $resultado->fetch_assoc();
            return json_encode($alumno);
        } else {
            return json_encode(array("Error" => "No se encuentra ese alumno en la base de datos"));
        }
    }

    private function insertarUsuario(Usuario $usuario)
    {

        $usuarioNombre = $usuario->getNombreUsuario();
        $contrasena = $usuario->getContrasena();
        $rol = $usuario->getRol();

        $contrasenaEncriptada = password_hash($contrasena, PASSWORD_BCRYPT);

        $sql = "INSERT INTO usuario(nombre,contrasena,rol) VALUES (?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ssd", $usuarioNombre, $contrasenaEncriptada,$rol);
        $estado = $sentencia->execute();

        $idUsuario = -1;

        if ($estado) {

            //Se se ha hecho bien el insertado obtenemos el id del usuario
            $idUsuario = $this->conexion->insert_id;

            //Y lo devolvemos
            return $idUsuario;
        }

        return $idUsuario;
    }

    private function introducirCamposBdd(AlumnoBolsa $alumnoB, $idUsuario)
    {

        //Todos los campos pasados
        $dni = $alumnoB->getDni();
        $expLaboral = $alumnoB->getExperiencia();
        $residencia = $alumnoB->getResidencia();
        $posViajar = $alumnoB->getPosViajar();
        $disponibilidad = $alumnoB->getDisponibilidad();

        $sql = "INSERT INTO Alumno_Bolsa (dni,expLaboral,otraResidencia,posiViajar,disponibilidad,idUsuario)
                    VALUES (?,?,?,?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("sssddd", $dni, $expLaboral,$residencia,$posViajar  ,$disponibilidad  , $idUsuario);
        $estado = $sentencia->execute();

        return $estado;
    }


    public function insertarAlumno(AlumnoBolsa $alumno, $nombreUsuario,$rol)
    {
        // Obtén todos los campos pasados
        $dni = $alumno->getDni();
        $nombre = $alumno->getNombre();
        $apellidos = $alumno->getApellidos();
        $idCurso = $alumno->getIdUsuario();
        $email = $alumno->getEmail();


        //Le generamos al usuario una contraseña de forma aleatoria
        $contrasena = $this->utils->generarContrasenaAle();

        // Iniciamos una transacción
        $this->conexion->autocommit(false);

        if (!$this->existeUsuario($nombreUsuario)) {

            //Creamos el objeto usuario
            $usuario = new Usuario($nombreUsuario, $contrasena,$rol);

            $idUsuario = $this->insertarUsuario($usuario);

            if ($idUsuario != -1) {

                // Actualizamos la información del alumno,incluido el nombre del curso si lo quiere
                // Si se ha hecho bien la actualización llamamos a la función de insertarUsuario
                if ($this->actualizaAlumno($alumno, false)) {

                    if ($this->introducirCamposBdd($alumno, $idUsuario)) {

                        $mensaje = "Es es tu usuario y contraseña ,usuario: " . $nombreUsuario . " y tu contraseña: " . $contrasena;

                        $this->utils->enviarCorreo($email, $mensaje);
                        $this->conexion->commit();
                        return json_encode(array("Exito" => "Se ha registrado correctamente el usuario en la bolsa de empleo"));
                    } else {
                        return json_encode(array("Error" => "No se ha podido insertar el alumno en la bolsa"));
                    }
                } else {
                    return json_encode(array("Error" => "Ha habido un problema al actualizar la información del alumno"));
                }
            } else {
                return json_encode(array("Error" => "Ha habido un problema al insertar el usuario"));
            }
        } else {
            return json_encode(array("Error" => "Ya existe un usuario con ese nombre en la base de datos"));
        }
    }

    public function actualizaAlumno(AlumnoBolsa $alumno, $esbolsa)
    {

        //Obtenemos los campos pasados
        $dni = $alumno->getDni();
        $nombre = $alumno->getNombre();
        $apellidos = $alumno->getApellidos();
        $idCurso = $alumno->getCurso();
        $email = $alumno->getEmail();
        $expLaboral = $alumno->getExperiencia();
        $telefono = $alumno->getTelefono();

        $sql = "UPDATE AlumnoIES a JOIN Cursa_Alumn ca ON a.dni = ca.dniAlum ";
        $sql .= $esbolsa ? "JOIN alumno_bolsa ab ON a.dni = ab.dni " : "";
        $sql .= "SET 
                    a.nombre = ?,
                    a.apellidos = ?,
                    a.email = ?,
                    a.telefono = ?,
                    ca.idCurso = ? ";
        $sql .= $esbolsa ? " ,ab.expLaboral = ? " :  "";
        $sql .= " WHERE a.dni = ? ";

        $sentencia = $this->conexion->prepare($sql);
        if ($esbolsa) {
            $sentencia->bind_param("sssddss", $nombre, $apellidos, $email, $telefono, $idCurso, $expLaboral, $dni);
        } else {
            $sentencia->bind_param("sssdds", $nombre, $apellidos, $email, $telefono, $idCurso, $dni);
        }


        $estado = $sentencia->execute();
        if ($estado) {
            $this->conexion->commit();
            return true;
        }
        return false;
    }

    //Función que comprueba si el nombre que has introducido ya existía en la base de datos
    public function existeUsuario($nombre)
    {

        $sql = "SELECT nombre FROM usuario where nombre = ? ";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $nombre);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        //Si existe retorna true
        if ($estado && $resultado->num_rows == 1) {
            return true;
        }

        return false;
    }


    public function devuelveCursos($modo)
    {
        // Información de todos los cursos que vamos a devolver
        $cursos = array();

        switch ($modo) {
            case 1:
                // Modo 1: Incluye información adicional
                $sql = "SELECT id, nombre FROM curso WHERE nombreCentroEstudio = 'Ies Leonardo Da Vinci' ORDER BY id;";
                break;
            case 2:
                // Modo 2: Otra consulta específica
                $sql = "SELECT id, nombre FROM curso WHERE nombreCentroEstudio != 'Ies Leonardo Da Vinci' ORDER BY id;";
                break;
                // Puedes agregar más casos según sea necesario
            default:
                // Modo por defecto o manejo de errores
                $sql = "SELECT id, nombre FROM curso WHERE nombreCentroEstudio = 'Ies Leonardo Da Vinci' ORDER BY id;";
                break;
        }

        $resultado = $this->conexion->query($sql);

        // Consulta exitosa
        if ($resultado) {
            while ($fila = $resultado->fetch_assoc()) {
                $cursos[] = $fila;
            }

            $resultado->free();
        }

        return $cursos;
    }

    public function insertaTitulo($idCurso, $dni)
    {

        $sql = "INSERT INTO cursa_alumn(dniAlum,idCurso) VALUES (? ,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("sd", $dni, $idCurso);

        $estado = $sentencia->execute();

        if ($estado && $sentencia->affected_rows == 1) {
            return json_encode(array("Exito" => "Se ha insertado el titulo correctamente"));
        }

        return json_encode(array("Error" => "Ha habido un problema al añadir el curso"));
    }
}
