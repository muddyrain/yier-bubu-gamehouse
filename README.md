# 一二布布游戏屋（Yier & Bubu Gamehouse）

> 更新日期：2026-10-31。P1-01/02/03 已入库；P1-04 实现、Windows 真实验收及最终外部复审通过，本次按已审范围正式收尾入库，见 [演示报告](docs/reports/2026-10-30_issue-4_visible-demo.md)。阶段以 [PLAN.md](docs/PLAN.md) 为准，四款正式游戏仍开发中。

一款以 **一二（小白熊）** 和 **布布（小棕熊）** 为平等双主角的微信小游戏合集。定位是「1 款有深度的精品主游戏 + 若干可反复游玩的经典玩法 + 统一大厅及成长」，未来支持邀请微信好友、创建双人房、选择角色、合作或对战。

## 首发范围（目标，不是已经完成）

| 类型 | 游戏 | 首发内容目标 | 联机方向 |
| --- | --- | --- | --- |
| 主游戏 | 一二布布守护小屋 | 24 关；先做精致单关切片，再扩 5 关 | 双人合作 |
| 经典游戏 | 一二布布黄金矿工 | 30 关，先做 10 关垂直切片 | 双人协作，首个联机试点 |
| 经典游戏 | 一二布布合成乐园 | 合成图鉴、无尽和每日挑战 | 以后按需好友竞分 |
| 经典游戏 | 一二布布贪吃蛇 | 无尽、机关地图、记录 | 双人对战 |

**单人模式可选一二或布布。** 主题名称不锁定玩家角色。某游戏若两只熊能力不同，须明确公平性、单人补位与可达成的关卡目标。未来主打《一二布布双人冒险》，不属于首发承诺。

## 工程入口

P1-04 入口：先在现有 Lobby 确认一二或布布，再返回大厅选择「开发测试 · 进入操作场」。可点击移动目标计数、暂停/继续和退出；这是独立玩法模块，不是介绍弹窗，不切换或重建 Scene。双角色、三比例、双方各三次往返、输入/组件恢复与两次编辑器预览启停已实测，见 [演示报告](docs/reports/2026-10-30_issue-4_visible-demo.md)。

