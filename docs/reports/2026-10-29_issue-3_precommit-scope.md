# 任务报告 — Issue #3 / P1-03 提交前文件范围核查

> 报告日期：2026-10-29 | 系统：Windows 11 10.0.26200 | 功能：FEAT-002（关联 FEAT-001）| 分支：master | 交付：拟提交范围与补充工具源码审查，未获 Git 写入授权

## 1. 本次授权范围

用户确认 F-02 已经人工验收，只核对当前 HEAD、全部差异/未跟踪文件、P1-03 与独立素材任务边界，整理拟提交文件及尚未审过的三份证据工具。外部 `P1-03-F02-final-review-2026-10-29.md` 作为复审证据读取，不作为新操作授权；其明确说明证据 ZIP 不含最新工具源码。

已读取 AGENTS、README、PLAN、DEV_ENVIRONMENT、DOC_RULES、WORKFLOW、FEATURES、关联 Feature、报告模板及此前全部 8 份 P1-03 报告。GitNexus 工具不可用，使用原生只读 Git；采用 encoding-guard 检查。起点 HEAD 为 `5ac74c5fbfef1e02505732577456f157e0c9277c`，16 修改、15 未跟踪，无删除/暂存。未重新 GUI、截图、安装、开发选角/正式素材或 FEAT-003；不 add、commit、push、PR、merge 或关闭 Issue。

## 2. 实际交付与代码影响

本轮实际只新增本报告，修改 PLAN、INDEX、CHANGELOG 的审查停点/导航/记录。其余原有 28 个工作区变更路径、两份私有配置及所有历史报告/证据保持原字节。没有产品源码、Meta、测试或 ignore 规则的新修改。

本机审查目录 `.local/review/p1-03-precommit-scope-2026-10-29/`。主包 `P1-03-precommit-scope-supplement-2026-10-29.zip` 包含拟提交副本及必要原工程上下文、完整新增工具、最小工具差异、HEAD 到拟提交内容的 patch、逐路径清单/摘要、拆分说明和本轮实际结果。`review/` 仅为审查辅助，不属于拟提交文件。

**拟提交共 29 路径（15 修改、14 新增，无删除）**；其中三份证据工具标为 `pending_code_review`，得到补充源码复审前不能默默提交。拟提交副本不修改真实工作区，不是已暂存结果：

| 分类 | 完整相对路径 |
| --- | --- |
| 修改：实现/配置 | `client/assets/scripts/LobbyModel.ts`；`client/assets/scripts/LobbyView.ts`；`client/package.json` |
| 修改：入口/架构 | `README.md`；`docs/ARCHITECTURE.md` |
| 修改：素材中仅 P1-03 内容 | `docs/ART_ASSETS.md`；`docs/ASSET_LICENSES.md` |
| 修改：阶段/测试/索引 | `docs/PLAN.md`；`docs/FEATURES.md`；`docs/TESTING.md`；`docs/INDEX.md`；`docs/CHANGELOG.md` |
| 修改：Feature 接入 | `docs/features/FEAT-001-game-lobby.md`；`docs/features/FEAT-002-character-selection.md`；`docs/features/FEAT-003-game-module-lifecycle.md` |
| 新增：选角测试 | `tools/tests/character_selection.test.cjs`；`tools/tests/test_character_selection.py` |
| 新增：待补充源码复审 | `tools/capture_evidence.cjs`；`tools/check_gui_evidence.py`；`tools/tests/test_gui_evidence.py` |
| 新增：原开发/源码审查 | `docs/reports/2026-10-28_issue-3_character-selection.md`；`docs/reports/2026-10-28_issue-3_final-review-preparation.md` |
| 新增：原 GUI 历史 | `docs/reports/2026-10-28_issue-3_windows-gui-acceptance.md`；`docs/reports/2026-10-28_issue-3_windows-gui-followup.md`；`docs/reports/2026-10-28_issue-3_windows-gui-completion.md` |
| 新增：F-02 历史 | `docs/reports/2026-10-29_issue-3_f02-keyboard-evidence.md`；`docs/reports/2026-10-29_issue-3_f02-resumption.md`；`docs/reports/2026-10-29_issue-3_f02-keyboard-acceptance.md` |
| 新增：本轮审查 | `docs/reports/2026-10-29_issue-3_precommit-scope.md` |

范围分离规则：

- ART_ASSETS 仅拟纳入 P1-03 对称卡片/复用占位/底色修复及真实三比例证据；ASSET_LICENSES 仅拟纳入 DEV-P1-03 占位登记。正式原作要求、SRC/CAND 清单、联系人、权限调查和 PNG/SpriteFrame 制作建议保留为独立工作，不混入本次功能提交。
- README/PLAN/INDEX/CHANGELOG 移除拟提交副本内的独立调研入口/行；ARCHITECTURE、FEATURES、FEAT-002/003 移除本次功能之外的视觉解析接口与后续功能优先规划，只保留已实现的稳定 ID/getter 接入说明。原始共享文件未删改这些内容。
- `docs/features/FEAT-012-asset-and-quality.md` 的现有修改及 `docs/reports/2026-10-29_task-character-source-research.md` 整体暂不纳入。独立余量保存在本机 `deferred/`，其精确 patch 以拟提交内容为基线，可重建当前全文；不建立第二份权属台账。
- 8 份历史 P1-03 报告全文保留，包括当时的混合任务决策、失败、暂停和 not_run；历史过程不改写为新的功能实现或素材调查事实源。
- 自动生成的 `client/.creator/asset-template/typescript/Custom Script Template Help Documentation.url` 只含 `[InternetShortcut]` 和 Cocos 官方脚本模板帮助 URL。当前未跟踪且未忽略，无私密字段；仅读文本，没有打开链接。默认排除，不擅改 ignore；后续如决定忽略，需单独审核精确规则。

