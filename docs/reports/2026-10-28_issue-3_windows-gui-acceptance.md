# 任务报告 — Issue #3 / P1-03 Windows GUI 证据与验收缺口

> 报告日期：2026-10-28 | 系统：Windows NT 10.0.26200 | 功能：FEAT-002（关联 FEAT-001）| 分支：master | 结论：16:9 主要交互有证据，完整 GUI 矩阵未完成

## 1. 本次授权范围

本报告在最终复审准备轮次整理此前已保存的真实证据和交互记录，**没有在本轮重新操作或采集 GUI**。原开发轮次及其未执行记录保留于 [开发报告](2026-10-28_issue-3_character-selection.md)。后续用户明确授权 Windows 前台、Cocos/游戏预览窗口截图，并在其他游戏遮挡后回复「可以继续操作，Cocos 已置前且无遮挡」和「继续」。图形工具后续两次被用户物理 Escape 中断；停止后未用隐藏窗口继续。

范围：现有 3.8.8 打开原 client/Lobby，观察本地选角实际运行；仅保存游戏内容截图，遇到真实缺陷在 Issue #3 内最小修复。不安装、不重建、不导入正式素材、不开发游戏或 FEAT-003，不执行 Git 写入。

用户称 GUI 已完成，但现有原图和记录不足以支持完整三比例/生命周期结论。以下按实际证据分别记录，不将静态或 P1-02 历史结果替代本轮缺口。

## 2. 实际交付与代码影响

- `client/assets/scripts/LobbyView.ts`：真实未选卡片原用 PAPER，白熊与近白背景混同。双方未选卡片一并改用 `#EEE4D4`；卡片大小、角色颜色、几何绘制、流程和 UUID 不变。保留 `00` 失败图，再重新导入脚本并确认真实生成 JS 包含新底色，才重载拍摄 `02` 至 `06` 等通过图。仅重载而脚本尚未编译的阶段不算修复通过。
- `client/package.json`：真实编辑器添加顶层 `version: "3.8.8"`，保留现有 `creator.version` 与项目 UUID。本轮只检查并保留，没有再次修改。
- 原场景、所有 Meta、Startup/SmokeTest、原 15 项测试保持；本轮整理不再更改源码或测试。
- `.local/validation/p1-03-gui/`：19 张真实 1280×720 原图、原截图索引、浏览器控制台、早期交互日志和进程记录。早期 `interaction-log.json` 只记录到首次遮挡暂停，不能当成完整实时交互记录；本报告为事后汇总，未覆盖原文件。
- 编辑器生成的 `.url` 帮助快捷方式留在原位置，作为非源码产物从审查包排除；未打开其链接。

## 3. 实际验证（按证据分项）

实际环境为 Cocos Creator 3.8.8，先 Preview in Editor，随后使用**可视**本地 `http://localhost:7456/` 运行 Cocos 预览。正式截图时 GameCanvas 的 CSS 与 backing 均为 1280×720，截图裁取游戏区域、排除预览工具栏。没有用模拟设计图、脚本设置角色状态或伪造键盘事件代替真实输入。

