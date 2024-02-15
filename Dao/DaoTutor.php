<?php

include_once 'Conexion.php';
include_once '../Modelos/Utilidades.php';



class DaoTutor{

    private $conexion;
    private $utils;

    public function __construct()
    { 
      $claseConexion = new Conexion();
      $this->conexion = $claseConexion->getConexion();
      $this->utils = new Utilidades();
    }






}





