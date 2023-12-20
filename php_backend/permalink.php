<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['permalink'])) {
    $permalink = filter_var($_GET['permalink'], FILTER_SANITIZE_STRING);

    try {
        $stmt = $conn->prepare("SELECT * FROM posts WHERE permalink = ?");
        $stmt->execute([$permalink]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            echo json_encode(array("post" => $post)); 
            exit;
        } else {
            echo json_encode(array("error" => "Post not found"));
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(array("error" => "Error: " . $e->getMessage()));
        exit;
    }
}
