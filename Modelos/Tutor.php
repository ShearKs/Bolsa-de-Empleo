<?php


class Tutor
{


    private $dni;
    private $nombre;
    private $apellidos;
    private $telefono;
    private $correo;
    private $curso;

    public function __construct($dni, $nombre, $apellidos, $telefono, $correo, $curso)
    {
        $this->dni = $dni;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->telefono = $telefono;
        $this->correo = $correo;
        $this->curso = $curso;
    }

    //Getters
    public function getDni()
    {
        return $this->dni;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function getCurso()
    {
        return $this->curso;
    }
}
