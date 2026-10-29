# 任务报告 — Issue #3 / P1-03 Windows GUI 剩余验收完成

> 报告日期：2026-10-28 | 系统：Windows NT 10.0.26200 | 功能：FEAT-002（关联 FEAT-001）| 分支：master | 结论：本次要求的 GUI 矩阵及正常退出已补齐，等待用户最终验收

## 1. 本次授权范围

用户在已授权 Windows 前台和仅项目/游戏预览窗口截图的基础上，回复「可以继续」恢复操作。仅继续已有 Lobby 的剩余键盘复验、第 2 次停止及正常退出清理；三比例、各角色三次、七入口、遮罩/取消及组件恢复的本次前半段证据见 [补验与暂停报告](2026-10-28_issue-3_windows-gui-followup.md)。

不重新安装、初始化或生成工程，不开发 FEAT-003/正式素材，不扩大 Issue #3 范围，不执行 git add、commit、push、PR、merge 或关闭 Issue。P1-03 仍 in_progress，等待最终验收；FEAT-002 AC-02 真实游戏集成继续待 FEAT-003。

## 2. 实际交付与代码影响

- 源码、场景、Meta、工程配置和全部测试未修改。没有新增修复或角色美术；本轮验证的是已通过外部静态复审的既有代码。
- 修改 README、PLAN、FEAT-001/002、ARCHITECTURE、ART_ASSETS、TESTING、INDEX、CHANGELOG：更新最新验证引用和停止点；FEAT-002 AC-05 有图形证据，AC-02 不勾选，Feature 总表状态不变。
- 新增本报告。原开发、GUI 证据、源码审查准备、补验暂停报告和历史失败原文保留；没有把原先 not_run 追写为当时通过。
- `.local/validation/p1-03-gui-completion/`：共 **55 张真实原图**、两份操作日志、原始项目日志/浏览器日志、进程证据、最终 CLI、截图索引和 SHA-256。00—39 为项目窗口，40—54 为独立可视本地游戏预览，均排除无关桌面。未保存被遮挡的抓取结果。
- 最终补验包为该目录的 `P1-03-gui-completion-evidence-2026-10-28.zip`，同名 `.sha256` 为包校验；内部 `SHA256SUMS.txt` 覆盖每个有效载荷，导出日志脱敏。本机 PID 原始命令行/账号配置/缓存不导出。前一份 38 图暂停证据 ZIP 及完整源码审查 ZIP 保持原字节。
- 无删除。88 文件基线对比仅允许本轮证据文档发生变化；产品文件、两份私有配置、所有原报告和 HEAD/空索引保留核对见 `preservation-final.json`。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/GUI/真机步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows CLI + GUI | 旧 17 PID 按路径/创建时间/父子树确认后，File → 退出，核对 0 | `passed` | `processes-before.json`、`old-project-after-exit.log`、前半段报告 | 旧根 30884、项目 31960；不按进程名强杀，不影响无关程序 |
| Windows GUI / Editor | 1280×720（16:9）、2160×1620（4:3）、840×360（21:9）真实 Lobby/选角 | `passed` | `01/02`、`05`—`18`、截图索引 | 两角色、名称/身份、状态与按钮完整且可点击；4:3 上下留黑、21:9 左右留黑，未见裁切/文字重叠/错位；设备预设不是手机真机 |
| Windows GUI / Editor | 一二与布布各三次进入→选择→确认→返回 | `passed` | 一二 `03/04`、`07/08`、`13/14`；布布 `09/10`、`15/16`、`17/18` | 各三次完整往返，无可见叠层/重复响应；不等于节点/事件数量或长期泄漏审计 |
| Windows GUI / Editor | 原四游戏、帮助、设置、好友七入口逐一打开返回 | `passed` | `19`、`21`—`27`、实时操作日志 | 本轮每入口一次；四款游戏继续开发中、无房间/存档假功能；不把 P1-02 历史 21 次算作本轮 |
| Windows GUI / Editor | 帮助/选角遮罩点背后设置，未确认一二草稿返回 | `passed` | `24/25`、`28`—`30` | 没有点穿；取消保留已确认布布 |
| Windows GUI / Editor | 内嵌 Escape | `failed` | `20-embedded-escape-focus-failure.png`、原焦点记录 | 外层编辑器文档持有焦点，保留失败；本轮未修改输入代码或注入伪事件 |
| Windows GUI / 可视本地预览 | Tab、Right/Down/Up/Left、Enter/Space、Escape，选角确认/取消与原介绍返回 | `passed` | `40`—`54`、`keyboard-log.json` | 真实按键：Tab 只移动焦点，Space 选一二、Enter 选布布并确认，四方向只移动焦点，Escape 返回/丢弃草稿；不是编辑器生命周期替代品 |
| Windows GUI / Editor | Inspector 禁用/恢复 LobbyView，从未确认草稿恢复 | `passed` | `31`—`34`、22:56:49 日志 | 画面清空、旧按钮无响应；恢复单套大厅并保留布布、丢弃一二草稿，重入可选；未保存运行时属性 |
| Windows GUI / Editor | 第 1 次运行/停止，再次运行/停止 | `passed` | `01`、`35`—`39`、`project-after-two-stops.log` | 启用 22:32:50；第 1 次停止 22:57:30；第 2 次启用 22:57:48、恢复中立；最终停止 23:28:57 回 Scene。组件恢复不算额外一次运行，浏览器启动不计入这两次 |
| Windows GUI + CLI | 关闭本轮预览页，项目 File → 退出，等待退出后按归属核对 | `passed` | `processes-final-confirmed.json`、`cleanup-final.json`、项目日志 | 新根 23028、项目 21792 及子树正常退出；23:38 后同安装路径 Cocos=0、项目窗口=0；23:39:31 本地 7456 监听=0，无强杀 |
| Windows CLI | `python -B tools/validate.py all` | `passed` | `final-cli-summary.json` 和其指向的原始日志 | 16 项 unittest（保留原 15，包含 9+13 组纯 TS/AST 断言）、真实 tsc、文档；不代表 GUI/真机 |
| Windows CLI | 编码技能扫描、严格 UTF-8、`git diff --check`、真实仓库忽略/索引核对、原字节保留 | `passed` | `final-checks.json`、`preservation-final.json` | 两私有配置由 client/.gitignore 第 14/15 行忽略且未跟踪，禁用全局忽略；无 Git 写入 |
| macOS | 实机 CLI、GUI/引擎构建 | `not_run` | - | 当前是 Windows，没有启动 Mac GUI；现有受控 CLI 安全边界不变 |
| 微信真机 / FEAT-003 / 性能 | 微信构建/触控/安全区、同一真实游戏、长期泄漏、组件独立移除、冷检出复现 | `not_run` | - | 不在本轮实际测试范围，不能由桌面预览或静态测试推定通过 |

