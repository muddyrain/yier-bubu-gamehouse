# 一二布布游戏屋（Yier & Bubu Gamehouse）

> 更新日期：2026-10-26。当前阶段以 [PLAN.md](docs/PLAN.md) 为准；全项目首发横屏优先。P1-01 的 1280×720 Startup 已完成 Windows 横屏图形复验，没有正式游戏玩法。

一款以 **一二（小白熊）** 和 **布布（小棕熊）** 为平等双主角的微信小游戏合集。定位是「1 款有深度的精品主游戏 + 若干可反复游玩的经典玩法 + 统一大厅及成长」，未来支持邀请微信好友、创建双人房、选择角色、合作或对战。

## 首发范围（目标，不是已经完成）

| 类型 | 游戏 | 首发内容目标 | 联机方向 |
| --- | --- | --- | --- |
| 主游戏 | 一二布布守护小屋 | 24 关，先做 5 关垂直切片 | 双人合作 |
| 经典游戏 | 一二布布黄金矿工 | 30 关，先做 10 关垂直切片 | 双人协作，首个联机试点 |
| 经典游戏 | 一二布布合成乐园 | 合成图鉴、无尽和每日挑战 | 以后按需好友竞分 |
| 经典游戏 | 一二布布贪吃蛇 | 无尽、机关地图、记录 | 双人对战 |

**单人模式可选一二或布布。** 主题名称不锁定玩家角色。某游戏若两只熊能力不同，须明确公平性、单人补位与可达成的关卡目标。未来主打《一二布布双人冒险》，不属于首发承诺。

## 工程入口

1. 文档基线为 `master` 的 `043ae7f`；P1-01 已通过用户最终复审，本次获授权提交并推送，安全检查及范围见 [收尾报告](docs/reports/2026-10-26_issue-1_closeout.md)。实际阶段仍以 PLAN 为准。
2. 工程目录是 `client/`，来自 **Cocos Creator 3.8.8 / Empty(2D)** 官方安装包模板。入口是 `client/assets/scenes/Startup.scene`，Canvas 挂载 `SmokeTest`。
3. 场景使用标题、白/棕矩形与双方名称作启动占位，设计分辨率为 **1280×720**；Project Settings 与既有 Canvas 已分别调整，Fit Width/Height 同时开启以完整显示内容。全项目方向及代价见 [ADR-0003](docs/decisions/ADR-0003-landscape-first.md)，不含正式选角、目录、存档或玩法。
4. 获得当次图形调试许可后，Windows 使用 **3.8.8** 打开 `client/`，双击 `assets/scenes/Startup.scene`，选择 **Preview in Editor** 后运行当前场景，用 Fit to current view 查看完整画布并比较不同宽高比。本轮 16:9、4:3、21:9 和两次运行/停止的证据见 [横屏图形验收报告](docs/reports/2026-10-26_issue-1_landscape-gui-acceptance.md)；[旧竖屏报告](docs/reports/2026-10-26_issue-1_windows-gui-acceptance.md) 继续作为历史保留。
5. Agent 从 `AGENTS.md` 开始阅读；功能编号和验收见 `docs/FEATURES.md` 与 `docs/features/`。完整证据见 [P1-01 报告](docs/reports/2026-10-26_issue-1_cocos-initialization.md)。

## 重要的系统保护规则

- **macOS：默认不自动启动 GUI**。不运行 Cocos Creator 编辑器、Cocos 命令行构建、微信开发者工具、浏览器、Electron/Playwright 图形调试或截图。允许经过审阅、确认无 GUI 副作用的 CLI 静态检查和纯逻辑单测，资源受控地在终端执行并等待退出。详见 [开发环境与测试红线](docs/DEV_ENVIRONMENT.md)。
- **Windows：允许按任务需要正常打开编辑器、游戏、浏览器、微信开发者工具和调试窗口**；仍禁止破坏无关文件/进程及系统配置。
- Cocos Creator **命令行构建也需要 GUI 环境**，不能把“从 Mac 终端运行”视作无界面调试；引擎构建优先放在 Windows。官方依据见 `docs/REFERENCES.md`。
- 没有测试证据不能写“已通过”；GUI 未执行必须写“未验证”。

## 技术与开发状态

