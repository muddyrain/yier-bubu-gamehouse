# 任务报告 — Issue #4 / P1-04 最小注册、会话与操作模块

> 报告日期：2026-10-29（Asia/Shanghai）| 系统：Windows 11 / 10.0.26200 | 功能：FEAT-003（集成 FEAT-001/002）| 分支：master | 交付：源码与 CLI 审查，所有新增 GUI 为 not_run

## 1. 本次授权范围

用户授权 [Issue #4](https://github.com/muddyrain/yier-bubu-gamehouse/issues/4) 范围的源码、测试、文档和完整源码审查包。已完整读取 Issue、AGENTS、README/PLAN、DEV_ENVIRONMENT、DOC_RULES、WORKFLOW、FEAT-001/002/003、FEATURES、ARCHITECTURE、TESTING、ADR-0003、报告模板及相关代码；使用 GitNexus/encoding-guard/game-ui-ux 技能。GitNexus 工具不可用，回退原生只读 Git。

开始 HEAD 为 `85dd82e7b6bc60065f0ce6ef333e8cde926e303a`，索引为空；11 份调研/规划修改、来源报告和编辑器 .url 两个未跟踪文件均在。`.local/validation/p1-04/before.json` 保存 97 个工作文件、两份私有配置本机哈希和 3030 个历史材料摘要，原工作文件另存副本；私有内容不复制或导出。

不启动 Cocos/浏览器/预览/图形自动化/截图，不重装/重建，不开发完整四游戏、存档、奖励或联网，不导入正式角色图，不 add/commit/push/PR/merge/关闭 Issue 或启动下一任务。Windows 本轮尚无具体 GUI 许可，Mac 红线不变。

## 2. 实际交付与代码影响

### 实现与取舍

采用 **同一 Canvas 下的独立运行时玩法模块**，不调用 director.loadScene、不改序列化 Lobby/Startup 或原 Meta。操作场是独立节点树与输入 owner，有可点击/键盘操作的移动目标和真实计数，可暂停、继续和退出；不是新的静态介绍弹窗。这样无需为单个内部测试引入跨 Scene 全局会话传递器；真正 Cocos 运行/切换/清理仍须 GUI 实证，本轮不能宣称已运行场景。

大厅先确认角色、返回首页，再进入「开发测试 · 进入操作场」。未确认拒绝；从既有 getConfirmedCharacter() **只读取一次 ID**，校验后复制到冻结 sessionId/gameId/mode/characterId。只注册 `development-counter` 的 solo，四款正式卡片仍 coming-soon；未知 ID/mode 和非法角色可恢复提示，coop/versus 仅类型扩展位。

GameFlow 是单个 Lobby 实例的生命周期 owner，加载前占用活动记录，load/enter 成功后 running；pause/resume 幂等。加载取消先标记失效并清理，迟到成功/失败不会复活旧局或覆盖新局。启动/暂停/继续异常记录原错并回到大厅；exit 与 dispose 分别尝试，清理异常封闭再次启动并提示重新预览，不用叠加新模块掩盖失败。没有全局 GameManager、计时器、update 轮询、音频、网络或存档。

模块自己订阅按钮、键盘、Canvas 尺寸；退出解除同一批订阅并隐藏，dispose 移除自建根节点后以 strict isValid 保护销毁。大厅在模块活动时隐藏且不消费自己的键盘输入，组件禁用/销毁会退出模块。返回相同 Lobby 保留其原内存确认，计数每局归零；重新预览中立。角色视觉由共享 CharacterVisualRenderer.create 接口创建，沿用原几何/身份/尺寸，不重新设计正式形象；真实图像/动画/异步素材加载尚未实现或验证。

### 本轮路径清单

**24 个本轮路径：13 修改、11 新增，无删除。** 本轮增量以 working-before 为基线另存 task-only-working.patch；完整工作区 Git diff 包含旧研究余量，不可直接整体提交。

| 类型 | 路径 | 用途 |
| --- | --- | --- |
| 修改 | `client/assets/scripts/LobbyView.ts` | 独立开发入口、读取确认/启动、生命周期输入隔离与禁用/销毁退出；原选角模型不改 |
| 新增 | `client/assets/scripts/GameLifecycle.ts`、同名 `.ts.meta` | 注册表、稳定 runtime GameId/GameMode、冻结 GameSession、单活动控制器及取消/错误清理 |
| 新增 | `client/assets/scripts/CounterModel.ts`、同名 `.ts.meta` | 真实目标计数/位置与暂停/销毁规则，无引擎 |
| 新增 | `client/assets/scripts/DevelopmentModule.ts`、同名 `.ts.meta` | 独立 Cocos 操作场、目标/暂停 UI、输入/尺寸订阅及释放 |
| 新增 | `client/assets/scripts/CharacterVisual.ts`、同名 `.ts.meta` | 大厅/选角/操作场共用的可替换视觉创建接口，原几何不改 |
| 新增 | `tools/tests/game_lifecycle.test.cjs`、`tools/tests/test_game_lifecycle.py` | 20 组真实纯模型断言，Node 子进程限 10 秒；原 20 项文件不改 |
| 修改 | `README.md`、`docs/PLAN.md`、`docs/FEATURES.md` | 当前入口/实际授权/阶段、FEAT-003 in_progress，未提前 done |
| 修改 | `docs/ARCHITECTURE.md`、`docs/features/FEAT-001-game-lobby.md`、`docs/features/FEAT-002-character-selection.md`、`docs/features/FEAT-003-game-module-lifecycle.md` | 模块选择、session 所有权、生命周期/视觉边界和真实集成待验收 |
| 修改 | `docs/ART_ASSETS.md`、`docs/ASSET_LICENSES.md` | 原几何复用与 DEV-P1-04 内部占位登记，来源研究全文保留，不新增授权 |
| 修改 | `docs/TESTING.md`、`docs/INDEX.md`、`docs/CHANGELOG.md` | 实际验证、后续 GUI 证据矩阵、报告导航及变更行 |
| 新增 | `docs/reports/2026-10-29_issue-4_game-lifecycle.md` | 本报告 |

四份新 Meta 为源码分配的新 UUID，明确 imported=false；未执行编辑器导入，也未伪造 cc 声明、场景序列化或生成缓存。旧场景、全部旧 Meta、Startup/SmokeTest、LobbyModel、依赖/锁文件与原测试文件均保持原字节。

### 独立调研与审查包

素材台账 SRC/CAND/联系人与原稿建议、旧调查报告、FEAT-012 和 .url 保留。共享文档只做本任务的状态/实现补充；本机工作区继续包含原研究，未另建权属事实源。审查包在忽略目录创建独立副本：以 HEAD + 本轮投影文档/源码组成项目上下文，**不把原研究余量放入本轮功能差异**。历史报告中必要的过程说明仍保留。

目标包为 `.local/validation/p1-04/P1-04-source-review-2026-10-29.zip`，含完整相对路径源码/Meta/配置/原测试/文档上下文、覆盖新增文件的 patch、24 路径清单、文件 SHA-256、真实 CLI 日志（导出副本脱敏）与未验证矩阵。review/ 全是审查辅助，不能提交；排除 .git/.local 原树、依赖/缓存、私有配置、.url、独立来源调查及未许可媒体。包外 .sha256 和 package-verification.json 记录实际归档核验，不能以包 CRC 推定 GUI 通过。

## 3. 实际验证（无验证则写 not_run）

环境复用 Python 3.13.5、Node 26.4.0、锁定 TypeScript 5.8.2、已有 Pillow 12.3.0 及真实 Creator 3.8.8 temp 配置/四份声明。既有 validate 固定白名单，docs/unit 各 30 秒、tsc 60 秒串行；新增 Node 纯逻辑子进程 shell=False、10 秒，不导入 cc，不装依赖或启动引擎。日志保存在本轮目录及各次 validate 原始目录，失败不覆盖。

| OS | 实际命令/步骤 | 结果 | 日志/证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | 初始 HEAD/status/空索引、编码、工作区/私有与历史保留基线 | `passed` | before.json、initial-status.log、encoding-before.log | 97 文件/3030 历史材料保留；不输出私人配置内容 |
| Windows CLI | 开发前 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261029T150756.744339Z/`、baseline-cli.log | 原 20 项、真实 tsc/文档通过 |
| Windows CLI | 首次代码后完整 CLI | `failed` | `.local/validation/p1-01/20261029T151739.161029Z/`、post-code-cli.log | docs/tsc 通过；新增夹具把 undefined ID 经辅助函数默认参数改为合法值，未知 ID 断言失败。未删断言或放宽产品校验 |
| Windows CLI | 改为直接传入原始非法 ID 后完整 CLI | `passed` | `.local/validation/p1-01/20261029T151815.824049Z/`、post-fixture-fix-cli.log | 21 unittest 无 skip，原 9+13 组与新 20 组，真实 tsc/文档通过 |
| Windows CLI | 文档与只读 ID 复制/恢复状态复核后的最终 CLI | `passed` | `.local/validation/p1-01/20261029T152807.298246Z/`、final-cli.log、final-cli-summary.json | 21 unittest 无 skip，原 9+13 组和新 20 组，真实 tsc/文档均退出 0；仅报告定稿后另复检文档 |
| Windows CLI | 文档增量 Git whitespace 前两次检查 | `failed` | diff-check.log、diff-check-after-newline-fix.log、doc-newline-fix.json | 辅助拼接器把已有 CRLF 再转换形成 README/PLAN 的 9 处 CRCRLF，先修正后余一个 EOF 空行；失败文件副本与日志保留 |
| Windows CLI | 文档换行/EOF 修正后 Git whitespace 检查 | `passed` | diff-check-final.log、diff-check-verified.log | 只去除新增 CR 字节/尾空行，没有忽略空白错误、转换原研究正文或修改 Git 配置 |
| Windows CLI | 文档/编码/Git 忽略、范围/原字节保留 | `passed` | audit-results.json、private-ignore-final.log、private-tracked-final.log、diff-check-verified.log、encoding-after.log | 24 本轮路径，84 个非本轮原文件、3030 历史材料/旧场景/Meta/测试/私有配置保持；研究来源与原稿建议原文保留 |
| Windows CLI / 导出 | 投影副本文档、三套原逻辑套件及 LF patch 预检 | `passed` | export-docs.log、export-lobby_model.log、export-character_selection.log、export-game_lifecycle.log、review-patch-check.log | 导出源码 9+13+20 组直接 Node 检查，用临时 NODE_PATH 指向原锁定依赖，不复制/安装；24 路径 patch 在忽略目录 HEAD 副本严格预检通过 |
| Windows CLI / 导出 | 干净包 typecheck 前置检查 | `blocked` | export-typecheck.log 及导出目录临时日志 | 缺 node_modules 和真实引擎声明，预检按设计返回 2，不启动引擎或伪造类型；原仓库真实 tsc 已通过 |
| Windows CLI / ZIP | CRC、逐文件 SHA-256、路径/敏感内容排除和解包核验 | `passed` | package-verification.json、ZIP 同名 .sha256、包内 review/SHA256SUMS.txt | 原始代码/Meta 与投影文档逐字节核对，未夹带研究/私有/缓存文件；不证明 GUI 运行 |
| Windows GUI | 导入/双角色/目标操作/暂停/返回/三比例/原交互/组件恢复/两次启停 | `not_run` | 无新截图或引擎日志 | 未获本次前台与截图许可，未启动任何窗口，旧 GUI 不抵扣本模块验收 |
| 跨游戏 / 视觉 | 真实不同正式 GameId 的场景状态隔离、获权图像替换 | `not_run` | - | 只有两个 fixture ID/新实例的模型隔离；FEAT-003 AC-04/06 不提前勾选 |
| macOS / 微信 / 性能 | 实机 CLI、构建/真机触控/安全区、性能/长期泄漏 | `not_run` | - | 当前 Windows CLI，未放宽 Mac 红线或执行设备验证 |

新 20 组覆盖：注册/目录真实性、非法 ID/mode/角色、双角色及一次读取/冻结 session、load/enter 顺序与重复请求、真实计数/暂停、退出幂等/旧引用失效、每角色三次、两 fixture ID 隔离、取消/迟到成功与失败、工厂/加载/进入/暂停/恢复异常、退出和 dispose 失败逐项尝试与封闭重启、销毁时取消、工厂重入取消、计数/目标循环及三比例容纳数学。Probe 是生命周期接口的纯逻辑错误/延迟夹具，不能证明 Cocos 回调时序、节点/订阅无泄漏或视觉正确。

本机只读搜索一次将 PowerShell glob 直接交给 rg，返回路径格式错误；改为 --glob 参数后读取成功。新代码按 ES2015 配置使用 Array.from/indexOf，没有引入 flatMap/includes 运行时前提。此类辅助读取/实现审查不当作产品测试通过或 GUI 证据。

## 4. 运行环境保护核对

本轮只有文件读取/编辑、Git 只读、受控纯 CLI；没有 Cocos 构建/编辑器、浏览器、隐藏/headless 绕过、截图/键鼠、依赖安装、系统/账号/PATH 修改或无关进程操作。短时 CLI 均等待退出，无本轮 GUI 进程需清理。

两份私有 Cocos 配置保持原字节、未跟踪，禁用全局 excludes 后仍由项目 client/.gitignore 精确忽略；.local 为本机证据目录，不将其副本提交。全局 Git 索引仍为空，HEAD 不改；不执行 add/commit/push/PR/merge/关闭 Issue。旧失败原图、索引、日志、包与源调研不覆盖。

## 5. 文档同步清单

- PLAN / FEATURES：P1-04、FEAT-003 in_progress；P1-03 done 保留，FEAT-001/002 不提前 done。
- FEAT-003：源码机制/模块选择/清理与异常、真实验收门槛；所有 GUI AC 保持未勾选。
- FEAT-001/002：实际 getter/模块集成边界；AC-03/AC-02 保持待 GUI，不用纯模型代替。
- ARCHITECTURE / README / TESTING：实际接口/输入所有权、原偏好与局内状态、操作方法、已执行 CLI 和待许可真实证据。
- ART_ASSETS / ASSET_LICENSES：原几何复用、新开发占位路径；原研究/来源/权限部分原文保留，approved 清单仍无新正式资产。
- INDEX / CHANGELOG：新增本报告/本轮功能范围与真实验证；不创建重复状态源。
- PRODUCT / MULTIPLAYER / ADR / AGENTS / DEV_ENVIRONMENT / DOC_RULES / WORKFLOW / FEAT-012、全部历史报告：不改；没有新产品范围、联机或环境规则变动。

## 6. 未解决问题、风险和下一步

本轮交付停止 Code Review。可操作模块是源码实现，**还没有本轮真实截图、按键/鼠标操作或引擎运行日志**；不能声称玩家已经实际进入/返回或资源清理通过。后续另获 Windows GUI/项目截图许可后，按 TESTING 的双角色、三比例、至少三次往返、原入口/遮罩/取消、组件恢复及两次启停矩阵提供原图/日志/哈希与进程归属退出证据。

载入是当前同步建树与可取消的异步接口边界，不是已实现 Asset Bundle/远端加载。注册表只有内部测试模块，两个测试 ID 隔离夹具不等于多款正式游戏实证；完整正式美术、图像资源装卸、微信、Mac、性能/长期泄漏和原引擎诊断继续待后续任务。未经另行授权不提交、不推进下一 Issue 或正式素材任务。

### F-01 外部复审与后续修复（2026-10-29—30）

以上为首轮开发历史，不追写测试成功：外部复审确认原第 12/13 组只证明迟到完成不覆盖新会话，不能证明取消之后创建的资源被回收。finish 已执行 exit/dispose 并标 cleaned，旧 load 仍可取得新资源；本机随后真实复现资源存活为 true。F-01 最小修复采用每次加载独立的 retain/释放协议，原 20 组断言保留、追加 3 组；现仍 21 unittest，原失败日志与本轮实际修复/契约边界见 [F-01 补充报告](2026-10-30_issue-4_f01-load-cancellation.md)。原 24 路径与审查 ZIP 保留，本轮只补源码/测试/必要文档，不覆盖原包或独立研究；全部新 GUI 仍 not_run，P1-04/相关 Feature 不提前完成。