1. P1-01 已验收并入库，最终基线为 `0b4bf91`，见 [收尾报告](docs/reports/2026-10-26_issue-1_closeout.md)。P1-02 已通过完整源码复审并入库为 `5ac74c5`，Issue #2 已关闭；审查包一致性与当时最终检查见 [P1-02 收尾报告](docs/reports/2026-10-28_issue-2_closeout.md)。
2. 继续使用 **Cocos Creator 3.8.8 / Empty(2D)** 派生的 `client/`。大厅入口为新增 `client/assets/scenes/Lobby.scene`，Canvas 挂载 `LobbyView`；原 `Startup.scene` / `SmokeTest` 保持原字节，作为 P1-01 独立回归入口。
3. 大厅沿用 **1280×720** 横屏和完整显示策略，同规格展示白熊一二、棕熊布布，四款卡片全部标“开发中”。可查看介绍、帮助/设置说明和好友预告；新增独立“选择角色”入口，初次中立，选择后可确认、返回或再次选择。返回取消未确认改动，保留当前 LobbyView 实例内已确认角色；重载/重新预览清空。隐藏继续按钮，没有存档、正式小游戏或房间；另有内部开发测试入口。方向及留边取舍见 [ADR-0003](docs/decisions/ADR-0003-landscape-first.md)。
4. 既有 Windows **3.8.8** 已实际导入 P1-02 Lobby、识别 LobbyView，三份 Meta imported=true 且 UUID 不变。前次许可下的 **Preview in Editor** 完成三比例、七入口重复交互、遮罩、组件恢复与启停；画布聚焦后的键盘在独立可视本地预览验证。停止时重复销毁警告已作最小修复并复验；退出 IPC/WebContents 诊断保留。这是 P1-02 历史证据；P1-03 后续证据另见下项，构建入口/微信方向仍待实际构建。
5. 源码/静态记录见 [P1-02 开发报告](docs/reports/2026-10-27_issue-2_landscape-lobby.md)，前次暂缓历史见 [导入报告](docs/reports/2026-10-27_issue-2_windows-gui-import.md)，最新结果见 [GUI 验收报告](docs/reports/2026-10-27_issue-2_windows-gui-acceptance.md)。P1-01 [横屏图形报告](docs/reports/2026-10-26_issue-1_landscape-gui-acceptance.md) 和 [旧竖屏报告](docs/reports/2026-10-26_issue-1_windows-gui-acceptance.md) 仅证明当时 Startup，不证明新大厅。
6. P1-03 保留原场景、Meta、原七入口与回归，稳定 yier/bubu 确认结果仅在当前实例内有效，无真实游戏/存档。开发与失败见 [开发报告](docs/reports/2026-10-28_issue-3_character-selection.md)，原 19 张图与底色修复见 [GUI 证据报告](docs/reports/2026-10-28_issue-3_windows-gui-acceptance.md)。三比例、各角色三次、七入口、遮罩/取消、组件恢复、两次编辑器启停及正常退出证据见历史 [GUI 完成报告](docs/reports/2026-10-28_issue-3_windows-gui-completion.md)；其中 40—54 键盘截图重复，不能支持对应状态，最新更正见 [F-02 报告](docs/reports/2026-10-29_issue-3_f02-keyboard-evidence.md)。[暂停报告](docs/reports/2026-10-28_issue-3_windows-gui-followup.md) 和原 [源码审查包](docs/reports/2026-10-28_issue-3_final-review-preparation.md) 保留原字节。
7. Agent 从 `AGENTS.md` 开始；Feature 及完整文档见下方导航。图形操作遵守当次许可及用户的暂停/恢复安排，不自动重启。

P1-03 已入库，本轮已获 P1-04 开发授权推进 FEAT-003「选角 → 实际测试场景 → 大厅」。功能原型使用既有占位；商业化与正式发布授权上线前单独处理，最终仍接入黄小B真实原作。P1-04 先实现共享角色视觉创建接口；完整图像/动画加载仍未实现，不以文档声明代替代码。

## 重要的系统保护规则

- **macOS：默认不自动启动 GUI**。不运行 Cocos Creator 编辑器、Cocos 命令行构建、微信开发者工具、浏览器、Electron/Playwright 图形调试或截图。允许经过审阅、确认无 GUI 副作用的 CLI 静态检查和纯逻辑单测，资源受控地在终端执行并等待退出。详见 [开发环境与测试红线](docs/DEV_ENVIRONMENT.md)。
- **Windows：允许按任务需要正常打开编辑器、游戏、浏览器、微信开发者工具和调试窗口**；仍禁止破坏无关文件/进程及系统配置。
- Cocos Creator **命令行构建也需要 GUI 环境**，不能把“从 Mac 终端运行”视作无界面调试；引擎构建优先放在 Windows。官方依据见 `docs/REFERENCES.md`。
- 没有测试证据不能写“已通过”；GUI 未执行必须写“未验证”。

## 技术与开发状态

