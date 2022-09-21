<?php

require __DIR__ . '/vendor/autoload.php';

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

$logger = new Logger('dictionary-app');
$logger->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));
$logger->info("Logger Initialized");

if (isset($_GET['func'])) {
    $funcToCall = trim($_GET['func']);

    switch ($funcToCall) {
        case "listUndefinedTerms":
            listUndefinedTerms();
            break;
        case "listRecentDefinitions":
            listRecentDefinitions();
            break;
        case "lookupDefinition":
            $term = trim($_GET['term']);
            lookupDefinition($term);
            break;
        case "updateDefinition":
            $term_id = trim($_GET['term_id']);
            $definition = trim($_GET['definition']);

            if (isset($_GET['definition_id']) && is_numeric(trim($_GET['definition_id']))) {
                $definition_id = trim($_GET['definition_id']);
            } else {
                $definition_id = 0;
            }

            updateDefinition($term_id, $definition, $definition_id);
            break;
        default:
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => 'ERROR', 'code' => 1337)));
    }
}


function listUndefinedTerms()
{
    $mysqli = new mysqli("db", "root", "", "dictionary");
    $result = $mysqli->query("SELECT distinct term.* FROM term left join definition on term.id=definition.term_id where definition.id is null order by search_count DESC, last_search_tstamp desc limit 10");

    $terms = $result->fetch_all();

    header('Content-Type: application/json');
    $response = array("status" => "success", "totals" => mysqli_num_rows($result), "results" => $terms);

    echo json_encode($response);
}

function listRecentDefinitions()
{
    $mysqli = new mysqli("db", "root", "", "dictionary");
    $result = $mysqli->query("SELECT term.* FROM term join definition on term.id=definition.term_id ORDER BY last_search_tstamp desc limit 10");

    $terms = $result->fetch_all();

    header('Content-Type: application/json');
    $response = array("status" => "success", "totals" => mysqli_num_rows($result), "results" => $terms);

    echo json_encode($response);
}


function lookupDefinition($term)
{
    $mysqli = new mysqli("db", "root", "", "dictionary");
    $termResult = $mysqli->query("INSERT INTO term (term) VALUES ('$term') ON DUPLICATE KEY update last_search_tstamp=now(), search_count = search_count + 1");
    $termID = $mysqli->insert_id;

    if ($termResult) {
        $result = $mysqli->query("SELECT definition.* from definition join term on term.id=definition.term_id where term.term='$term'");

        if (mysqli_num_rows($result) > 0) {
            $definition = $result->fetch_all();

            header('Content-Type: application/json');
            $response = array("status" => "success", "definition" => $definition, "term" => $term, "term_id" => $termID);
            echo json_encode($response);
        } else {
            header('Content-Type: application/json');
            $response = array("status" => "success", "definition" => [], "term" => $term, "term_id" => $termID);
            echo json_encode($response);
        }
    } else {
        header('Content-Type: application/json');
        $response = array("status" => "failed", "term" => $term);
    }
}

function updateDefinition($term_id, $definition, $definition_id)
{
    $mysqli = new mysqli("db", "root", "", "dictionary");
    $definitionClean = $mysqli->real_escape_string($definition);

    if ($definition_id > 0) {
        $defResult = $mysqli->query("UPDATE definition SET text = '$definitionClean' WHERE id = $definition_id");

        $result = $mysqli->query("SELECT definition.* from definition where definition.id='$definition_id'");
        $definition = $result->fetch_all();
    } else {
        $defResult = $mysqli->query("INSERT INTO definition (term_id, text) VALUES ('$term_id', '$definitionClean')");
        $id = $mysqli->insert_id;

        $result = $mysqli->query("SELECT definition.* from definition where definition.id='$id'");
        $definition = $result->fetch_all();
    }

    if ($defResult) {
        header('Content-Type: application/json');
        $response = array("status" => "success", "definition" => $definition);
        echo json_encode($response);
    } else {
        header('Content-Type: application/json');
        $response = array("status" => "failed");
    }
}