| 项目 | 规划选择 | 当前状态 |
| --- | --- | --- |
| 游戏引擎 | Cocos Creator **3.8.8** | Windows Startup 横屏三种比例及停止/重启已验收；微信真机未验证 |
| 语言 | TypeScript **5.8.2** | 与该编辑器内置编译器一致；启动脚本类型检查通过 |
| 微信目标 | 微信小游戏，全项目首发横屏 | 后续构建设为 Landscape 并核验 game.json；本轮未构建/真机 |
| 游戏架构 | 公共大厅 + 插件化小游戏 + 各自存档 | 仍为目标架构；当前只有独立启动测试 |
| 联机 | 后期 Node.js + WSS 房间服务器 | 尚未开发 |
| 版本管理 | [muddyrain/yier-bubu-gamehouse](https://github.com/muddyrain/yier-bubu-gamehouse) + Issue/审查 | 使用 master；P1-01 已验收，Git 写入须逐次明确授权，交付记录见 Issue #1 |

## 安装依赖与无界面验证

已实测的 CLI 环境：Node.js **26.4.0**、npm **11.17.0**、Python **3.13.5**。Node/npm 版本记录在 `.node-version` 和根 `package.json`；Python 脚本需要 3.10 以上，本轮仅实测 3.13.5。编辑器自带运行时与外部 Node 相互独立。

在仓库根目录安装唯一依赖 TypeScript，按锁文件执行并禁用安装脚本：

```sh
npm ci --ignore-scripts --no-audit --no-fund
```

Windows PowerShell 如阻止 `npm.ps1`，使用 `npm.cmd`，无需修改执行策略。项目 `.npmrc` 也禁用依赖脚本；没有 GUI/build/dev/preview 类 npm 入口。

Windows 无界面检查：

```powershell
python -B tools/validate.py all
python -B tools/validate.py docs
python -B tools/validate.py unit
python -B tools/validate.py typecheck
```

macOS 仅运行经审阅的同一 CLI 脚本：

```sh
python3 -B tools/validate.py docs
python3 -B tools/validate.py unit
python3 -B tools/validate.py typecheck
```

`docs` / `unit` 各限时 30 秒；`typecheck` 限时 60 秒，串行执行，最多 120 秒检查预算。日志与 `summary.json` 写入 `.local/validation/p1-01/<UTC时间>/`。返回码为 0（通过）、1（检查失败）、2（缺少前置条件）；超时的单项记录退出码 124，外层返回 1。

类型检查预检 `node_modules/typescript/lib/tsc.js`、编辑器真实生成的 `client/temp/tsconfig.cocos.json`，以及 `client/temp/declarations/` 中的 `cc.d.ts`、`cc.env.d.ts`、`cc.custom-macro.d.ts`、`jsb.d.ts`；缺任何一项均报告 `blocked`，不会启动引擎，也不使用伪造 `cc` 类型。这些声明引用的实际引擎文件也必须存在；安装路径失效等内容问题由 tsc 报 `failed`。**Mac 不得为补齐文件自行打开 Cocos**；本轮没有 Mac 实测。源码保持严格类型检查，`skipLibCheck` 仅跳过引擎 `.d.ts` 内部检查。

`unit` 现包含工具行为和工程静态回归：meta 完整性/唯一性、场景对象及脚本引用、项目默认分辨率/适配策略、既有 Canvas/相机横屏参数、引擎版本、Git 忽略边界。纯 ZIP 无 `.git` 时仅跳过 Git 忽略规则测试，其余测试仍可执行，无需 Cocos 或 Node。审查包也不携带依赖和机器相关声明，直接执行 `typecheck` 的预期结果为 `blocked`。

原有只读命令 `python tools/check_docs.py`（Mac 用 `python3`）仍可使用；建议使用有超时和日志的 `validate.py docs`。源码、场景、`.meta`、共享 `settings` 和锁文件纳入版本控制；`client/settings/v2/packages/cocos-service.json`、`information.json` 属于本机服务/权益配置，由 `client/.gitignore` 精确忽略并保留原文件，不依赖全局 Git 配置。缓存、本机配置和日志均忽略。Git 操作仍需按 [WORKFLOW.md](docs/WORKFLOW.md) 单独授权。

## 文档导航

- [完整文档索引](docs/INDEX.md) · [单一阶段计划](docs/PLAN.md) · [Feature 总表](docs/FEATURES.md)
- [项目与玩法定义](docs/PRODUCT.md) · [系统架构](docs/ARCHITECTURE.md) · [技术选型](docs/TECH_STACK.md)
- [macOS / Windows 执行规则](docs/DEV_ENVIRONMENT.md) · [Git 与任务流程](docs/WORKFLOW.md)
- [文档格式与变更协议](docs/DOC_RULES.md) · [素材规范](docs/ART_ASSETS.md) · [素材授权台账](docs/ASSET_LICENSES.md)
- [联机设计](docs/MULTIPLAYER.md) · [验证规范](docs/TESTING.md) · [资源与风险](docs/RESOURCES.md)

## 本轮交付边界

**P1-01 / Issue #1** 仍为 `in_progress`，停止等待最终验收复审。用户已确认 [横屏基线](docs/reports/2026-10-26_issue-1_landscape-baseline.md) 的外部静态 Code Review 通过；本轮另获具体许可，完成 [Windows 横屏图形复验](docs/reports/2026-10-26_issue-1_landscape-gui-acceptance.md)，仅保存项目窗口证据，编辑器已关闭。[F-01 修复](docs/reports/2026-10-26_issue-1_config-ignore-fix.md)、旧竖屏报告与原审查包保留。Mac/微信真机与性能未验证；没有修改玩法、重建工程、提交或推送。
