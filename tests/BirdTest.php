<?php

require __DIR__ . "/../src/Bird.php";

use PHPUnit\Framework\TestCase;

final class BirdTest extends TestCase
{
    public function testHasAName()
    {
        $birdName = 'Tweety';

        $bird = new Bird($birdName);
        $this->assertEquals($bird->getName(), $birdName);
    }

    public function testCanFly()
    {
        $bird = new Bird('Tweety');
        
        $this->assertEquals($bird->getIsFlying(), false);
        
        $bird->fly();

        $this->assertEquals($bird->getIsFlying(), true);
    }
}
