# 任务报告 — Issue #4 / P1-04 F-01 异步加载取消资源回收

> 报告日期：2026-10-30（Asia/Shanghai；开始于 2026-10-29 23:56）| 系统：Windows 11 / 10.0.26200 | 功能：FEAT-003 | 分支：master | 交付：F-01 源码/CLI 复审，GUI not_run

## 1. 本次授权范围

仅处理外部源码复审 F-01，不重新开发已审操作场、选角或视觉。已读取 AGENTS、README/PLAN、DEV_ENVIRONMENT、DOC_RULES、WORKFLOW、FEATURES、FEAT-003、GameLifecycle/DevelopmentModule、原测试和 [首轮开发报告](2026-10-29_issue-4_game-lifecycle.md)；外部审查文档作为问题证据，执行权限只来自用户本轮要求。采用 GitNexus/encoding-guard 流程；GitNexus 工具不存在，使用只读原生 Git。

开始 HEAD 为 `85dd82e7b6bc60065f0ce6ef333e8cde926e303a`，索引为空。`.local/validation/p1-04-f01/before.json` 记录 108 个既有工作文件与两份私有配置哈希，working-before/ 保存原文件，index-before.backup 保存初始索引。保留此前 24 路径、素材研究/规划、.url、旧场景/全部 Meta、依赖与历史证据；不重装、不重建、不操作 GUI/浏览器/预览/截图、不执行 Git add/commit/push/PR/merge/关闭 Issue。

## 2. 实际交付与代码影响

根因：finish 在 load 尚未完成时清理模块并设置 cleaned；旧 load 在该次 exit/dispose 之后仍可创建资源，而迟到回调只拒绝 enter，既未拥有迟到资源，也无法靠 cleaned 再次清理。本机用等待 Promise、取消后才创建句柄的原接口夹具实际复现了残留。

采用最小的**协作式资源归属协议**，没有再次调用旧模块的 exit/dispose，也没有新增异步框架：

- GameFlow 每次 start 独立创建 LoadResources。异步 load 每次取得资源后，在保存、使用或下一次 await 前立即 `cancellation.retain(() => 释放该具体句柄)`。返回 true 才使用；false 表示取消且已尝试释放，必须停止使用。作用域独占登记资源的释放，模块不可重复释放同一资源。
- finish 先将该作用域封闭，原 exit/dispose 仍按原顺序各调用一次，再逆序回收已登记句柄并清空队列。取消以后 retain 同步尝试释放，不再进入队列；在释放函数成功的前提下，旧 load 的迟到 resolve 或 reject 都不会残留已登记资源。
- 封闭标记检查与登记/释放在同一同步调用中，没有中间 await；取得早于取消的资源在退出队列中，晚于取消的资源立即释放。每次加载作用域独立，回调捕获具体旧句柄，不读取新 current；旧完成也继续受原记录身份检查保护。
- 一个释放抛错仍继续其余释放，记录原错；当前退出时失败沿用禁止重开策略。迟到释放失败只记录旧错误，不修改已经运行的新会话，不能把抛错资源宣称回收成功。

协议不强制终止 Promise，不会自动发现未登记的资源。未来异步模块必须遵守立即登记和停止使用约定；本轮同步 DevelopmentModule 不取得异步资产，节点/订阅继续按原 exit/dispose 管理，无需修改。原无协议复现夹具保留为旧契约反例，不冒称不遵守新协议的任意模块也已安全。真实 Cocos/Asset Bundle 回收仍未验证。

**相对本轮开始共 12 路径：11 修改、1 新增，无删除。** 原 24 路径完整保留，P1-04 累计只增加本补充报告路径。

| 类型 | 路径 | 本轮增量 |
| --- | --- | --- |
| 修改 | `client/assets/scripts/GameLifecycle.ts` | LoadCancellation.retain、每次加载的独立资源作用域、取消封闭与释放 |
| 修改 | `tools/tests/game_lifecycle.test.cjs` | 在原 20 组之后追加 3 组资源存活/取消/错误回归 |
| 修改 | `tools/tests/test_game_lifecycle.py` | 完整通过数从 20 收紧为 23，仍为原 21 unittest 中的同一测试 |
| 修改 | `docs/ARCHITECTURE.md`、`docs/features/FEAT-003-game-module-lifecycle.md` | 登记责任、取消顺序、释放异常与未登记资源边界 |
| 修改 | `docs/TESTING.md`、`README.md` | 真实负向测试、现有命令和验证边界 |
| 修改 | `docs/PLAN.md` | F-01 当前停点；P1/P1-04、相关 Feature 状态不变 |
| 修改 | `docs/INDEX.md`、`docs/CHANGELOG.md` | 新报告导航与本次修复记录 |
| 修改 | `docs/reports/2026-10-29_issue-4_game-lifecycle.md` | 只追加 F-01 更正/后续链接，原开发/失败历史不改 |
| 新增 | `docs/reports/2026-10-30_issue-4_f01-load-cancellation.md` | 本报告 |

