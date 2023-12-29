<?php
// Assuming you have a database connection established in 'connection.php'
include 'connection.php';


try {
    // Implement your database query here using prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT user_id, username, email, fullname FROM users");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($users) {
        // Output users as JSON
        echo json_encode(array("users" => $users));
        exit;
    } else {
        echo json_encode(array("message" => "No users available"));
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
    exit;
}
?>
