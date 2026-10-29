# 任务报告 — Issue #3 / P1-03 F-02 键盘实际验收

> 报告日期：2026-10-29（Asia/Shanghai）| 系统：Windows NT 10.0.26200 | 功能：FEAT-002（关联 FEAT-001）| 分支：master | 结论：F-02 关键键盘补录通过，停止 Code Review，等待提交授权

## 1. 本次授权范围

用户对本次前台操作明确回复「现在允许，可以操作并保存项目截图」。只使用现有 Cocos Creator 3.8.8 打开现有 Lobby，补中立、Tab/四方向、双角色选中、确认布布、Esc 返回、取消草稿与原游戏介绍键盘开关；只保存项目/游戏预览内容，正常退出本轮程序。

不重做已经审过的源码、三比例、双角色各三次、组件恢复与两次编辑器运行/停止；不重新安装、初始化、修改产品源码/场景/Meta/原测试/占位或私有配置，不实现 FEAT-003 或正式美术，不暂存、提交、推送、创建 PR、关闭 Issue 或开始下一任务。

## 2. 实际交付与代码影响

- 本轮新增真实证据位于 `.local/validation/p1-03-f02-resume-2026-10-29/`：`screenshots/00`—`18` 共 **19 张原始 JPEG**，`context/19-editor-before-exit.jpg` 为独立编辑器上下文。没有设计模拟图、图片编辑或复制旧帧。
- `screenshot-index.json` 解码逐图真实宽高/格式、文件 SHA-256 与 RGBA 像素哈希；19 图均 779×868，顶层宽高也为 779×868，19 份保存收据与文件匹配且两类哈希均互异。上下文图 3440×1392 另有 `editor-context-index.json`，不混用顶层尺寸。设计配置仍为 1280×720；本轮保持默认可视预览视口，未重复比例验收。
- `SCREENSHOT-INDEX.md`、`visual-observations.json` 是逐图人工观察注释；`input-log.jsonl` 仅记实际按键/时间/调用返回，`capture-receipts.jsonl` 仅证明字节保存。独立状态证据是可复看的原图，不将注释/手写 passed 当作遥测。07 布布已确认的落盘文件另经本地图片工具复看。
- `browser-console.json`、`project-raw.log`、`editor-ax-before-exit.txt`、`tool-errors.json`/`raw-tool-errors.txt` 与进程/退出记录保留原始事实。项目日志运行中为 0 字节，正常退出后刷出 814 字节，导出的是退出后的 11 行日志；不能把中间空文件当作无错误证明。
- 新增本报告，更新 README、PLAN、FEATURES、FEAT-001/002、ARCHITECTURE、TESTING、INDEX、CHANGELOG 的当前证据引用。保留此前修复/准备/来源专项报告、原 40—54 重复图片/索引/ZIP、所有失败原文；没有重新生成它们。
- 产品源码、场景/Meta、工程配置、原测试及两份私有 Cocos 配置均保持原字节。上一轮已记录的 FEAT-003/视觉资源边界仍只是后续规划，本轮没有新增实现。

### 真实画面与实际按键

| 原图编号 | 实际输入 | 画面观察与结论 |
| --- | --- | --- |
| 00 | 由编辑器打开 Lobby 后加载可视本地预览 | 大厅双角色/四卡/选角入口真实显示，初次没有已确认角色 |
| 01 | 点击选角入口（仅初始设置） | 中立、尚未选择、确认不可用，返回按钮初始焦点 |
| 02 | Tab | 一二边框获得焦点，仍未选择；焦点不等于选中 |
| 03 | Space | 一二显示已选与选中底色，确认可用 |
| 04 | Right | 布布获得焦点，一二草稿保持 |
| 05 | Enter | 布布变为已选，说明准确 |
| 06 | Down | 焦点移动到确认，布布草稿保持 |
| 07 | Enter | 布布明确显示“已确认”，正文说明已选择布布、尚未开始游戏或保存 |
| 08 | Escape | 返回大厅，入口显示“角色：布布 · 更改” |
| 09/10 | Enter 重入 / Tab | 先保留布布草稿，再聚焦一二但未改变草稿 |
| 11/12 | Space 后 Up / Left | 改为一二未确认草稿，Up 聚焦返回，Left 环绕到确认；草稿不因移动焦点改变 |
| 13 | Escape 取消，随后 Tab | 大厅仍为已确认布布；Tab 只移动到好友入口，未覆盖确认结果 |
| 14/15 | Right / Enter | 聚焦第一卡并打开守护小屋介绍，明确开发中 |
| 16 | Escape 返回，随后 Right | 大厅恢复，焦点可移到第二卡 |
| 17/18 | Enter / Space 返回后 Right | 黄金矿工介绍真实打开，Space 返回，大厅导航恢复到第三卡；均仍开发中 |