独立修复差异保存于 `.local/validation/p1-04-f01/F01.patch`（以本轮 working-before 为基线，包含原未跟踪源码的本次增量），配套 F01-code.patch（仅三份源码/测试差异）、F01-files.txt / F01-SHA256SUMS.txt。补丁 UTF-8/LF、无 CR；SHA 清单校验实际工作文件字节，JSON 清单同时列出归一化 LF 的补丁结果哈希。不能把相对 HEAD 的整个工作区 diff 当成本轮修复范围。原完整审查 ZIP 不改写。

## 3. 实际验证（无验证则写 not_run）

复用原 Windows Python 3.13.5、Node 26.4.0、锁定 TS 5.8.2 和真实 Creator 3.8.8 temp 配置/声明。审阅 validate 固定命令：docs/unit 各 30 秒、tsc 60 秒串行；Node 仅在内存执行真实无 cc 模型，包装器 10 秒。新测试无网络、引擎、浏览器、计时常驻或依赖安装。逐次日志位于 `.local/validation/p1-04-f01/`，完整 validate 日志仍写既有 p1-01 目录。

| OS | 实际命令/步骤 | 结果 | 日志/证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | 初始 HEAD/status/index、工作文件和私有哈希备份；编辑前 encoding-guard | `passed` | before.json、working-before.diff、index-before.diff、encoding-before.log | 索引为空；108 原文件、私有文件内容未导出 |
| Windows CLI | `python -B tools/validate.py all` 修复前基线 | `passed` | baseline-cli.log；`.local/validation/p1-01/20261029T155625.860915Z/` | 原 21 unittest、生命周期 20 组、文档/tsc |
| Windows CLI | `node .local/validation/p1-04-f01/reproduce_f01.cjs` 修复前反例 | `failed` | reproduction-before.log | 先取消再创建资源，实测 resourceAliveAfterCancelledLoad=true，回收断言失败；保留原输出 |
| Windows CLI | `node tools/tests/game_lifecycle.test.cjs` 仅加测试、未修源码 | `failed` | regression-before-fix.log | 原 20 组全部通过；新协议尚无 retain，后继资源模块未成功进入，新增第 21 组失败，非已修产品结果 |
| Windows CLI | `node tools/tests/game_lifecycle.test.cjs` 修复后 | `passed` | regression-after-fix.log | 23 组；迟到创建后 resolve/reject、owner 销毁、正常/失败退出、释放异常继续清理 |
| Windows CLI | `python -B tools/validate.py all` 源码修复后 | `passed` | post-code-cli.log；`.local/validation/p1-01/20261029T155815.091122Z/` | 21 unittest 无 skip，生命周期 23 / 选角 13 / 大厅 9 组，真实 tsc 与文档通过 |
| Windows CLI | `python -B tools/validate.py all` 文档同步后完整回归 | `passed` | final-cli.log；`.local/validation/p1-01/20261029T160255.868070Z/` | 21 unittest 无 skip，生命周期 23 / 选角 13 / 大厅 9 组，真实 tsc 与文档通过 |
| Windows CLI | `python -B tools/validate.py all` 报告结果补写后完整回归 | `passed` | final-documented-cli.log；`.local/validation/p1-01/20261029T160546.931393Z/` | 21 unittest 无 skip、同三套 Node、真实 tsc；文档 61 Markdown / 12 Feature / 192 相对链接 |
| Windows CLI | `node node_modules/typescript/lib/tsc.js --version`、encoding-guard | `passed` | typescript-version.log、final-encoding.log | 实际版本 5.8.2；UTF-8/中文未损坏，无安装 |
| Windows CLI | `python -B .local/validation/p1-04-f01/audit.py`（只读安全核查） | `passed` | safety-audit.log、audit-results.json、private-ignore.log、diff-check.log | 仅 11 修改/1 新增；97 原文件字节相同，原 24 路径在，原 20 组 Node 原文相同，3030 历史文件和旧 ZIP/研究/私有配置保持；HEAD/index 未变 |
| Windows CLI | `git apply --check --whitespace=error --directory=.local/validation/p1-04-f01/patch-baseline .local/validation/p1-04-f01/F01.patch` | `passed` | patch-check.log（定稿后再次预检记录于 checks.jsonl） | 只在忽略目录中的 LF 基线副本严格预检；不应用到真实工作区或索引，不绕过空白错误 |
| Windows GUI | 新 Meta 导入、双角色操作场/三比例/重复往返/输入/组件/启停/清理 | `not_run` | 无新截图/引擎日志 | 本轮明确禁止 GUI；旧大厅/选角 GUI 不抵扣 |
| macOS / 微信 / 性能 | Mac 实机 CLI、微信、长期泄漏/正式资源包 | `not_run` | - | 本轮仅 Windows 纯逻辑与类型验证 |

