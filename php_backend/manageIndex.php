<?php
session_start();
include 'connection.php';

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow specific headers and methods
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];
    error_log("Received userId: " . $userId);

    try {
        // Fetch the user's role based on userId
        $stmt = $conn->prepare("SELECT role FROM users WHERE user_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $userRole = $user['role'];

            // Fetch posts based on role
            if ($userRole === 'admin') {
                $stmt = $conn->prepare("
                    SELECT posts.post_id, posts.*, users.username AS username 
                    FROM posts 
                    INNER JOIN users ON posts.user_id = users.user_id
                ");
                $stmt->execute();
                $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->prepare("
                    SELECT posts.post_id, posts.*, users.username AS username 
                    FROM posts 
                    INNER JOIN users ON posts.user_id = users.user_id
                    WHERE posts.user_id = :userId
                ");
                $stmt->bindParam(':userId', $userId);
                $stmt->execute();
                $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }

            if ($posts) {
                // Output posts as JSON if available
                echo json_encode(array("posts" => $posts));
                exit;
            } else {
                // Handle case when no posts are available for this user or admin
                echo json_encode(array("message" => "No posts available"));
                exit;
            }
        } else {
            // Handle case when user not found
            echo json_encode(array("error" => "User not found"));
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(array("error" => "Error: " . $e->getMessage()));
        exit;
    }
} else {
    echo json_encode(array("error" => "User ID not provided"));
    exit;
}

?>