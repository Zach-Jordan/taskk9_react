<?php
session_start();
include 'connection.php'; 

// Checks if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') { 
    $data = json_decode(file_get_contents('php://input'), true); 

    $postId = isset($data['postId']) ? $data['postId'] : null; 

    // Checks if postId exists
    if ($postId !== null) { 
        try {
            // Prepared statement to delete a post with a specific post_id
            $stmt = $conn->prepare("DELETE FROM posts WHERE post_id = ?");
            // Executs the prepared statement with postId
            $stmt->execute([$postId]); 

            // Getting the number of affected rows
            $rowCount = $stmt->rowCount(); 

            if ($rowCount > 0) {
                // Returns success message
                echo json_encode(array("message" => "Post deleted successfully")); 
            } else {
                // Returns error if no post found
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
