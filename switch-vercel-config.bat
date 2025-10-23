@echo off
echo 请选择要使用的 Vercel 配置：
echo 1. 预构建文件版本 (vercel-prebuilt.json)
echo 2. 自己打包版本 (vercel-build.json)
echo.
set /p choice="请输入选择 (1 或 2): "

if "%choice%"=="1" (
    echo 切换到预构建文件版本...
    copy vercel-prebuilt.json vercel.json
    echo 已切换到预构建文件版本
    echo 你别忘记提交代码: git add vercel.json && git commit -m "切换到预构建文件版本" && git push
) else if "%choice%"=="2" (
    echo 切换到自己打包版本...
    copy vercel-build.json vercel.json
    echo 已切换到自己打包版本
    echo 你别忘记提交代码: git add vercel.json && git commit -m "切换到自己打包版本" && git push
) else (
    echo 无效选择，请重新运行脚本
)

pause
