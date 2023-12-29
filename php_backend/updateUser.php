<?php

include "connection.php";

$data = json_decode(file_get_contents('php://input'), true);

// Checking if the necessary data is present in the request
if (isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['user_id'])) {
    $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($data['password'], PASSWORD_DEFAULT); 

    $user_id = $data['user_id'];

    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Preparing and executing the update query
        $stmt = $conn->prepare("UPDATE users SET username=:username, email=:email, password=:password WHERE user_id=:user_id");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        $response = ['message' => 'User updated successfully'];
        echo json_encode($response);
    } catch(PDOException $e) {
        $error = ['error' => 'Error updating user: ' . $e->getMessage()];
        echo json_encode($error);
    }
    
    $conn = null; // Close connection
} else {
    echo json_encode(array("error" => "Invalid or missing data"));
}
?>
