<?php

class Empresa
{

    private $cif;
    private $nombre;
    private $lugar;
    private $telefono;
    private $direccion;
    private $correo;
    private $idUsuario;

    public function __construct($cif, $nombre, $lugar, $telefono, $direccion, $correo, $idUsuario = null)
    {

        $this->cif = $cif;
        $this->nombre = $nombre;
        $this->lugar = $lugar;
        $this->telefono = $telefono;
        $this->direccion = $direccion;
        $this->correo = $correo;
        $this->idUsuario = $idUsuario;
    }

    public function getCif()
    {
        return $this->cif;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getLugar()
    {
        return $this->lugar;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function getIdUsuario()
    {
        return $this->idUsuario;
    }
}
