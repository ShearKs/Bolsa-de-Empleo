<?php

include_once 'Conexion.php';
include_once '../Modelos/Utilidades.php';
include_once '../Modelos/Usuario.php';



class DaoUsuario
{

    private $conexion;
    private $utils;

    public function __construct()
    {
        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function inicioSesion($nombreUsuario, $contrasena)
    {

        //Hacemos una consulta a la base de datos
        $sql = "SELECT * FROM usuario WHERE nombre = ?";
        $setencia = $this->conexion->prepare($sql);
        $setencia->bind_param("s", $nombreUsuario);

        $estado = $setencia->execute();
        $resultado = $setencia->get_result();

        if ($estado != null && $resultado->num_rows == 1) {

            $usuario = $resultado->fetch_assoc();

            //Cambiar luego por el password verify
            //Si el usuario existe en la base de datos comprobamos si la contraseña que ha introducido es correcta

            if (password_verify($contrasena, $usuario['contrasena'])) {
                //Ha iniciado sesión de forma satisfactoria

                //Me creo una sesión con el nombre del usuario
                session_start();
                $idUsuario = $usuario['id'];
                $dni = $this->devuelveDniUser($idUsuario);
                $_SESSION['cif'] = $dni;

                //Obtenemos el rol al iniciar sesión y se lo pasamos al cliente
                $rol = $usuario['rol'];

                //return json_encode($usuario);
                return json_encode(array("Exito" => $rol));
            }
            return json_encode(array("Error" => "La contraseña que has introducido es incorrecta"));
        } else {
            return json_encode(array("Error" => "No se ha encontrado ese alumno en la base de datos"));
        }
    }

    public function cambioContrasena(Usuario $usuario)
    {
        $nombreuser = $usuario->getNombreUsuario();
        $contrasena = $usuario->getContrasena();

        $sql = "UPDATE usuario
                    SET contrasena = ?
                    WHERE nombre = ?";
        $contrasenaEncriptada = password_hash($contrasena, PASSWORD_BCRYPT);

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ss", $contrasenaEncriptada, $nombreuser);
        $estado = $sentencia->execute();

        if ($estado) {
            return json_encode(array("Exito" => "Se ha actualizado la contraseña"));
        }

        return json_encode(array("Error" => "Ha habido un problema al cambiar la contraseña"));
    }

    public function devuelveDniUser($idUsuario)
    {
        $sql = " SELECT 
                    CASE 
                        WHEN al.idUsuario IS NOT NULL THEN al.dni -- Si es un alumno
                        WHEN e.idUsuario IS NOT NULL THEN e.cif  -- Si es una empresa
                        WHEN tu.idUsuario IS NOT NULL THEN tu.dni -- Si es un tutor
                        WHEN a.idUsuario IS NOT NULL THEN a.dni -- Si es el administrador
                    END AS cif
                FROM usuario u
                LEFT JOIN alumno_bolsa al ON u.id = al.idUsuario
                LEFT JOIN empresa e ON u.id = e.idUsuario
                LEFT JOIN tutor tu ON u.id = tu.idUsuario
                LEFT JOIN Administrador a ON u.id = a.idUsuario 
                WHERE u.id = ? ";

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("d", $idUsuario);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();
        $dni = "";
        if ($estado && $resultado->num_rows == 1) {

            $fila = $resultado->fetch_assoc();
            $dni = $fila['cif'];
        }
        return $dni;
    }

    public function obtenerUsuario($nombreUsuario)
    {


        $sql = "SELECT * from usuario WHERE nombre = ?";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $nombreUsuario);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();
        $usuario = "";

        //La consulta va a ser un registro ya que el usuario es único
        if ($estado && $resultado->num_rows == 1) {
            $usuario = $resultado->fetch_object();
            return $usuario;
        }

        return null;
    }

    public function obtenerDatosUsuario($cif, $rol)
    {
        $sql = "";
        $sentencia = "";

        //Según el rol que le pasemos(Tutor,Empresa o AlumnoBolsa) haremos una consulta u otra 
        switch ($rol) {
            case 1:
                //Para alumno en bolsa
                $sql = "SELECT al.dni, a.nombre, a.apellidos, email, telefono as 'Teléfono',u.nombre as 'usuario',otraResidencia as 'residencia',posiViajar ,expLaboral as 'Experiencia Laboral',GROUP_CONCAT(c.nombre SEPARATOR ',') AS cursos,idCurso ,disponibilidad from alumno_bolsa al " .
                    "INNER JOIN alumnoies a ON a.dni = al.dni " .
                    "INNER JOIN cursa_alumn cur ON a.dni = cur.dniAlum " .
                    "INNER JOIN curso c ON c.id = cur.idCurso " .
                    "INNER JOIN usuario u ON u.id = al.idUsuario WHERE al.dni = ? " .
                    "GROUP BY al.dni";

                break;

            case 2:
                //Para empresa
                $sql = "SELECT cif,e.nombre,lugar,idUsuario,u.nombre as 'usuario',direccion,correo as 'email',telefono from empresa e " .
                    "INNER JOIN usuario u ON u.id = e.idUsuario WHERE e.cif = ?";
                break;

            case 3:
                //Para tutor
                $sql = "SELECT dni,tu.nombre as 'nombre',apellidos,telefono,correo as 'email',idUsuario,u.nombre as 'usuario',c.nombre as 'curso',tu.idCursoT FROM TUTOR tu
                        INNER JOIN curso c ON c.id = idCursoT
                        INNER JOIN usuario u ON u.id = tu.idUsuario WHERE tu.dni = ? ";
                break;

            case 4:
                $sql = "SELECT a.dni,a.nombre,a.apellidos,a.correo as 'email',u.nombre as 'usuario' FROM Administrador a,usuario u WHERE  u.id = a.idUsuario  AND a.dni = ? ";
                break;
            default:
                break;
        }
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $cif);
        $estado = $sentencia->execute();

