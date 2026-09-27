---
description: 查看 Prism（侧边栏项目个性化）的安装状态与用法
---

帮用户检查 Prism 插件在桌面的生效状态，只报告、不修改：

1. 运行 `node <插件目录>/hooks/ensure-shim.js`（插件目录即本文件所在插件的根目录），然后 `cat ~/.zcode/prism-state.json` 查看状态。
2. 检查 `/Applications/ZCode.app/Contents/Resources/` 下是否存在 `app.asar.pristine-backup`。
3. 汇总上次校验/安装结果（状态文件 lastResult）。
4. 用法提醒：右键项目头或点项目头"…"菜单里的「调整颜色」可换颜色和图标（30 个 Lucide 图标），「重命名」改 ZCode 内显示名（不动磁盘文件夹）；Alt+右键会话行等效；选"自"恢复自动配色。
