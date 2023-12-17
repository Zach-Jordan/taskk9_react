<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['username'], $data['password'])) {
        $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
        $password = $data['password'];

        try {
            $stmt = $conn->prepare("SELECT user_id, username, password, role FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['role'] = $user['role']; // Assign 'role' to the session
                echo json_encode(array("message" => "Login successful", "userId" => $user['user_id'], "role" => $user['role']));
                exit;
            } else {
                echo json_encode(array("error" => "Invalid credentials"));
                exit;
            }
        } catch (PDOException $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
            exit;
        }
    } else {
        echo json_encode(array("error" => "Invalid data sent"));
        exit;
    }
}
?>
