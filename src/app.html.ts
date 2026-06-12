export const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR INVITE API</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background:
        radial-gradient(circle at top left, #4f46e5 0%, transparent 30%),
        radial-gradient(circle at bottom right, #06b6d4 0%, transparent 30%),
        #0f172a;
      padding: 24px;
      overflow: hidden;
    }

    .card {
      width: 100%;
      max-width: 700px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 24px;
      padding: 48px;
      text-align: center;
      color: white;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      border-radius: 20px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      box-shadow: 0 10px 30px rgba(99,102,241,0.4);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(34,197,94,0.15);
      color: #4ade80;
      border: 1px solid rgba(34,197,94,0.3);
      margin-bottom: 24px;
      font-size: 14px;
      font-weight: 600;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 12px #4ade80;
    }

    h1 {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .highlight {
      background: linear-gradient(135deg, #818cf8, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: #cbd5e1;
      font-size: 18px;
      line-height: 1.7;
      margin-bottom: 40px;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }

    .btn {
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.25s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99,102,241,0.4);
    }

    .btn-secondary {
      border: 1px solid rgba(255,255,255,0.15);
      color: white;
      background: rgba(255,255,255,0.05);
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.1);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .stat {
      padding: 20px;
      border-radius: 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .stat-label {
      color: #94a3b8;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .card {
        padding: 32px 20px;
        margin: 10px;
        border-radius: 20px;
      }

      h1 {
        font-size: 28px;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
        margin-bottom: 30px;
      }

      .actions {
        flex-direction: column;
        gap: 12px;
      }

      .btn {
        width: 100%;
        text-align: center;
      }

      .stats {
        grid-template-columns: 1fr; /* Sửa từ 1rem thành 1fr */
        gap: 12px;
      }

      .stat {
        padding: 16px;
      }
    }
  </style>
</head>

<body>
  <div class="card">
    <div class="logo">D</div>

    <div class="badge">
      <span class="dot"></span>
      API Server Online
    </div>

    <h1>
      Welcome to
      <span class="highlight">QR Invite API</span>
    </h1>

    <p>
      High-performance backend powered by NestJS.
      The API server is running successfully and ready to serve requests.
    </p>

    <div class="actions">
      <a href="/docs" class="btn btn-primary">
        📚 API Documentation
      </a>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">NestJS</div>
        <div class="stat-label">Framework</div>
      </div>

      <div class="stat">
        <div class="stat-value">v1.0</div>
        <div class="stat-label">API Version</div>
      </div>

      <div class="stat">
        <div class="stat-value">Online</div>
        <div class="stat-label">Status</div>
      </div>
    </div>
  </div>
</body>
</html>`;