新增负向测试使用真实异步 Promise 与可观察句柄 alive/releases，取消后才产生旧资源，并使新会话资源继续存活；断言旧资源 alive=false、释放一次、新 snapshot/session/发布次数不变、新资源 alive=true，之后正常退出新会话再释放一次。没有 Cocos 桩、截图或手写 passed 独立证据。所有原 20 组断言原文保持，包装器只收紧计数；原 21 Python 测试项未删除/跳过。

本报告只补充上述实际结果与证据定位后，再复检文档、编码、完整修复差异、清单/哈希及保留状态，逐条实际退出码见 checks.jsonl。Git 原有 LF→CRLF 提示保留在日志，不是空白错误；没有更改 autocrlf、忽略 whitespace 错误或重写历史失败记录。

## 4. 运行环境保护核对

只运行文件编辑、Git 只读和有限时 CLI，等待自有子进程退出；未启动/控制 GUI、浏览器、预览、截图或无关用户进程，无本轮 GUI 进程需清理。没有依赖安装、权限/PATH/账号设置更改。

两份私有配置、本机 .local、研究报告、素材台账/ART 原文、.url 和所有历史证据保留，不进入修复文件清单；报告仅引用忽略目录内的证据位置。Git 禁用全局 excludes 后两份配置仍精确匹配 client/.gitignore 第 14/15 行，.local 匹配根规则第 11 行；私有配置均未跟踪且哈希未变。HEAD/index 不写入，未触及 GitHub Issue。最终命令、退出码、文件哈希和差异预检记录位于本轮 checks.jsonl 与 audit-results.json；原失败日志不删除，旧 24 路径完整审查 ZIP 的 SHA-256 仍为 `43d0925419f2472eafee8cbe23e6dfaa8fa3073dcace6cf09c13423f89bec48f`。

## 5. 文档同步清单

- FEAT-003 / ARCHITECTURE：协作协议、所有权、迟到资源与失败边界。
- TESTING / README：23 组纯逻辑回归和原命令，真实 GUI 未执行。
- PLAN：只补 F-01 停点，不改变 P1/P1-04 in_progress；FEATURES 不变，FEAT-001/002/003 继续 in_progress，AC 未勾选。
- INDEX / CHANGELOG：报告与本次修复记录；原开发报告仅追加更正链接，原失败历史保留。
- ART_ASSETS / ASSET_LICENSES / FEAT-001/002/012 / AGENTS / DEV_ENVIRONMENT / DOC_RULES / WORKFLOW / ADR、所有旧 Scene/Meta：无本轮改动。未新增美术、授权、产品范围或环境规则。

## 6. 未解决问题、风险和下一步

停止在 F-01 Code Review。协议正确性前提是模块登记每个异步取得的资源、释放函数只操作自己的具体句柄并成功释放；未登记、释放抛错或任意第三方资源 API 的行为不能由框架推断。新同步操作场仍须下一轮明确 GUI 许可，提供真实导入/运行/输入/布局/清理证据，才可评估集成 AC。正式四游戏、存档、网络、真实 IP 素材和性能不在本轮。没有提交、推送、关闭 Issue 或开始下一个功能。
