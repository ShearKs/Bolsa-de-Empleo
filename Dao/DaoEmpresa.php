<?php

include_once 'Conexion.php';
include_once '../Modelos/Usuario.php';
include_once '../Modelos/Utilidades.php';
include_once '../Modelos/Empresa.php';


class DaoEmpresa
{


    private $conexion;
    private $utils;

    public function __construct()
    {

        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function devuelveCampos()
    {

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'Empresa'";
        $query = $this->conexion->query($sql);

        $campos = array();

        if ($query->num_rows > 0) {

            while ($fila = $query->fetch_assoc()) {
                $campos[] = $fila;
            }
        }

        return $campos;
    }


    public function existeCifEmpresa($cifEmpresa)
    {
    }
}
