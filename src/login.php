<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');

if (empty($username)) {
    echo json_encode(["success" => false, "message" => "Username is required"]);
    exit();
}

try {
    // Check if user exists
    $sql = "SELECT id, username FROM users WHERE username = :username";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Update last login
        $updateSql = "UPDATE users SET last_login = NOW() WHERE id = :id";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->execute(['id' => $user['id']]);
    } else {
        // Create new user
        $insertSql = "INSERT INTO users (username) VALUES (:username)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->execute(['username' => $username]);
        $user = [
            'id' => $conn->lastInsertId(),
            'username' => $username
        ];
    }
    
    echo json_encode([
        "success" => true,
        "user" => $user,
        "message" => "Login successful"
    ]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
