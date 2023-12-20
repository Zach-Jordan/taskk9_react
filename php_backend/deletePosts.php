<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    $postId = isset($data['postId']) ? $data['postId'] : null;

    if ($postId !== null) {
        try {
            $stmt = $conn->prepare("DELETE FROM posts WHERE post_id = ?");
            $stmt->execute([$postId]);

            $rowCount = $stmt->rowCount();
            if ($rowCount > 0) {
                echo json_encode(array("message" => "Post deleted successfully"));
            } else {
                echo json_encode(array("error" => "No post found with given ID"));
            }
        } catch (PDOException $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "No postId received"));
        exit; 
    }
}
?>
