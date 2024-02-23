<?php

class Administrador
{

    private $dni;
    private $nombre;
    private $apellidos;
    private $correo;


    public function __construct($dni, $nombre,$apellidos, $correo)
    {
        $this->dni = $dni;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->correo = $correo;
    }

    public function getDni()
    {
        return $this->dni;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getApellidos(){
        return $this->apellidos;
    }

    public function getCorreo()
    {
        return $this->correo;
    }
}
