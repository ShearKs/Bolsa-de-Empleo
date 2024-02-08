<?php

class Solicitud
{

    private $cifEmpresa;
    private $fechaSolicitud;
    private $expLaboral;
    private $posViaje;
    private $estado;


    public function __construct($cifEmpresa, $expLaboral, $posViaje)
    {
        $this->cifEmpresa = $cifEmpresa;
        $this->expLaboral = $expLaboral;
        $this->posViaje = $posViaje;
    }

    public function getCifEmpresa()
    {
        return $this->cifEmpresa;
    }

    public function getExpLaboral()
    {
        return $this->expLaboral;
    }

    public function getFechaSoli()
    {
        return $this->fechaSolicitud;
    }

    public function posiViaje()
    {
        return $this->posViaje;
    }
}
