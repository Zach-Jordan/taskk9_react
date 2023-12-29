<?php
session_start();
include 'connection.php';

// Assuming you receive selectedCategory and selectedUser from the frontend
$selectedCategory = $_GET['category'] ?? null;
$selectedUser = $_GET['user'] ?? null;

$query = "SELECT posts.*, users.username AS username, categories.category_name AS category 
          FROM posts 
          INNER JOIN users ON posts.user_id = users.user_id
          INNER JOIN categories ON posts.category_id = categories.category_id";

// Modify the query based on selectedCategory and selectedUser if they exist
if ($selectedCategory) {
    $query .= " WHERE categories.category_id = :selectedCategory";
}

if ($selectedUser) {
    $query .= ($selectedCategory ? " AND" : " WHERE") . " users.user_id = :selectedUser";
}

$params = array();

if ($selectedCategory) {
    $params['selectedCategory'] = $selectedCategory;
}

if ($selectedUser) {
    $params['selectedUser'] = $selectedUser;
}

try {
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($posts) {
        echo json_encode(array("posts" => $posts));
        exit;
    } else {
        echo json_encode(array("message" => "No posts available"));
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
    exit;
}
?>
