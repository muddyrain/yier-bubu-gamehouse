# 任务报告 — Issue #3 / P1-03 本地双角色选择

> 报告日期：2026-10-28 | 系统：Windows NT 10.0.26200 | 功能：FEAT-002（关联 FEAT-001/003）| 分支：master，未创建新分支 | 交付：Code Review，GUI 未执行

## 1. 本次授权范围

输入为用户本轮明确开发授权及 [Issue #3](https://github.com/muddyrain/yier-bubu-gamehouse/issues/3)（读取时 open，0 评论）。已完整阅读 AGENTS、README、PLAN、DEV_ENVIRONMENT、DOC_RULES、WORKFLOW、FEAT-001/002/003、FEATURES、ADR-0003、架构/美术/测试规范和报告模板。现有 HEAD 为 `5ac74c5fbfef1e02505732577456f157e0c9277c`，开始时工作区及索引干净。当前没有 GitNexus 工具，检查能力后按原生只读 Git 继续。

范围：在已验收 P1-02 大厅中实现中立的双角色选择、选中/确认/返回/再次选择及非法 ID 保护，以稳定 ID 提供局部只读结果，并同步文档/安全 CLI。

明确不做：新场景/重建/引擎或依赖安装、可玩游戏、真实 GameSession、存档、FEAT-003 加载/卸载、好友服务/微信登录、正式角色美术。未获得本次 GUI 许可，不启动编辑器、预览、浏览器、图形自动化或截图。不执行 Git 暂存、提交、推送、PR、merge、关闭 Issue 或下一任务。

## 2. 实际交付与代码影响

新增 3 个文件：

- `tools/tests/character_selection.test.cjs`：直接执行真实无引擎 TS 模型与视图 AST 契约，共 13 组断言，无 cc 桩。
- `tools/tests/test_character_selection.py`：集成现有 unittest discover；只启动 Node CLI，shell=False，10 秒预算，不安装依赖。
- `docs/reports/2026-10-28_issue-3_character-selection.md`：本轮独立实现/验证证据。

修改 14 个文件：

- `client/assets/scripts/LobbyModel.ts`：复用 CHARACTERS，新增 CharacterId/CharacterChoice、unknown 校验、选角状态转换/状态文案和对称布局数据；四款目录仍 coming-soon。
- `client/assets/scripts/LobbyView.ts`：大厅独立入口、共用几何绘制、同一遮罩下互斥内容、选中/确认/再选/返回、可用控件焦点、只读结果 getter。保留事件配对及 P1-02 的严格有效性销毁修复。
- `README.md`：当前入口/行为、16 项安全回归及待许可 GUI 边界。
- `docs/FEATURES.md`：FEAT-002 转 in_progress，其他 Feature 状态不变。
- `docs/PLAN.md`：P1-03 in_progress，原任务完成记录及历史链接保留，P1 整体仍 in_progress。
- `docs/features/FEAT-002-character-selection.md`：先定义本轮流程、内存所有权、键盘/非法 ID 及真实集成待办。
- `docs/features/FEAT-001-game-lobby.md`、`docs/features/FEAT-003-game-module-lifecycle.md`：大厅接入及未来读取边界，原验收历史和 AC-03/选角 AC-02 待集成不变。
- `docs/ARCHITECTURE.md`：局部状态/结果与事件、生命周期边界；没有新增全局模块或空框架。
- `docs/ART_ASSETS.md`、`docs/ASSET_LICENSES.md`：复用同规格程序几何，选角卡片与占位登记；没有导入图片/字体/音乐，角色商用权仍 unverified。
- `docs/TESTING.md`：新增断言覆盖/限制及后续 GUI 验收步骤。
- `docs/INDEX.md`、`docs/CHANGELOG.md`：报告索引与重要变更记录。

共 **17 个路径（14 修改、3 新增），无删除**。上述分组中的成对文件分别计数；最终清单以 Git status 和本机 `final-checks.json` 为准。

交互决定：第一次没有默认角色，确认不可用，面板初始键盘焦点在返回按钮。一二/布布用同一绘制函数、相同 136×136 头像容器、360×292 卡片和字号，只有目录中的颜色/姓名/身份不同。焦点边框与已选底色/文字分开。确认说明「已选择一二/布布，游戏仍在开发中」，不会启动游戏。确认阶段需先再次选择才能修改；返回/Escape/禁用取消草稿，保留上次确认，重新进入使用确认值为草稿。实例销毁/重新预览则清空，不写盘。`getConfirmedCharacter(): CharacterChoice | null` 返回冻结对象或 null，未来 FEAT-003 尚未接入。

既有行为影响：原七入口、单遮罩、四款开发中/无存档/好友敬请期待语义保持。为放置新入口，双主角区下方朋友按钮下移，原尾部占位说明让位给选择入口；原七入口键盘顺序不变，新入口在其后。游戏卡/帮助说明更新为可从大厅本地选角；原 Startup/SmokeTest、场景、全部 Meta、配置和测试文件保持原字节。没有伪造引擎生成文件/导入结果。

## 3. 实际验证（静态与图形分开）

CLI 环境：Python 3.13.5、Node 26.4.0、锁定 TypeScript 5.8.2；复用原 node_modules、真实 `temp/tsconfig.cocos.json` 及 cc/cc.env/cc.custom-macro/jsb 四份声明。没有安装/更新环境；缺声明时既有入口会 blocked，不自动调用 Cocos。

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖 / 限制 |
| --- | --- | --- | --- | --- |
| Windows CLI | 初始 git status/branch/log、OS/Python/Node 检查、源文件哈希 | `passed` | `.local/validation/p1-03/before.json` | master/5ac74c5，干净工作区；保存既有 80 个受控文件及 2 个私有文件哈希，不复制私人内容 |
| Windows CLI | 编辑前 encoding-guard（两个现有 TS） | `passed` | `.local/validation/p1-03/encoding-before.log` | 未发现乱码/可疑文字丢失 |
| Windows CLI | 开发前 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261028T123925.462477Z/` | 原 15 项、tsc、文档基线 |
| Windows CLI | 首次开发后 `python -B tools/validate.py all` | `failed` | `.local/validation/p1-01/20261028T124217.097627Z/` | 文档/16 单测通过；tsc TS2345，分组动作联合不能收窄到原 LobbyAction，未跳过检查 |
| Windows CLI | 修复后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261028T124242.781649Z/` | 将新动作分成独立可判别成员；16 单测/13 新断言与原 9 组、tsc/文档通过，无降级配置 |
| Windows CLI | 文档同步后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261028T124834.880122Z/` | 16 项 unittest，无 skip；原 9 组 Lobby + 新 13 组断言，严格 tsc 退出 0；49 文档/12 Feature/114 相对链接通过 |
| Windows CLI | 首次任务级路径扫描 | `failed` | `.local/validation/p1-03/audit-attempt-1.log` | 本机辅助脚本把 https 链接的 s:/ 误判为盘符路径；未通过修改项目内容绕过扫描，修正匹配盘符的前置边界 |
| Windows CLI | 首次报告落盘复核 | `failed` | `.local/validation/p1-03/report-finalization-attempt-1.log` | 文档通过；路径扫描又把报告中上述孤立片段当作路径。辅助匹配增加实际路径部分要求，并用盘符路径/URL/孤立片段检查模式；两次误报均保留 |
| Windows CLI | `python -B .local/validation/p1-03/audit.py` | `passed` | `.local/validation/p1-03/final-checks.json`、`git-*.log`、`encoding-after.log` | 逐文件范围/UTF-8 无 BOM/已知私钥及绝对路径模式、Git diff --check、无暂存、HEAD 不变；原场景/Meta/测试/历史字节保留；不是完整安全审计 |
| Windows CLI | `git -c core.excludesFile= check-ignore -v -- <两份私有路径>`；`git ls-files -- <同路径>`；`git status --short --untracked-files=all` | `passed` | `.local/validation/p1-03/private-ignore.log`、`private-tracked.log`、`git-readable-status.log` | client/.gitignore 第 14/15 行命中；未跟踪且 status 不出现；两份文件哈希与开始一致，无覆盖/删除 |
| Windows GUI | 新选角导入、运行/三比例、两角色至少各三次进出、鼠标/键盘/遮罩、禁用恢复、停止再次预览 | `not_run` | 无新截图/引擎日志 | 未获本次具体许可；没有使用旧 GUI 结论代替 |
| Windows / FEAT-003 | 两角色进入同一可用游戏原型（FEAT-002 AC-02） | `not_run` | - | 本轮不开发真实游戏/会话，留待 FEAT-003 |
| macOS CLI / GUI | 实机验证 | `not_run` | - | 没有 Mac；仅审阅脚本的无 GUI 调用链，不代表实机通过 |
| 微信 / 性能 | 构建、真机触控/安全区、性能/长期泄漏 | `not_run` | - | 不属于本轮安全 CLI 证据 |

新增 13 组断言：中立/空确认、双角色冻结结果、非法 ID 拒绝/恢复、草稿取消/重入、再选、每角色三次与原七入口互斥、关闭模型的禁用语义、三比例容纳数学、焦点环绕、事件订阅/取消同函数、一次构造/单遮罩/安全销毁、可用控件键盘与点击门槛。源码 AST 检查不能证明实际引擎事件时序、无泄漏或视觉无重叠；`transpileModule` 不是类型检查，另由真实 tsc 检查严格类型。

本机审查辅助脚本、清单和日志全部位于已忽略的 `.local/`，不作为产品文件；报告落盘后的文档/编码/差异复核另写 `report-finalization.log`，不重写上面的首次失败证据。

## 4. 运行环境保护核对

本轮仅读文件/Issue、编辑 Issue #3 范围文本及受控 CLI。现有检查脚本先审阅：文档只扫描自有文件；unit 只启动标准库、Git 和两个 Node 纯模型/AST 子进程；tsc 只读且 noEmit。单项 30/30/60 秒、Node 各 10 秒，shell=False、等待退出；无 Cocos 构建/GUI/浏览器/headless 替代、屏幕读取或后台服务，无本轮 GUI 进程需要清理。不读取/操作无关程序、不修改系统/PATH/权限或用户数据。

两份本机服务/权益配置只计算哈希、核对不跟踪及项目忽略来源，不删除/覆盖或输出内容。缓存/依赖/原始本机证据仍忽略；最终核对见上表。P1-01/P1-02 的历史截图、原始警告/销毁失败/焦点失败/退出诊断及报告不改写。

## 5. 文档同步清单

- FEATURES：是，FEAT-002 进入 in_progress，其他 Feature 保持；不另建状态源。
- FEAT-002：是，流程/模型/验收定义；AC-01/03/04/05 因本轮 GUI 未执行不新勾选，AC-02 保留待集成。
- FEAT-001/003、ARCHITECTURE：是，接入和状态所有权/未来读取边界。
- PLAN：是，P1-03/P1 in_progress，P1-01/P1-02 done，不开启下一 Issue。
- TESTING、README、ART_ASSETS、ASSET_LICENSES、INDEX、CHANGELOG：是，实际实现/检查、素材复用与报告入口。
- PRODUCT/MULTIPLAYER/ADR-0003/AGENTS/DEV_ENVIRONMENT/WORKFLOW：不改，既有产品/横屏/联机与安全策略未改变；不新增 ADR 或空模块。

## 6. 未解决问题、风险和下一步

停止 Code Review。新选角尚未在真实引擎导入/运行，所有新 GUI 及受影响原入口交互为 not_run；下一轮须另获本次 Windows 前台/项目截图许可，再按 TESTING 的完整步骤验收并保留真实日志/失败。静态卡片几何和事件契约通过不保证文字实际排版、触控命中或组件生命周期通过。

FEAT-002 整体仍 in_progress，真实游戏 AC-02 待 FEAT-003；没有存档/会话或线上房间。Mac/微信/性能/正式角色授权及历史引擎退出诊断仍未解决。未经后续授权不暂存、提交、推送、关闭 Issue 或开始下一功能。
