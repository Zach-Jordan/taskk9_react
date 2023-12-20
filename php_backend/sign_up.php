<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate incoming data (username, email, password)
    if(isset($data['username']) && isset($data['email']) && isset($data['password'])) {
        $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password

        try {
            $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $password]);

            echo json_encode(array("message" => "User signed up successfully"));
            // You can fetch the newly created userId from the database if needed
        } catch (PDOException $e) {
            // Log the error securely, avoid exposing detailed database errors to users
            error_log("Error creating user: " . $e->getMessage());
            echo json_encode(array("error" => "An error occurred while signing up."));
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing data"));
        exit; // Stop execution for missing or invalid data
    }
}
?>
