<?php

class Empresa{

    private $cif;
    private $nombre;
    private $lugar;
    private $idUsuario;

    public function __construct($cif,$nombre,$lugar,$idUsuario = null)
    {

        $this->cif = $cif;
        $this->nombre = $nombre;
        $this->lugar = $lugar;
        $this->idUsuario = $idUsuario;
        
    }

    public function getCif(){
        return $this->cif;
    }

    public function getNombre(){
        return $this->nombre;
    }

    public function getLugar(){
        return $this->lugar;
    }

    public function getIdUsuario(){
        return $this->idUsuario;
    }




}






