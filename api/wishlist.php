<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Same-origin app: no wildcard CORS. Browsers send no preflight for
// same-origin requests, but keep OPTIONS harmless for tooling.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Config (api/config.php is git-ignored, never committed) ----
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'server not configured']);
    exit;
}
$config = require $configFile;

$ADMIN_TOKEN = (string)($config['token'] ?? '');
$dataFile = $config['dataFile'] ?? (__DIR__ . '/wishlist.json');

if ($ADMIN_TOKEN === '' || $ADMIN_TOKEN === 'REPLACE_WITH_A_LONG_RANDOM_TOKEN') {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'admin token not configured']);
    exit;
}

// ---- Helpers ----
function requireToken() {
    global $ADMIN_TOKEN;
    $provided = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
    if (!is_string($provided) || $provided === '' || !hash_equals($ADMIN_TOKEN, $provided)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'unauthorized']);
        exit;
    }
}

function loadData() {
    global $dataFile;
    if (!is_file($dataFile)) {
        return [];
    }
    $json = file_get_contents($dataFile);
    return json_decode($json, true) ?: [];
}

function saveData($data) {
    global $dataFile;
    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    // LOCK_EX avoids interleaved writes from concurrent requests.
    file_put_contents(
        $dataFile,
        json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
        LOCK_EX
    );
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // The list contains user-submitted emails: admin only.
        requireToken();

        $data = loadData();
        if (isset($_GET['status'])) {
            $status = $_GET['status'];
            $data = array_values(array_filter($data, function($item) use ($status) {
                return ($item['status'] ?? '') === $status;
            }));
        }
        echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        // Public: anyone may submit a wish. Validated + length-capped below.
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input) || empty($input['symbolDesc'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'symbolDesc required']);
            break;
        }

        $entry = [
            'id' => bin2hex(random_bytes(8)),
            'symbolDesc' => mb_substr(trim((string)$input['symbolDesc']), 0, 200),
            'email' => mb_substr(trim((string)($input['email'] ?? '')), 0, 100),
            'status' => 'pending',
            'createdAt' => date('c')
        ];

        $data = loadData();
        array_unshift($data, $entry);
        saveData($data);

        echo json_encode(['success' => true, 'data' => $entry], JSON_UNESCAPED_UNICODE);
        break;

    case 'PUT':
        // Changing review status is an admin action.
        requireToken();

        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input) || empty($input['id']) || empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'id and status required']);
            break;
        }

        $allowed = ['pending', 'accepted', 'rejected', 'ignored'];
        if (!in_array($input['status'], $allowed, true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'invalid status']);
            break;
        }

        $data = loadData();
        $found = false;
        foreach ($data as &$item) {
            if (($item['id'] ?? '') === $input['id']) {
                $item['status'] = $input['status'];
                $found = true;
                break;
            }
        }
        unset($item);

        if (!$found) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'not found']);
            break;
        }

        saveData($data);
        echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'method not allowed']);
}
