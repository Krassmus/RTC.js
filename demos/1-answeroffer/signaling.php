<?php

if (isset($_POST['offer'])) {
    file_put_contents(__DIR__."/offer.sdp", $_POST['offer']);
}

if (isset($_POST['answer'])) {
    file_put_contents(__DIR__."/answer.sdp", $_POST['answer']);
}

switch ($_GET['get']) {
    case "offer":
        if (file_exists(__DIR__)."/offer.sdp") {
            echo file_get_contents(__DIR__."/offer.sdp");
            unlink(__DIR__."/offer.sdp");
        }
        break;
    case "answer":
        if (file_exists(__DIR__."/answer.sdp")) {
            echo file_get_contents(__DIR__."/answer.sdp");
            unlink(__DIR__."/answer.sdp");
        }
        break;
}