| OS | 命令/GUI 步骤 | 结果 | 日志或证据 | 覆盖 / 限制 |
| --- | --- | --- | --- | --- |
| Windows GUI | 现有编辑器打开 Lobby，自动运行 LobbyView | `passed` | `project-paused.log`、现有 `client/temp/logs/project.log` | 3.8.8 与 Lobby enabled 标记；沿用旧 `[P1-02]` 日志文案，不代表新选角未运行 |
| Windows GUI | 首次未选卡片背景 | `failed` | `screenshots/00-initial-before-contrast-fix.png` | 白熊与 PAPER 混同；真实缺陷原图保留 |
| Windows GUI | 同底色修复、重新导入 LobbyView、重载 | `passed` | `02-neutral-16x9.png` 与真实生成 JS 检查记录 | 双方卡片均米色，白熊可辨；没有换角色素材 |
| Windows GUI | 16:9 大厅、首次无选择/灰确认门槛 | `passed` | `01`、`02` 原图 | 点击灰确认没有产生角色；双方名称/身份和四款开发中可见 |
| Windows GUI | 一二选择/确认、再次选择后布布选择/确认 | `passed` | `03`—`06` | 确认明确「游戏仍在开发中，仅本次大厅有效」，未创建游戏/存档 |
| Windows GUI | 返回大厅、重入、取消未确认草稿 | `passed` | `09`、`10`、`13` | 已确认布布保留，Escape 丢弃未确认一二；焦点与选中状态不同 |
| Windows GUI | Tab、四方向、Enter、Space、Escape | `passed` | `10`—`13`、此前实际输入记录 | 画布聚焦后实键操作；Left/Up 环绕到确认，Right/Down 回角色，Space 激活 |
| Windows GUI | 连续三次打开/选择/确认/返回 | `passed` | `14-cycle-*`、`15-cycle-*` 共 6 图 | 依次一二/布布/一二，未观察到面板叠加或重复可见响应；不是每角色各三次，也未统计实际节点/事件数量 |
| Windows GUI | 遮罩拦截背后设置入口 | `passed` | `16-mask-blocks-settings.png` | 选角仍保持打开，未弹设置；未覆盖所有区域/触摸设备 |
| Windows GUI | 4:3、21:9 完整选角画面 | `not_run` | 无合格对应比例原图 | 切换网页全屏后容器仍固定 1280、临时裁切，测试设置未完成；未断言产品布局通过或失败，未保存为正式证据 |
| Windows GUI | 每个角色各三次、原七入口完整回归 | `not_run` | - | 只有总计三次选角往返；P1-02 旧测试不代表本轮复验 |
| Windows GUI | 组件禁用/恢复、修复后编辑器完整两次启停 | `not_run` | 编辑器日志仅一次停止记录 | 可视浏览器多次重载成功不等于完成编辑器运行/停止/重启矩阵 |
| Windows GUI | 正常关闭本轮项目进程、确认无残留 | `not_run` | 复审准备时仍观察到同安装路径 17 个进程 | 操作被 Escape 中断，未完成清理；本轮不操作 GUI，不声称已退出 |
| Windows CLI | 底色修复后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261028T131732.553026Z/` | 16 项 unittest、真实 tsc、文档；不等于完整 GUI |
| macOS / 微信 / 性能 | 实机、构建、触控、安全区、长期泄漏 | `not_run` | - | 没有对应证据；FEAT-002 AC-02 真游戏集成仍留待 FEAT-003 |

截图原件均在 `.local/validation/p1-03-gui/screenshots/`，时间/尺寸见同级 `screenshot-index.json`（UTC 时间）。完整源码包内副本为 `review/evidence/gui/screenshots/`，逐文件 SHA-256 证明与原件一致。

| 原图文件 | 内容 / 判定 |
| --- | --- |
| `00-initial-before-contrast-fix.png` | 修复前失败图，不计入最终通过画面 |
| `01-lobby-16x9.png` | 大厅完整画面，未确认角色 |
| `02-neutral-16x9.png` | 修复后首次中立、确认不可用 |
| `03-yier-selected.png` | 一二选中 |
| `04-yier-confirmed.png` | 一二确认 |
| `05-bubu-selected.png` | 布布选中 |
| `06-bubu-confirmed.png` | 布布确认 |
| `09-return-lobby-bubu.png` | 返回大厅显示布布 |
| `10-tab-focus-not-selection.png` | Tab 焦点一二，已选仍为布布 |
| `11-left-up-focus.png` | Left/Up 焦点环绕到确认 |
| `12-right-down-space.png` | Right/Down/Space 激活角色 |
| `13-cancel-keeps-bubu.png` | Escape 取消草稿保留布布 |
| `14-cycle-1-confirmed.png`、`15-cycle-1-returned.png` | 连续第 1 次：一二确认并返回 |
| `14-cycle-2-confirmed.png`、`15-cycle-2-returned.png` | 连续第 2 次：布布确认并返回 |
| `14-cycle-3-confirmed.png`、`15-cycle-3-returned.png` | 连续第 3 次：一二确认并返回 |
| `16-mask-blocks-settings.png` | 点击背后设置区域未点穿 |

原始 `browser-console.json` 共 **54 条**（48 log、6 info、0 warn/error），包含 6 条启用标记，其中修复前、编译尚未刷新的运行也保留，不把全部标记计作修复后成功。编辑器项目日志保存 21:19:54 停止时 **1 条 IPC lost 警告**，21:19:55 预览环境重新初始化；没有据此宣称引擎停止诊断已修复，也没有把编辑器初始化当作第二次游戏运行。项目日志含安装路径，导出时仅脱敏路径，原始本机日志保留。

早期窗口切换曾对已销毁的启动窗口操作失败，刷新后选取项目窗口；脚本重新导入后一次旧菜单元素点击失败（菜单已关闭），没有重复修改工程。其他游戏遮挡时暂停且未保存桌面证据；两次 Escape 中断、比例设置未完成和编译未刷新的阶段均不改写成通过。

## 4. 运行环境保护核对

前次仅操作许可范围的项目/实际可视预览；截图为 GameCanvas 内容，不包含无关桌面。当前准备轮次仅读取已保存 PNG 和日志，未重新采集屏幕、启动/操作窗口、安装依赖或修改系统。前次项目进程未完成正常关闭，本轮只按现有编辑器安装路径读取元数据计数，没有读取无关程序、强制终止或声称环境已清理。没有删除/覆盖两份私有配置。

## 5. 文档同步清单

- PLAN：P1-03 保持 in_progress，明确主要 GUI 证据与剩余项。
- FEAT-002：AC-01/04 以 16:9 真实身份/重入记录、AC-03 以纯模型非法 ID 测试支持；AC-02/05 不勾选，Feature 状态仍在 FEATURES 且不改 done。
- README、FEAT-001、ARCHITECTURE、ART_ASSETS、TESTING：更新新代码真实证据和底色修复边界；历史 P1-01/P1-02 和原开发报告原文保留。
- INDEX、CHANGELOG：新增本报告和最终复审准备报告入口。
- ASSET_LICENSES、ADR、PRODUCT、MULTIPLAYER、AGENTS、DEV_ENVIRONMENT：本轮不再改；没有新美术、架构或安全策略变化。

## 6. 未解决问题、风险和下一步

完整 GUI 矩阵尚缺 4:3/21:9、每角色各三次、原七入口完整回归、组件恢复、修复后完整两次编辑器启停与退出清理。不能把 19 张 16:9 原图说成用户原要求的全部 8 类画面（其中两类比例截图缺失）。没有观察到所测浏览器交互的阻断错误，不代表所有引擎窗口和未测试行为无错误。

本轮将现有可审查源码/真实证据完整打包，停止等待复审，不擅自补跑 GUI。剩余图形验收/正常关闭仍需用户安排并授权；FEAT-002 真游戏集成待 FEAT-003，正式角色权利仍 unverified，无新功能/Git 操作。