原完整源码 ZIP SHA-256 仍为 `64e20d39069e231a75008e49021cddb965a90d19b702d79b004fa68fb5e0dcd7`。其中 85 个项目文件，当前 72 个字节相同；13 个后续变化均为文档。两份实现、client/package.json 和两份选角测试全部与原审查版相同；后续增加的三份工具在原源码包和 F-02 GUI 包中均没有全文，不能推定已审过。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI | HEAD/status、完整 tracked diff、逐项读取未跟踪内容及原审查 ZIP 比较 | `passed` | 本轮目录 before.json、tracked-worktree.diff、review-provenance.json | 31 个起点路径逐项分类，无删除；实现/测试未漂移，非新的外部源码批准 |
| Windows CLI | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261029T140104.101121Z/`；最终文档后复核日志收录本轮目录 | 20 项 unittest 无 skip，原 9 组大厅/13 组选角保留，真实 tsc 与文档退出 0 |
| Windows CLI | encoding-guard、UTF-8/无 BOM、`git diff --check`/空索引检查 | `passed` | 本轮 final-checks.json 及日志 | 保留 LF→CRLF 提示，不转换原文件、不修改 Git 配置；已知路径/私钥模式不等于穷尽机密扫描 |
| Windows CLI | 禁用全局忽略的 `git check-ignore -v`、`git ls-files`/status | `passed` | 本轮 git-private-ignore.log、git-private-tracked.log | 两份配置命中 client/.gitignore 第 14/15 行、未跟踪；本机辅助目录由根 .local 忽略，私有内容不导出 |
| Windows CLI | 拟提交 patch/独立余量 patch 检查、导出文档检查、ZIP CRC/逐文件 SHA-256 | `passed` | 本轮 split-verification.json、export-docs.log、package-verification.json | 仅对忽略目录副本执行 git apply --check/文本重建，真实仓库无暂存；包内清单覆盖全部有效载荷 |
| Windows GUI | 本轮重新运行或截图 | `not_run` | 无新截图 | 用户要求不重跑；沿用已人工接受的三比例/生命周期及 F-02 证据 |
| macOS / 微信 / FEAT-003 | 实机、构建/触控、安全区、性能/长期泄漏、真实游戏集成及完整视觉接口 | `not_run` | 原报告 | 不从 Windows CLI/键盘证据推定通过 |

所有工具先审阅调用链。validate 仅文档/单测 30 秒、tsc 60 秒串行；纯 Node/子 Python 测试各 10 秒、shell=False。类型检查使用已有锁定 TypeScript 5.8.2 与真实 Cocos temp 配置/四份声明，不安装、不自动补生成。工具检查本身只有文件 I/O、哈希/解码；capture 模块没有屏幕/窗口 API，调用方仍须单独获得 GUI 权限。check_gui_evidence 需已有 Pillow，不启动 GUI/网络或自动安装。测试使用合成夹具，不冒充运行证据。

像素摘要规范按当前源码为 `SHA256(pack('>II', width, height) + Pillow.convert('RGBA').tobytes())`，本机 Pillow 12.3.0。不同 JPEG 解码器/版本的像素输出不能直接视为逐字节可复现；文件 SHA-256 才核对原件字节，UI 仍须人工看图。外部复审指出的异构像素摘要差异保留为限制，不重写历史索引。

一次辅助读取误用了不存在的 test_lobby_model.py，实际文件为 test_lobby.py，已按 rg 结果读取；一次 PLAN 精确补丁上下文不全被拒，随后完整行补丁成功。均未修改产品或跳过检查，不是回归测试失败。

## 4. 运行环境保护核对

本轮没有 GUI、屏幕采集、键鼠、浏览器、引擎构建、依赖安装或系统设置变更。仅有受控短时 CLI，均等待退出，没有本轮图形进程需关闭；不重新读取无关进程/窗口，不把历史清理记录当作本轮新查询。两份私有配置只做本机哈希/忽略核对，未覆盖/删除或导出。历史失败原图、索引、日志、ZIP 与素材专项原文均保留。

## 5. 文档同步清单

- PLAN：是，记录 F-02 人工接受后的范围审查停点；P1/P1-03 仍 in_progress。
- INDEX、CHANGELOG：是，本轮报告导航与实际审查记录。
- FEATURES、FEAT-001/002/003、README、ARCHITECTURE、TESTING：本轮真实工作区不改；仅拟提交副本精确拆分，供审核后再在最终授权时应用。
- ART_ASSETS、ASSET_LICENSES、FEAT-012、来源调查报告：本轮原字节不改、不丢弃；P1-03 占位部分与独立调查在副本分离，不把正式授权标已取得。
- 8 份既有 P1-03 报告、场景/Meta、AGENTS/DEV_ENVIRONMENT/DOC_RULES/WORKFLOW：本轮不改。

## 6. 未解决问题、风险和下一步

等待三份证据工具及共享文档拆分的补充 Code Review，再等待本次 Git 提交授权。拟提交清单不是 staged 清单，不能对共享文件直接整文件 add；后续须按审核过的 patch 精确构造索引并核对残留调研全文。review 辅助、.local、依赖/缓存、私有配置和 .url 均不得进入提交。

FEAT-002 AC-02/FEAT-001 AC-03 仍待 FEAT-003，整个 Feature 不 done。正式美术/发布授权、Mac、微信、性能及历史引擎诊断仍按原报告保留。本轮停止，不执行 Git 写入或下一任务。