恢复后先观察目标被遮挡，没有保存遮挡图片；按用户恢复指令仅激活项目窗口。最终停止成功后，创建一个**可视** `http://localhost:7456/` 项目预览页验证键盘，未操作用户已有浏览器页。画布按键产生的选角/确认/取消状态逐步截图，控制台共 **9 条：8 log、1 info、0 warn/error**；测试后关闭该页。

编辑器原始项目日志 `project-final.log` 共 **3 条 Lobby enabled**：两次运行的自动启用和一次 Inspector 恢复。总计 **3 条 warn**：首次停止的 2 条 IPC message has been lost、最终退出的 1 条 Object has been destroyed / WebContents TypeError；error 级记录为 0，未见旧的根节点重复销毁警告。内部警告/异常堆栈保留，不写成引擎完全无错误。最终退出请求后首次即时查询仍有 6 个正在退出的进程，稍后复核为 0，不把首次查询误报成清理完成。

前半段物理 Escape、输入保护和遮挡暂停、内嵌焦点失败、旧退出尝试、文档尾随空格首次检查失败均保留在 [暂停报告](2026-10-28_issue-3_windows-gui-followup.md)。导出辅助包曾因转义路径脱敏不完整而检查失败；原失败包保留于忽略目录，重新脱敏并检查最终包，不作为产品缺陷或通过包发布。

## 4. 运行环境保护核对

未安装引擎/依赖，未重建工程、修改系统设置或控制无关程序。图形仅在本次明确许可和恢复后执行，检测用户输入/遮挡即暂停。正常退出使用项目文件菜单，不调用 Stop-Process、taskkill 或批量终止。旧树和新树分别核对，最终 Cocos/项目窗口/预览端口均为 0；未为截图捕获整个桌面。已有两个私有配置保持原字节。

## 5. 文档同步清单

- PLAN：P1/P1-03 继续 in_progress，GUI 缺口补齐后停止在最终验收，不自动推进下一任务。
- FEAT-002：AC-05 按三比例、重复往返、输入/遮罩、组件与编辑器启停证据勾选；AC-02 留待 FEAT-003，FEATURES 中整体仍 in_progress。
- README、FEAT-001、ARCHITECTURE、ART_ASSETS、TESTING：更新当前图形结果与剩余真机/集成边界。
- INDEX、CHANGELOG：登记本报告，保留暂停报告和全部历史。
- FEATURES、ASSET_LICENSES、ADR、PRODUCT、MULTIPLAYER、AGENTS、DEV_ENVIRONMENT：状态/素材/决策/安全策略均无变化，不重复修改。

## 6. 未解决问题、风险和下一步

本次指定的剩余 GUI 和正常退出证据已补齐；编辑器内嵌按键焦点限制及 2 IPC/1 WebContents 退出诊断仍存在并如实保留。独立可视游戏预览按键通过，两次启停均使用真实编辑器，没有以浏览器替代。

FEAT-002 真游戏集成 AC-02、Mac/微信真机、正式素材权利、性能及长期资源泄漏仍未验证。停止等待用户最终验收，不修改正式素材、不开发 FEAT-003、不暂存/提交/推送/关闭 Issue。
