<?php

include_once 'Conexion.php';
include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Modelos/Empresa.php';
include_once '../Modelos/Utilidades.php';


class DaoAdministrador
{

    private $conexion;
    private $utils;

    public function __construct()
    {
        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function obtenerListadoAlumnos($idCurso)
    {
        //$condicionCurso = ($idCurso == 0) ? "" : "AND idCurso = ?";

        $sql = "SELECT a.dni,a.nombre,a.apellidos,a.email,group_concat(c.nombre) as 'cursos'   FROM alumnoies a
                    INNER JOIN alumno_bolsa ab ON ab.dni = a.dni
                    INNER JOIN cursa_alumn cur ON cur.dniAlum = ab.dni
                    INNER JOIN curso c ON c.id = cur.idCurso
                    WHERE activo ='SI' "; 
                
        if ($idCurso !== 0){
            $sql .=  " AND c.id = ? ";
        }

        $sql .= "GROUP BY ab.dni";
        
        $sentencia = $this->conexion->prepare($sql);

        if($idCurso !== 0){
            $sentencia->bind_param("i",$idCurso);
        }
    
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $alumnos = array();

        if ($estado && $resultado->num_rows > 0 ) {
            while ($fila = $resultado->fetch_assoc()) {
                $alumnos[] = $fila;
            }
        }
        return $alumnos;
    }





}