        $resultado = $sentencia->get_result();

        if ($estado &&  $resultado->num_rows == 1) {
            $usuario = $resultado->fetch_assoc();
            return json_encode($usuario);
        } else {
            return json_encode(array("Error" => "No se ha encontrado el usuario en la base da datos"));
        }
    }


    public function actualizarUsuarioBolsa($objeto, $rol)
    {
        $sentencia = null;

        switch ($rol) {
            case 1: // Alumno
                if ($objeto instanceof AlumnoBolsa) {

                    $nombre = $objeto->getNombre();
                    $apellidos = $objeto->getApellidos();
                    $email = $objeto->getEmail();
                    $telefono = $objeto->getTelefono();
                    $expLaboral = $objeto->getExperiencia();
                    $residencia = $objeto->getResidencia();
                    $posViajar = $objeto->getPosViajar();
                    $dni = $objeto->getDni();
                    $disponibilidad = $objeto->getDisponibilidad();

                    // Actualizar datos del alumno en la base de datos
                    $sql = "UPDATE AlumnoIES a
                            JOIN alumno_bolsa ab ON a.dni = ab.dni
                            SET 
                        a.nombre = ?,
                        a.apellidos = ?,
                        a.email = ?,
                        a.telefono = ?,
                        ab.expLaboral = ?,
                        ab.otraResidencia = ?,
                        ab.posiViajar = ?,
                        ab.disponibilidad = ?
                    WHERE a.dni = ?;";
                    $sentencia = $this->conexion->prepare($sql);
                    $sentencia->bind_param(
                        "sssdssdds",
                        $nombre,
                        $apellidos,
                        $email,
                        $telefono,
                        $expLaboral,
                        $residencia,
                        $posViajar,
                        $disponibilidad,
                        $dni
                    );
                    break;
                }
            case 2: // Empresa
                if ($objeto instanceof Empresa) {

                    $nombre = $objeto->getNombre();
                    $lugar = $objeto->getLugar();
                    $telefono = $objeto->getTelefono();
                    $direccion = $objeto->getDireccion();
                    $correo = $objeto->getCorreo();
                    $cif = $objeto->getCif();


                    // Actualizar datos de la empresa en la base de datos
                    $sql = "UPDATE empresa SET nombre = ?, lugar = ?, telefono = ?, direccion = ?, correo = ? WHERE cif = ?";
                    $sentencia = $this->conexion->prepare($sql);
                    $sentencia->bind_param("ssdsss", $nombre, $lugar, $telefono, $direccion, $correo, $cif);
                    break;
                }
            case 3: // Tutor
                if ($objeto instanceof Tutor) {
                    //obtenemos los campos del tutor
                    $dni = $objeto->getDni();
                    $nombre = $objeto->getNombre();
                    $apellidos = $objeto->getApellidos();
                    $telefono = $objeto->getTelefono();
                    $correo = $objeto->getCorreo();
                    $curso = $objeto->getCurso();

                    $sql = "UPDATE Tutor SET nombre = ? ,apellidos = ? ,telefono = ?,correo = ? WHERE dni = ? ";
                    $sentencia = $this->conexion->prepare($sql);
                    $sentencia->bind_param("ssiss", $nombre, $apellidos, $telefono, $correo, $dni);
                }

                break;
            case 4:
                if ($objeto instanceof Administrador) {
                    //Campos del adminitrador
                    $dni = $objeto->getDni();
                    $nombre = $objeto->getNombre();
                    $apellidos = $objeto->getApellidos();
                    $correo = $objeto->getCorreo();

                    $sql = "UPDATE Administrador SET nombre = ?,apellidos = ? ,correo = ? WHERE dni = ? ";
                    $sentencia = $this->conexion->prepare($sql);
                    $sentencia->bind_param("ssss",$nombre,$apellidos,$correo,$dni);
                }
            default:
                // Manejar el caso por defecto
                break;
        }
        if ($sentencia != null) {

            $resultado = $sentencia->execute();

            if ($resultado) {
                return json_encode(array("Exito" => "Se actulizaron los datos correspondientes"));
            }

            return json_encode(array("Error" => "No se puedieron actulizar los datos..."));
        } else {
            return json_encode(array("Error" => "Rol no válido"));
        }
    }
}
