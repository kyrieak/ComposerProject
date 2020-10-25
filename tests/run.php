<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

use HelloWorld\Greetings;

echo Greetings::sayHelloWorld();
echo "\n";

$yamlFilePath = __DIR__ . '/../src/test.yaml';

$yamlRaw = file_get_contents($yamlFilePath);
$parsedYaml = Yaml::parseFile(__DIR__ . '/../src/test.yaml');

$rawBlocks = preg_split('/[\r\n]+(?=\S)/', $yamlRaw);

foreach($rawBlocks as $block) {
  $key = null;
  preg_match('/\S+(?=:)/', $block, $key);
  $key = trim($key[0]);
  echo "Yaml block: \n\n" . $block . "\n\n";
  echo "\nParsed to: \n" . json_encode($parsedYaml[$key], JSON_PRETTY_PRINT) . "\n";
  echo "-----------------------------------------------------------------\n";
}
//echo "------\n";
//echo json_encode($parsedYaml, JSON_PRETTY_PRINT);
//echo "\n";