| 项目 | 规划选择 | 当前状态 |
| --- | --- | --- |
| 游戏引擎 | Cocos Creator **3.8.8** | Startup 已验收；Lobby 三比例/交互/启停已实测，详见 GUI 报告及保留诊断 |
| 语言 | TypeScript **5.8.2** | 与该编辑器内置编译器一致；启动脚本类型检查通过 |
| 微信目标 | 微信小游戏，全项目首发横屏 | 后续构建设为 Landscape 并核验 game.json；本轮未构建/真机 |
| 游戏架构 | 公共大厅 + 插件化小游戏 + 各自存档 | 大厅、局部选角/会话与开发操作模块已有真实图形往返/清理证据；存档及正式游戏未实现 |
| 联机 | 后期 Node.js + WSS 房间服务器 | 尚未开发 |
| 版本管理 | [muddyrain/yier-bubu-gamehouse](https://github.com/muddyrain/yier-bubu-gamehouse) + Issue/审查 | P1-04 已通过最终复审，本次获精确暂存、提交、普通推送及核实远端后关闭 Issue #4 的授权 |

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

`unit` 保留原 15 项（工具/工程 13 项、Lobby 资源引用和 9 组纯 TS 断言）原字节，P1-03 新增一个选角测试，共 **16 项 unittest**。新增 Node 子进程含 **13 组**选角行为/布局数学/视图 AST 契约断言；两个 Node 子进程分别限时 10 秒。逻辑测试需要现有 Node 和锁定 TypeScript，在内存运行无 cc 导入的模型，缺依赖时失败且不自动安装；不使用引擎桩，不证明真实事件/渲染。无 `.git` 时仅 Git 忽略测试 skip。新检出不带机器相关声明，直接 `typecheck` 应 `blocked`；不能在 Mac 自动打开 Cocos 补齐。

F-02 另加 4 项截图传输/解码回归，现共 **20 项 unittest**；需要已有 Pillow，未安装时明确 skip 新测试且图像审计 blocked，不自动安装。保存/审计工具不启动 GUI，不证明真实按键已通过；命令与证据门槛见 [TESTING.md](docs/TESTING.md)。

原有只读命令 `python tools/check_docs.py`（Mac 用 `python3`）仍可使用；建议使用有超时和日志的 `validate.py docs`。源码、场景、`.meta`、共享 `settings` 和锁文件纳入版本控制；`client/settings/v2/packages/cocos-service.json`、`information.json` 属于本机服务/权益配置，由 `client/.gitignore` 精确忽略并保留原文件，不依赖全局 Git 配置。缓存、本机配置和日志均忽略。Git 操作仍需按 [WORKFLOW.md](docs/WORKFLOW.md) 单独授权。

## 文档导航

- [完整文档索引](docs/INDEX.md) · [单一阶段计划](docs/PLAN.md) · [Feature 总表](docs/FEATURES.md)
- [项目与玩法定义](docs/PRODUCT.md) · [系统架构](docs/ARCHITECTURE.md) · [技术选型](docs/TECH_STACK.md)
- [macOS / Windows 执行规则](docs/DEV_ENVIRONMENT.md) · [Git 与任务流程](docs/WORKFLOW.md)
- [文档格式与变更协议](docs/DOC_RULES.md) · [素材规范](docs/ART_ASSETS.md) · [素材授权台账](docs/ASSET_LICENSES.md)
- [联机设计](docs/MULTIPLAYER.md) · [验证规范](docs/TESTING.md) · [资源与风险](docs/RESOURCES.md)

## 本轮交付边界

**P1-04 / Issue #4**：GameRegistry、冻结 GameSession、单活动 GameFlow 与可操作内部模块源码已接入。确认结果在进入前复制；每局新计数，暂停拦截玩法输入，退出解除模块输入/尺寸事件并释放自有节点，返回同一大厅保留其内存确认值。重新预览仍中立，没有存档/奖励/联网。

现共 21 项 unittest；生命周期原 20 组断言保持原文，F-01 追加 3 组迟到资源/取消/回收断言，套件共 23 组。锁定 TypeScript 5.8.2、资源归属契约及实际失败/修复验证见 [F-01 补充报告](docs/reports/2026-10-30_issue-4_f01-load-cancellation.md)。F-01 已外部源码复审通过，本轮未重构。实际导入后四份新脚本 Meta 仅 imported=true，UUID 不变；实际停止缺陷仅修正 DevelopmentModule 销毁方式，重新导入后两次活动模块启停通过，详见 [演示报告](docs/reports/2026-10-30_issue-4_visible-demo.md)。本次按已审范围和明确授权收尾提交、普通推送并核对远端后关闭 Issue #4；未录屏。

P1-03 的真实选角、F-02、历史失败及提交证据继续保留；其图形结果不能用作本轮新操作场的通过证据。
