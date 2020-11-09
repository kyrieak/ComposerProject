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
$BLUE = "\033[0;34m";
$GREEN = "\033[0;32m";
$RESET = "\033[0;0m";

function blockToFormattedRows($yaml, $parsedYaml) {
  $columnSize = 40;
  $yamlRows = explode("\n", $yaml);
  $jsonRows = explode("\n", json_encode($parsedYaml, JSON_PRETTY_PRINT));
  $maxYamlIndex = count($yamlRows) - 1;
  $maxJSONIndex = count($jsonRows) - 1;
  $maxIndex = max($maxYamlIndex, $maxJSONIndex);
  $rows = [];

  for ($i = 0; $i <= $maxIndex; $i++) {
    $row = [];

    if ($i > $maxYamlIndex) {
      $row['yaml'] = str_pad('', $columnSize);
    } else {
      $row['yaml'] = str_pad($yamlRows[$i], $columnSize);
    }

    if ($i > $maxJSONIndex) {
      $row['parsed'] = str_pad('', $columnSize);
    } else {
      $row['parsed'] = str_pad($jsonRows[$i], $columnSize);
    }

    $rows[] = $row;
  }

  return $rows;
}

foreach($rawBlocks as $block) {
  $key = null;
  preg_match('/\S+(?=:)/', $block, $key);
  $key = trim($key[0]);

  $rows = blockToFormattedRows($block, $parsedYaml[$key]);
  
  foreach($rows as $row) {
    echo $GREEN . $row['yaml'];
    echo $BLUE . $row['parsed'];
    echo "\n";
  }

  echo $RESET . "\n\n";
}
//echo "------\n";
//echo json_encode($parsedYaml, JSON_PRETTY_PRINT);
//echo "\n";
