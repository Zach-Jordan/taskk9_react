<?php
session_start();
include 'connection.php';

// checks if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Extracting parameters from the URL
    if (isset($_GET['post_id']) && isset($_GET['permalink'])) {
        $post_id = filter_var($_GET['post_id'], FILTER_SANITIZE_NUMBER_INT);
        $permalink = filter_var($_GET['permalink'], FILTER_SANITIZE_STRING);

        try {
            // Using post_id and permalink in the SQL query
            $stmt = $conn->prepare("SELECT * FROM posts WHERE post_id = ? AND permalink = ?");
            $stmt->execute([$post_id, $permalink]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            // Outputting the post details as JSON if found
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
    } else {
        echo json_encode(array("error" => "Missing parameters"));
        exit;
    }
}
?>
