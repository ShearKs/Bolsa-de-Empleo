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
        $sql = "SELECT alu.dni, alu.nombre, apellidos, email,telefono, cur.nombre as 'curso'";
        $sql .= $esbolsa ? ", idCurso, expLaboral as 'Experiencia Laboral', telefono as 'Teléfono'" : "";
        $sql .= " FROM alumnoies alu, cursa_alumn c, curso cur";
        $sql .= $esbolsa ? ", alumno_bolsa b" : "";
        $sql .= " WHERE alu.dni = c.dniAlum and c.idCurso = cur.id and alu.dni = ?";
        $sql .= $esbolsa ? " and alu.dni = b.dni" : "";

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

        $contrasenaEncriptada = password_hash($contrasena, PASSWORD_BCRYPT);

        $sql = "INSERT INTO usuario(nombre,contrasena) VALUES (?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ss", $usuarioNombre, $contrasenaEncriptada);
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

    private function introducirCamposBdd(AlumnoBolsa $alumnoB,$idUsuario)
    {

        //Todos los campos pasados
        $dni = $alumnoB->getDni();
        $expLaboral = $alumnoB->getExperiencia();


        $sql = "INSERT INTO Alumno_Bolsa (dni,expLaboral,idUsuario)
                    VALUES (?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ssd", $dni, $expLaboral, $idUsuario);
        $estado = $sentencia->execute();

        return $estado;
    }


    public function insertarAlumno(AlumnoBolsa $alumno,$nombreUsuario)
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

        //Creamos el objeto usuario
        $usuario = new Usuario($nombreUsuario, $contrasena);

        $idUsuario = $this->insertarUsuario($usuario);

        if ($idUsuario != -1 ) {

            // Actualizamos la información del alumno,incluido el nombre del curso si lo quiere
            // Si se ha hecho bien la actualización llamamos a la función de insertarUsuario
            if ($this->actualizaAlumno($alumno,false)) {

                if ($this->introducirCamposBdd($alumno, $idUsuario)) {

                    $mensaje = "Es es tu usuario y contraseña ,usuario: ".$nombreUsuario." y tu contraseña: ". $contrasena;

                    $this->utils->enviarCorreo($email, $mensaje);
                    $this->conexion->commit();
                    return json_encode(array("Exito" => "Todo ha ido bien".$contrasena));
                } else {
                    return json_encode(array("Error" => "No se ha podido insertar el alumno en la bolsa"));
                }
            } else {
                return json_encode(array("Error" => "Ha habido un problema al actualizar la información del alumno"));
            }
        } else {
            return json_encode(array("Error" => "Ha habido un problema al insertar el usuario"));
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


    public function devuelveCursos()
    {

        //Información de todos los cursos que vamos a devolver
        $cursos = array();

        $sql = "SELECT id,nombre FROM curso order by id;";
        $resultado = $this->conexion->query($sql);

        //Consulta exitosa
        if ($resultado) {
            while ($fila = $resultado->fetch_assoc()) {
                $cursos[] = $fila;
            }

            $resultado->free();
        }

        return $cursos;
    }
}
