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

    public function obtenerListadoAlumnos()
    {

        $sql = "SELECT * FROM Alumnoies";
        $query = $this->conexion->query($sql);

        $alumnos = array();

        if ($query->num_rows > 0) {
            while ($fila = $query->fetch_assoc()) {
                $alumnos[] = $fila;
            }
        }

        return $alumnos;
    }
}
