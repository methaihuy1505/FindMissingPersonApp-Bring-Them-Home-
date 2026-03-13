<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        color: #333;
    }

    h1 {
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    }

    .base-url {
        background: #e8f5e9;
        padding: 10px;
        border-left: 4px solid #4caf50;
        font-family: monospace;
        font-size: 16px;
        margin-bottom: 30px;
    }

    .endpoint {
        background: #f9f9f9;
        border: 1px solid #ddd;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 5px;
    }

    .method {
        font-weight: bold;
        padding: 4px 8px;
        border-radius: 3px;
        color: white;
        display: inline-block;
        width: 60px;
        text-align: center;
        margin-right: 10px;
    }

    .get {
        background: #2196F3;
    }

    .post {
        background: #4CAF50;
    }

    .put {
        background: #FF9800;
    }

    .delete {
        background: #F44336;
    }

    code {
        font-family: Consolas, monospace;
        font-size: 16px;
        font-weight: bold;
        color: #d63384;
    }

    pre {
        background: #282c34;
        color: #fff;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        font-family: Consolas, monospace;
    }

    p {
        margin: 10px 0;
    }
    </style>
</head>

<body>

    <h1>Tài Liệu API - Quản Lý Người Dùng</h1>

    <div class="base-url">
        <strong>Base URL:</strong> https://findmissingpersonapp-bring-them-home.onrender.com
    </div>

    <div class="endpoint">
        <p><span class="method get">GET</span> <code>/api/user</code></p>
        <p>Lấy danh sách tất cả người dùng.</p>
    </div>

    <div class="endpoint">
        <p><span class="method post">POST</span> <code>/api/user</code></p>
        <p>Thêm mới người dùng. Yêu cầu Body (JSON):</p>
        <pre>
{
  "name": "Nguyễn Văn A",
  "email": "nva@example.com"
}</pre>
    </div>

    <div class="endpoint">
        <p><span class="method put">PUT</span> <code>/api/user/{id}</code></p>
        <p>Cập nhật thông tin (thay <b>{id}</b> bằng ID thực tế). Yêu cầu Body (JSON):</p>
        <pre>
{
  "name": "Nguyễn Văn B",
  "email": "nvb_updated@example.com"
}</pre>
    </div>

    <div class="endpoint">
        <p><span class="method delete">DELETE</span> <code>/api/user/{id}</code></p>
        <p>Xóa người dùng (thay <b>{id}</b> bằng ID thực tế).</p>
    </div>

</body>

</html>