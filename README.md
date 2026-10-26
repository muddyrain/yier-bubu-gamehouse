# 一二布布游戏屋（Yier & Bubu Gamehouse）

> 项目阶段：**仅完成第一版工程文档基线（草案）**；尚未创建 Cocos 工程、尚无可运行游戏。更新日期：2026-10-26。

一款以 **一二（小白熊）** 和 **布布（小棕熊）** 为平等双主角的微信小游戏合集。定位是「1 款有深度的精品主游戏 + 若干可反复游玩的经典玩法 + 统一大厅及成长」，未来支持邀请微信好友、创建双人房、选择角色、合作或对战。

## 首发范围（目标，不是已经完成）

| 类型 | 游戏 | 首发内容目标 | 联机方向 |
| --- | --- | --- | --- |
| 主游戏 | 一二布布守护小屋 | 24 关，先做 5 关垂直切片 | 双人合作 |
| 经典游戏 | 一二布布黄金矿工 | 30 关，先做 10 关垂直切片 | 双人协作，首个联机试点 |
| 经典游戏 | 一二布布合成乐园 | 合成图鉴、无尽和每日挑战 | 以后按需好友竞分 |
| 经典游戏 | 一二布布贪吃蛇 | 无尽、机关地图、记录 | 双人对战 |

**单人模式可选一二或布布。** 主题名称不锁定玩家角色。某游戏若两只熊能力不同，须明确公平性、单人补位与可达成的关卡目标。未来主打《一二布布双人冒险》，不属于首发承诺。

## 本文档包如何使用

1. 将 ZIP **解压到已经创建的 [GitHub 仓库](https://github.com/muddyrain/yier-bubu-gamehouse) 对应本地工作目录根层级**，使 `AGENTS.md` 和 `README.md` 位于仓库根目录；不要多嵌套一层文件夹，也不要合并进现有 `bubu-ai` 桌面项目。
2. Codex / 其他开发 Agent 从根目录 `AGENTS.md` 开始，阅读 `docs/PLAN.md` 和本次功能相关文档。
3. 用 `docs/FEATURES.md` 查功能编号，以 `docs/features/FEAT-xxx-*.md` 为验收详情。
4. 用户确认文档基线后，才能开始 P1 的工程初始化。本文档包**没有执行任何引擎安装、游戏调试或构建**。

## 重要的系统保护规则

- **macOS：默认不自动启动 GUI**。不运行 Cocos Creator 编辑器、Cocos 命令行构建、微信开发者工具、浏览器、Electron/Playwright 图形调试或截图。允许经过审阅、确认无 GUI 副作用的 CLI 静态检查和纯逻辑单测，资源受控地在终端执行并等待退出。详见 [开发环境与测试红线](docs/DEV_ENVIRONMENT.md)。
- **Windows：允许按任务需要正常打开编辑器、游戏、浏览器、微信开发者工具和调试窗口**；仍禁止破坏无关文件/进程及系统配置。
- Cocos Creator **命令行构建也需要 GUI 环境**，不能把“从 Mac 终端运行”视作无界面调试；引擎构建优先放在 Windows。官方依据见 `docs/REFERENCES.md`。
- 没有测试证据不能写“已通过”；GUI 未执行必须写“未验证”。

## 技术与开发状态

| 项目 | 规划选择 | 当前状态 |
| --- | --- | --- |
| 游戏引擎 | Cocos Creator **3.8.8**（进入 P1 时确认安装版本） | 未安装/未验证 |
| 语言 | TypeScript | 未建立源码 |
| 微信目标 | 微信小游戏，先竖屏交互 | 未验证真机 |
| 游戏架构 | 公共大厅 + 插件化小游戏 + 各自存档 | 方案阶段 |
| 联机 | 后期 Node.js + WSS 房间服务器 | 尚未开发 |
| 版本管理 | [muddyrain/yier-bubu-gamehouse](https://github.com/muddyrain/yier-bubu-gamehouse) + 小粒度 Issue/分支/审查 | GitHub 仓库已创建；文档尚未提交 |

**当前唯一提供的检查命令**：`python3 tools/check_docs.py`（Windows 用 `python tools/check_docs.py`），只读检查 Markdown 链接、Feature 编号和文档结构；不启动编辑器、浏览器或 GUI。当前**没有可以执行的 `npm run build`、`npm test` 等游戏命令**；应在 P1 建立真实脚本、验证副作用后才写入 README。不要虚构“运行成功”。

## 文档导航

- [完整文档索引](docs/INDEX.md) · [单一阶段计划](docs/PLAN.md) · [Feature 总表](docs/FEATURES.md)
- [项目与玩法定义](docs/PRODUCT.md) · [系统架构](docs/ARCHITECTURE.md) · [技术选型](docs/TECH_STACK.md)
- [macOS / Windows 执行规则](docs/DEV_ENVIRONMENT.md) · [Git 与任务流程](docs/WORKFLOW.md)
- [文档格式与变更协议](docs/DOC_RULES.md) · [素材规范](docs/ART_ASSETS.md) · [素材授权台账](docs/ASSET_LICENSES.md)
- [联机设计](docs/MULTIPLAYER.md) · [验证规范](docs/TESTING.md) · [资源与风险](docs/RESOURCES.md)

## 下一项工作（须单独明确授权）

**P1 / Issue #1：新建 Cocos 最小工程与安全检查脚本。** 验收将包括：Windows 上可打开大厅测试场景；macOS 上仅执行经审阅的无界面静态检查。当前仅交付文档，不自动继续。