截图 13/16/18 的确是在返回后继续移动一次焦点，不伪称为只按一次返回键的截图。它们保持真实状态与原始字节，没有为了不同哈希修改画面；输入日志记录完整顺序。01—18 的新状态由真实键盘/初始入口操作产生，不调用模型方法或注入伪造引擎事件。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/GUI/真机步骤 | 结果 | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows GUI | 现有 3.8.8、现有 client/Lobby、可视 `localhost:7456` 实际键盘矩阵 | `passed` | 上表、19 原图、原始按键记录与运行日志 | 只补 F-02，不替代/重做已获复审接受的编辑器两次生命周期 |
| Windows CLI | 新解码审计、逐图收据/文件/像素哈希匹配、复看落盘 07 | `passed` | `screenshot-index.json`、`checkpoint-09-images.json`、收据、本地原图 | 正确识别 JPEG，拒绝旧 PNG 固定偏移；不同哈希不单独证明 UI 目标，须结合原图 |
| Windows GUI + CLI | 关闭本轮预览页，项目 File → 退出；按路径/PID 树核对 | `passed` | `processes-running.json`、`processes-after-exit-immediate.json`、`processes-final-confirmed.json`、`project-windows-after-exit.json` | 初始同安装路径为 0；本轮树根 28512、项目 5844，共 17 个；退出即时仍 13，最终 0，项目窗口/7456 监听为 0；无强杀 |
| Windows 日志 | 浏览器运行日志与退出后的项目原始日志 | `passed` | `browser-console.json`（8 log/1 info）、`project-raw.log`（11 行） | 留存日志中无 warn/error；不宣称修复了历史内嵌焦点失败或 2 IPC/1 WebContents 警告 |
| Windows 采集适配 | 原生对话框旧句柄、CJS 导入、组合观察无图片字节 | `failed` | `tool-errors.json`、`raw-tool-errors.txt` | 三次工具调用失败分别恢复；未写入假图片。另保留 IAB Statsig 初始化警告，与游戏控制台分列 |
| Windows CLI | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261029T124054.826598Z/summary.json`、本轮目录 final-cli-* | 文档、20 项 unittest（含原 9+13 组 TS/AST 断言）、真实 TypeScript，均退出 0；无 skip，不代替 GUI |
| Windows CLI | 编码、91 个指定文本严格 UTF-8、Git diff/忽略/索引/HEAD、原字节保留 | `passed` | `final-checks.json`、`preservation-final.json` | 累计只允许本次与准备轮次的文档变化，产品源码/Meta/原测试/私有配置未变；156 个历史证据文件未变，索引为空 |
| macOS / 微信真机 | CLI 实机、GUI/构建、触控/安全区/性能 | `not_run` | - | 本轮为 Windows 键盘补证，没有放宽 Mac 红线 |
| FEAT-003 / 正式美术 | 实际测试场景往返、完整可替换视觉接口、获权原作导入 | `not_run` | - | 本轮不开始其他开发，AC-02/整体 Feature 不提前完成 |

适配错误恢复：切换到返回的新项目选择对话框后继续，没有重试旧窗口坐标；受测 CJS 保存模块经 createRequire 加载，没有复制重写其源码；组合观察没有图片字节时保存函数直接拒绝，随后每次显式取得当前 getScreenshot 字节再 Buffer.from 传参。每张原图独占创建，未使用旧闭包，也没有保存失败调用为通过证据。

最终 docs/unit/typecheck 耗时约 0.097/1.421/0.628 秒；私有配置在禁用全局 excludes 后仍由 client/.gitignore 第 14/15 行忽略，证据目录由根 .local 规则忽略。Git 的 LF→CRLF 提示保留，不转换文件或改配置；HEAD 仍为 `5ac74c5fbfef1e02505732577456f157e0c9277c`。原始按键/关闭记录共 24 条，不将输入调用完成数当作断言通过数。

共享补充包位置为本轮目录 `P1-03-F02-keyboard-evidence-2026-10-29.zip`：只白名单导出本轮新截图、真实索引/收据/日志、脱敏进程归属、最终 CLI 和本报告，不含旧重复图、账号/私人配置/缓存或完整命令行。文本副本将机器路径脱敏，原图逐字节保留。包内 SHA256SUMS.txt 校验导出字节；包外同名 .sha256 与 `package-verification.json` 记录最终 ZIP CRC、逐文件清单/哈希、19 张解码图及索引/收据匹配的实际验证结果，供复审直接核对。校验日志不代替人工观察图中角色/文字。

## 4. 运行环境保护核对

全部 GUI 在用户本次明确许可后执行，仅项目编辑器/项目预览内容；未采集桌面、无关窗口或账号信息，未安装依赖/重建工程/修改系统设置。本次没有遇到持续用户输入保护或无关游戏遮挡；先正常关闭创建的项目预览页，再从项目菜单退出，不使用 Stop-Process、taskkill 或按名称终止。

原始命令行进程树只留本机忽略目录；共享证据包导出 PID/父子归属/创建时间和已确认安装版本，不导出命令行或私人配置。收据、实际输入、日志和尺寸/哈希保留；旧失败包、原图与历史报告均不覆盖。

## 5. 文档同步清单

- PLAN：P1/P1-03 继续 in_progress，F-02 关键键盘项已有新证据，停止 Code Review/待提交授权。
- FEAT-002：AC-05 按已接受的其他图形证据与本次新键盘证据勾选；AC-02 留待 FEAT-003，FEATURES 中整体仍 in_progress。
- FEAT-001、ARCHITECTURE、TESTING：补新证据引用及浏览器键盘/编辑器生命周期边界，不改接口实现或伪造可玩游戏。
- README、FEATURES、INDEX、CHANGELOG：更新本次交付引用，准备报告和历史失败保留。
- ART_ASSETS、ASSET_LICENSES、FEAT-003/012：本轮 GUI 无新增素材/许可/实现，保持上一轮功能原型优先与未来真实原作接入约定；AGENTS/DEV_ENVIRONMENT 不改。

## 6. 未解决问题、风险和下一步

本轮 F-02 指定的真实多状态画面、尺寸修正和键盘补录已完成；外部人员可按原图、实际输入、文件/像素哈希和独立清单复核。P1-03 仍 in_progress，停止 Code Review 等待用户审查与提交授权，不自动提交或关闭 Issue。

Mac 实机、微信真机、性能/长期泄漏、真实游戏集成 AC-02、完整可替换视觉接口与正式角色原稿/发布授权仍未验证或未实现。它们不由本轮键盘证据推定通过，也不阻止以后按单独任务授权继续既有占位功能原型。
