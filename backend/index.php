<?php
    function salam($name) {
        return "Hello, " . htmlspecialchars($name) . "!";
    };
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My PHP App</title>
</head>
<body>
    <div id="app">
        <h1>Welcome to My PHP Application</h1>
        <p><?php echo salam("bro"); ?></p>
    </div>
</body>
</html>