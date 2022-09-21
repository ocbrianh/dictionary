<?php
require __DIR__ . '/vendor/autoload.php';

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

function saveDefinition($term, $definition)
{
    $logger = new Logger('define');
    $logger->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));
    $logger->info("Logger Initialized");

    $mysqli = new mysqli("db", "root", "", "dictionary");
    $termId = $mysqli->query("SELECT * FROM term where term='$term'")->fetch_row()[0];

    $mysqli->query("INSERT INTO definition (term_id, text) VALUES ($termId, '$definition')");
}


$term = isset($_REQUEST['term']) ? $_REQUEST['term'] : null;
$definition = isset($_REQUEST['definition']) ? $_REQUEST['definition'] : null;

saveDefinition($term,$definition);
header("Location: /?term=$term");