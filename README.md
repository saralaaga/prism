# Prism

> 一束白光进棱镜，折射出每个项目自己的颜色。

**Prism** 是 [ZCode](https://github.com/zai-org/ZCode) 桌面端的插件：给左侧边栏里的每个项目一套独立的视觉身份——颜色、图标、显示名——并提供全局外观微调。

## 功能

- **项目颜色**：每个项目的所有会话行染上专属色（背景叠加 + 左侧色条），跨「项目 / 分组 / 时间线」视图一致。默认不自动配色——只有手动指定的项目才染色；想要「未指定时按项目路径哈希自动分配色相」的行为，在全局开关里打开「自动配色」即可。
- **对话颜色**：右键任意对话行，在原生菜单里点「调整颜色（此对话）」，可以只给这一条对话换色，覆盖项目色；色盘里点「自」恢复跟随项目。
- **项目图标**：30 个精选 Lucide 图标（从 ZCode 自带图标抽取，风格零偏差），替换项目头的 folder 图标；home/远程项目的 house/cloud 语义图标保留。
- **项目重命名**：只改 ZCode 内的显示名（别名），不碰磁盘文件夹与工作区关联。
- **侧边栏按最近活跃排序**：项目、分组、时间线三个视图都生效——列表按对话的最后活跃时间排，项目/分组按各自最新对话排，最近有回复的对话始终在最上面。纯显示层重排（CSS `order`），不写入手动拖拽的顺序，开关关掉立即恢复原样；超过 80 项的虚拟化长列表或结构无法识别时自动不生效。
- **全局开关**：压暗对话标题（60% 不透明度）、调亮思考动画（shimmer 暗侧从 20% 提到 65%，覆盖 computer-use 标签）、自动配色、按最近活跃排序。

## 使用

| 操作 | 入口 |
| --- | --- |
| 颜色 / 图标 | 右键项目标题行，或项目头 `…` 菜单 →「调整颜色」 |
| 单条对话换色 | 右键对话行 →「调整颜色（此对话）」（「自」恢复跟随项目） |
| 重命名 | 项目头 `…` 菜单 →「重命名」（仅显示名） |
| 任意视图换项目色 | Alt + 右键该项目的任意会话行 |
| 全局开关 | 取色盘底部「Prism 全局」 |
| 清除颜色 | 色盘里的「自」（自动配色关闭时即无色，开启时回到哈希色） |
| 状态自检 | 会话内运行 `/status`（查看 shim 安装状态与用法提醒） |

所有选择即时生效；数据存于渲染进程 localStorage（`zcProjectTint.*` / `zcPrism.settings.v1`）。排查排序是否生效：打开开发者工具控制台，找 `[zc-prism] recency: …` 状态行（`applied: …` 即在工作）。

## 安装

要求：macOS + ZCode 桌面端（仅在 `/Applications/ZCode.app` 默认布局下验证过）。

本仓库根目录即一个 ZCode marketplace：

```
Settings → Plugins → Discover → + → Add marketplace → 填入本仓库路径（或 Git 地址）→ 安装 prism
```

启用后，SessionStart 钩子会自动把渲染层 shim 打进 `/Applications/ZCode.app`（后台执行，不阻塞会话）；**应用自动更新后也会自动重打**。shim 内容以 hash 契约校验，插件升级后下次开会话自动更新。

### 回滚

```sh
cd /Applications/ZCode.app/Contents/Resources
mv app.asar app.asar.patched && mv app.asar.orig app.asar   # 首次打补丁前的原始备份
```

插件层面：在插件列表禁用/卸载即可（shim 已打入的着色随下次回滚消失）。

## 工作原理（一句话版）

ZCode 插件系统碰不到桌面端 UI，所以 Prism 分两层：**插件本体**（hooks/commands，负责把渲染层 shim 安装进 app 并自愈）+ **渲染层 shim**（注入 `index.html` 的独立脚本，负责着色/图标/别名/菜单扩展，全部防御式编码，异常只影响自身不影响 App）。

安全提示：shim 具备改写应用 bundle 的能力，安装前请审阅 `prism/renderer/prism.js` 与 `prism/hooks/ensure-shim.js`——两者都很短，且只在 `/Applications/ZCode.app` 存在时工作。

## 开发

```sh
# 重新生成图标集（先解包当前 app.asar）
npx @electron/asar extract /Applications/ZCode.app/Contents/Resources/app.asar /tmp/zc-extracted
node tools/extract-icons.js /tmp/zc-extracted/out/renderer/assets icons.generated.js
# 用生成结果更新 prism/renderer/prism.js 的 ICONS 常量后：
node prism/hooks/ensure-shim.js --apply   # 手动重打；平时 SessionStart 自动
```

- `tools/fuse-check.js`：检查 Electron 熔丝（Prism 依赖 asar 完整性校验未启用的前提，换机器迁移时先跑它）。
- `prism/node_modules` 随仓库提交：marketplace 分发不走 npm install，hook 运行时需要 `@electron/asar` 就地可用。
- macOS 仅在 `/Applications/ZCode.app` 布局下验证过；其他平台/安装位置需改 `ensure-shim.js` 里的 `ASAR` 常量。

## License

MIT（本仓库代码，全文见 [LICENSE](LICENSE)）。内嵌图标为 [Lucide](https://lucide.dev)（ISC）path 数据。

## 更新日志

见 [CHANGELOG.md](CHANGELOG.md)。
