<?php
session_start();

include 'connection.php';

// Checks if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Checking if username and password exist in the data
    if (isset($data['username'], $data['password'])) {
        $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
        $password = $data['password'];

        try {
            // Prepared statement to fetch user details based on the username
            $stmt = $conn->prepare("SELECT user_id, username, password, role FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['role'] = $user['role'];
                echo json_encode(array("message" => "Login successful", "userId" => $user['user_id'], "role" => $user['role']));
                exit;
            } else {
                if (!$user) {
                    echo json_encode(array("error" => "User not found"));
                } else {
                    echo json_encode(array("error" => "Invalid Password"));
                }
                exit;
            }
        } catch (PDOException $e) {
            echo json_encode(array("error" => "Database error: " . $e->getMessage()));
            exit;
        }
    } else {
        echo json_encode(array("error" => "Invalid data sent"));
        exit;
    }
}
?>
