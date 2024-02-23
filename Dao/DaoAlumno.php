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



    public function devuelveAlumno($dni)
    {

        $sql = "SELECT alu.dni, alu.nombre, apellidos, email, telefono,titulado,c.nombre as 'curso',titulado
                    FROM alumnoies alu 
                    INNER JOIN curso c ON c.id = alu.curso
                    WHERE titulado = 1 and alu.dni = ? ";

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $dni);
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        if ($resultado->num_rows == 1 && $estado != null) {
            $alumno = $resultado->fetch_assoc();

            return json_encode($alumno);
        } else {
            return json_encode(array("Error" => "No se encuentra ese alumno en la base de datos de alumnos titulados"));
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
        $sentencia->bind_param("ssd", $usuarioNombre, $contrasenaEncriptada, $rol);
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
        $exito = false;
        $this->conexion->autocommit(false);

        //Todos los campos pasados
        $dni = $alumnoB->getDni();
        $expLaboral = $alumnoB->getExperiencia();
        $residencia = $alumnoB->getResidencia();
        $posViajar = $alumnoB->getPosViajar();
        $disponibilidad = $alumnoB->getDisponibilidad();
        //Curso del alumno
        $curso = $alumnoB->getCurso();

        $sql = "INSERT INTO Alumno_Bolsa (dni,expLaboral,otraResidencia,posiViajar,disponibilidad,idUsuario)
                    VALUES (?,?,?,?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("sssddd", $dni, $expLaboral, $residencia, $posViajar, $disponibilidad, $idUsuario);
        $estado = $sentencia->execute();
        if ($estado) {
            $sentencia->close();
            $sqlCurso = "INSERT INTO cursa_alumn (dniAlum,idCurso) VALUES (?,?)";
            $sentenciaCurso = $this->conexion->prepare($sqlCurso);
            $sentenciaCurso->bind_param("si",$dni,$curso);
            $estadoCurso = $sentenciaCurso->execute();
            if($estadoCurso){
                //Se ha hecho todo correctamente hacemos un commit
                $this->conexion->commit();
                $exito = true;
            }
        }

        return $exito;
    }


    public function insertarAlumno(AlumnoBolsa $alumno, $nombreUsuario, $rol)
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
            $usuario = new Usuario($nombreUsuario, $contrasena, $rol);

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

    public function actualizaAlumno(AlumnoBolsa $alumno)
    {

        //Obtenemos los campos pasados
        $dni = $alumno->getDni();
        $nombre = $alumno->getNombre();
        $apellidos = $alumno->getApellidos();
        $idCurso = $alumno->getCurso();
        $email = $alumno->getEmail();
        $expLaboral = $alumno->getExperiencia();
        $telefono = $alumno->getTelefono();

        $sql = "UPDATE alumnoies SET nombre = ?,apellidos = ?,email = ?,telefono = ? ,curso = ? WHERE dni = ?";

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("sssiis", $nombre, $apellidos, $email, $telefono, $idCurso, $dni);

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


    public function devuelveAlumnoOferta($criterios)
    {
        //Cursos que ha seleccionado la empresa
        $cursos = $criterios['cursos[]'];

        //Resto de valores que los tomaremos como si fueran booleanos
        $posViajar = $criterios["posViajar"] === "Sí" ? 1 : 0;

        $otraResidencia = ($criterios['residencia'] === "Todos" )? "1" : ($criterios['residencia'] === "Sí" ? "otraResidencia != ''" : "otraResidencia = '' " );
        $expLaboral = ($criterios['experienciaLaboral'] === "Todos") ? "1" : ($criterios['experienciaLaboral'] === "Sí" ? "expLaboral != '' " : "expLaboral = '' ");
        //$otraResidencia = $criterios["residencia"] === "Sí" ? "otraResidencia != ''" : "otraResidencia = ''";
        //$expLaboral = $criterios['experienciaLaboral'] === "Sí" ? "expLaboral != ''" : "expLaboral = '' ";

        //Lo que hace aquí es coger cursos que es un array y lo transforma en un cadena separado por comas de esta forma lo podemos usar en la consutla
        $cadenaCursos = implode(',', $cursos);

        //Ya que un alumno puede tener varios cursos necesitamos agrupar por dni para no tener registros(alummnos) repetidos
        $sql = "SELECT al.dni, al.nombre, al.apellidos, al.email, al.telefono, GROUP_CONCAT(c.nombre) AS 'Cursos del alumno'
                    FROM alumnoies al
                    INNER JOIN alumno_bolsa a ON a.dni = al.dni
                    INNER JOIN cursa_alumn cur ON cur.dniAlum = a.dni
                    INNER JOIN curso c ON c.id = cur.idCurso
                    WHERE posiViajar = ? AND disponibilidad = 1 AND $expLaboral AND $otraResidencia
                    GROUP BY a.dni
                    -- Haciendo el having nos aseguramos que se incluyan alumnos que tenga al menos uno de los cursos especificados en cadenaCursos
                    HAVING SUM(c.id IN ($cadenaCursos)) > 0";

        $alumnosOferta = array();
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("i", $posViajar);
        $estado = $sentencia->execute();

        $resultados = $sentencia->get_result();

        //Si la consulta ha sido exitosa
        if ($resultados) {

            while ($fila = $resultados->fetch_assoc()) {
                $alumnosOferta[] = $fila;
            }

            return json_encode($alumnosOferta);
        } else {
            json_encode(array("Error" => "Error al realizar la consulta alumnos"));
        }
    }
}
