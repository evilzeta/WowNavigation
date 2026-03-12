@echo off
echo ========================================
echo WebStack 部署到 Cloudflare Pages
echo ========================================
echo.

echo [1/4] 检查 Node.js 环境...
node --version
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
npm --version
echo.

echo [2/4] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)
echo.

echo [3/4] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 错误: 项目构建失败
    pause
    exit /b 1
)
echo.

echo [4/4] 部署到 Cloudflare Pages...
call wrangler pages deploy dist --project-name=webstacknav
if %errorlevel% neq 0 (
    echo 错误: 部署失败
    pause
    exit /b 1
)
echo.

echo ========================================
echo 部署成功！
echo ========================================
echo.
echo 访问: https://wow-navigation.pages.dev
echo 管理后台: https://wow-navigation.pages.dev/login
echo 默认账号: admin / admin
echo.
pause
