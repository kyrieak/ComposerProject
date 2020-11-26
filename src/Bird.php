<?php

class Bird {
    private $name = 'Unnamed';
    private $isFlying = false;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getIsFlying(): bool
    {
        return $this->isFlying;
    }

    public function fly()
    {
        $this->isFlying = true;
    }

    public function land()
    {
        $this->isFlying = false;
    }
}
