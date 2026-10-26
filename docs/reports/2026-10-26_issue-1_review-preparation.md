# 任务报告 — Issue #1 / P1-01 复审准备与源码审查包

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows NT 10.0.26200 | 功能：FEAT-012（工程质量基线） | 分支：master，未创建新分支

## 1. 本次授权范围

保留上一轮工程和环境，依据当前 Git 状态准备供外部 Code Review 的 ZIP、统一 diff、完整文件清单和校验数据；复核安全 CLI 的 macOS 无 GUI 属性、TypeScript 前置条件，评估一次性静态检查的回归价值。

明确不做：重建工程/重装 Cocos、正式游戏或新产品功能、完整源码级 Code Review、Cocos GUI/CLI 构建、游戏预览、浏览器、截图/图形自动化，以及 git add/commit/push/PR/merge。Windows GUI 验收等待用户单独通知。P1-01 保持 in_progress。

开始前读取根 AGENTS/README/PLAN/DEV_ENVIRONMENT/WORKFLOW、DOC_RULES、Feature/技术/验证文档和报告模板；复核现有工具、测试及上一轮一次性静态脚本。GitNexus 工具仍不可用，使用只读原生 Git。沿用简洁编码与编码保护技能；本机 Superpowers 目录仍缺少可读取的 SKILL 实体。没有启动独立完整 Code Review 流程或委托审查，不宣称本轮替代外部评审。

初始 HEAD `043ae7f`，master，0 暂存；16 个已跟踪文件修改和 24 个新增文件，与上轮结果一致。40 个文件先计算 SHA-256 快照用于保留核对；本轮不删除它们，所有 client/ 工程文件保持原字节。快照只存本机忽略目录，不含入导出包。

## 2. 实际交付与代码影响

- 修改 `tools/validate.py`：把四份声明 `cc.d.ts`、`cc.env.d.ts`、`cc.custom-macro.d.ts`、`jsb.d.ts` 纳入 typecheck 预检；任一缺失均 blocked / 2，在此分支不启动 Node，不提供 GUI 自动修复路径。
- 修改 `tools/tests/test_validation.py`：新增逐份声明缺失时不启动子进程、缺可执行程序时阻塞的回归。
- 新增 `tools/tests/test_project_baseline.py`：引擎版本固定、资源 meta 配对/有效 UUID/唯一性、场景索引及 Canvas 的脚本引用、Git 保留/忽略边界四项静态回归。脚本类 ID 从当前 meta 推导，不沿用一次性脚本中的固定 UUID。
- 修改 `README.md`、`docs/PLAN.md`、`docs/TECH_STACK.md`、`docs/TESTING.md`、`docs/ARCHITECTURE.md`、`docs/features/FEAT-012-asset-and-quality.md`、`docs/INDEX.md`、`docs/CHANGELOG.md`：前置条件、证据边界、回归覆盖与报告导航同步。
- 新增本报告。原 `docs/reports/2026-10-26_issue-1_cocos-initialization.md` 保留为上一轮证据，不重写历史结果。
- 删除：无。Cocos 场景/脚本/meta/settings、依赖锁文件、引擎安装和缓存均没有重建或改动。

既有行为影响：只有类型检查对缺失声明的分类从后续编译失败提前为明确阻塞；`docs`/`unit`/`typecheck` 名称、超时和退出码约定保留。新静态回归只读工程数据；ZIP 无 `.git` 时仅跳过依赖真实 Git 检出的忽略测试，不导入引擎。

### 审查包组成与排除

审查包输出在本机忽略目录 `.local/review/p1-01-review-2026-10-26-01.zip`。解压后仓库文件仍位于原始相对路径，无多余根目录。附加审查数据位于 `_review/`：

- `REVIEW_GUIDE.md`：范围、基线、复现命令与限制。
- `ISSUE-1.md`：经 GitHub 连接器读取的 Issue 正文快照，仅包含标题/链接/正文，不含账号对象。
- `CHANGES.patch`：相对 HEAD 的已跟踪文件 diff，加上新文件 `/dev/null → 文件` diff；均为只读 Git 生成，未使用临时 index 或 git add。
- `FILE_LIST.txt`：全部归档路径及 modified/added/context/generated 分类；同时标明排除项。
- `MANIFEST.json`：源文件/附加数据的字节数、SHA-256、类别和基线 SHA；自清单不记录自身 hash，外部 SHA-256 sidecar 负责整个 ZIP。
- `CHECK_RESULTS.json`：从本轮结果提取的无个人路径摘要，不复制原始机器日志。

为使外部审查和文档检查能独立读取，附入未修改的根 AGENTS 和 docs 上下文，清单标记为 context，不冒充本次改动。所有未被安全排除的新增/修改源码、工程配置、测试和文档均纳入 ZIP 与 diff。

排除 `.git`、`.local`、node_modules、引擎/构建缓存及安装包、profiles、临时扩展、日志、截图、本机绝对路径、凭据等。另从导出内容及 diff 中排除 `client/settings/v2/packages/cocos-service.json`、`client/settings/v2/packages/information.json`，它们属于 Cocos 云服务/订阅信息配置；即使当前仅含默认值，也无需提供给源码审查者。原文件完整留在本地，清单只记录排除理由，不输出其内容。

## 3. 实际验证（无验证则写 not_run）

| OS | 命令/步骤 | 结果 | 日志或证据 | 覆盖边界 |
| --- | --- | --- | --- | --- |
| Windows | `git status --short --branch`、文件清单与原始 40 文件 SHA-256 快照 | `passed` | `.local/validation/p1-01-review/start-snapshot.json` | 初始成果和暂存状态 |
| Windows | 新增测试后 `python -B -m unittest discover -s tools/tests -v` | `failed`（预期红灯） | `.local/validation/p1-01-review/regression-red.log` | 11 测试中 1 项指出声明预检尚未实现 |
| Windows | 补齐预检后 `python -B tools/validate.py unit` | `passed` | `.local/validation/p1-01/20261026T130752.560659Z/unit.log` | 11 测试通过，包含新增静态回归 |
| Windows | 文档同步后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T131543.999172Z/summary.json` | 文档 37 份 / 12 Feature / 39 相对链接；11 测试和工作区 tsc 均 exit 0 |
| Windows | 导出暂存副本的 docs/unit/typecheck 三项 CLI（每个外层 40 秒上限） | `passed`（符合各项预期） | `.local/validation/p1-01-review/stage-results.json` 及 stage-*.log | docs passed；unit 10 passed + 1 Git 测试 skip；typecheck blocked / exit 2，没有安装依赖/生成声明 |
| Windows | 原 40 文件保留及 client/ SHA-256 核对 | `passed` | `.local/validation/p1-01-review/preservation.json` | 无文件消失，client/ 全部原字节；仅 10 个授权工具/文档更新 |
| macOS | CLI 实机运行 | `not_run` | - | 只有源码安全复核，没有 Mac 实机证据 |
| Windows | Cocos GUI、构建、运行预览、浏览器、截图或图形自动化 | `not_run` | - | 本轮用户明确禁止 |
| 微信真机 | 构建、启动、触控/性能 | `not_run` | - | 未开展平台联调 |

审查导出选取 40 个新增/修改载荷文件（16 modified + 24 added），附 21 个未修改的文档上下文和 6 个审查数据文件，共 67 个 ZIP 条目。2 份云服务/订阅配置不进入载荷或 patch，保留记录于排除清单。完整归档路径由交付的 `.files.txt` 提供，逐文件字节/hash 由 `.manifest.json` 提供。

最终出包时对路径、大小上限、UTF-8、常见凭据/私钥/账号令牌、本机绝对路径进行扫描，并核对 ZIP CRC、无重复/越界路径、条目字节与 manifest hash；完成后的 ZIP SHA-256 写在同名 `.zip.sha256`。最终 ZIP 解压 CLI 的实际结果另写同名 `.checks.json`，这些文件位于 `.local/review/`，作为交付校验数据，不把个人路径机器日志打进包中。源码安全扫描不等于通用、完备的秘密检测证明。

导出扫描的首次尝试把 HTTPS 协议尾部字母和分隔符误判为盘符路径，在读取 `.npmrc` 时主动阻止出包；修正盘符匹配的词边界，并验证 URL 反例与盘符/用户目录正例后才继续。报告内引用该误判示例时又被同一保守规则阻止，改为文字描述后继续。没有关闭敏感内容检查、修改原 `.npmrc` 或导出被排除的配置。

### macOS 无 GUI 安全源码复核

- 检查入口只接受 docs/unit/typecheck/all 白名单，`shell=False`，没有 Cocos、浏览器、open/osascript、截图、npm build/dev/preview 或安装执行分支。系统识别用于报告，不会因 OS 不同开启 GUI 路径。
- docs 是标准库文件/Markdown 静态读取。unit 是已审阅的两份测试：只读项目数据、临时目录、短时 Python 子进程和只读 Git；Git 命令有 10 秒上限，超时子进程测试使用 0.1 秒预算。typecheck 只运行本地锁定的 TypeScript tsc.js `--noEmit`，不执行游戏组件或项目 npm scripts。
- docs/unit 各 30 秒，typecheck 60 秒，all 串行。日志只写 `.local/validation/`；不保留后台服务。该结论只针对当前已审阅的源文件与依赖，不是对任意后续新增测试或被替换的 Node/依赖的安全保证。
- TypeScript 的完整前置条件：可用 Node；按锁文件安装的 TS 5.8.2；真实生成的 tsconfig.cocos.json；四份真实声明；它们引用的实际 Cocos SDK 声明路径有效。外部 Node/npm 的已测版本为 26.4.0/11.17.0；Python 已测 3.13.5（语法要求 3.10+）。
- ZIP 不携带 node_modules/temp，因此 typecheck 在新解压目录应 blocked。若临时声明存在但内部 SDK 路径失效，tsc 仍可能 failed；不能只根据文件存在声称兼容。不得在 Mac 自行启动 Cocos 补齐，也不生成伪造 cc 声明。

### 一次性静态测试取舍

纳入正式回归：引擎版本、meta 配对/UUID、场景对象及当前脚本引用、Git 忽略边界。它们是稳定工程约束，可用无 GUI 的输入输出验证。

不把机器固定路径列表、固定生成 UUID、某次对象总数/文件总数写成长期验收值；这些属于易漂移的实现细节。敏感内容与 ZIP 路径/hash 完整性由每次实际导出复核，不能仅凭上一轮某台机器的固定字符串扫描推定本轮安全。完整代码质量/需求一致性审查仍等待外部 Code Review。

## 4. 运行环境保护核对

本轮只用文件工具、只读 Git、Python 标准库检查、现有 Node 类型检查及 GitHub 只读连接器；未运行 Cocos（包括后台编辑器）、浏览器、截图或图形自动化，未重新安装环境或更改系统配置。所有短时 CLI 子进程均等待退出。没有结束或查询无关用户进程，没有覆盖用户数据。

ZIP/清单/校验数据只写忽略目录；不上传或发送外部审查者，交由用户自行复审/分发。工作区的云服务配置只是导出排除，原文件仍保留。

## 5. 文档同步清单

- `docs/PLAN.md`：是；明确源码级 Code Review 与 Windows 预览尚未完成，P1-01 仍 in_progress。
- `docs/FEATURES.md`：不改；FEAT-012 已为 in_progress，其他产品 Feature 状态不变。
- `docs/features/FEAT-012-asset-and-quality.md`：是；新增复审准备证据引用，不勾选未完成验收。
- `README.md`、`docs/TECH_STACK.md`、`docs/TESTING.md`：是；完整前置条件、回归覆盖和 ZIP 验证限制。
- `docs/ARCHITECTURE.md`：仅同步新增静态测试文件，不改变产品架构。
- `docs/INDEX.md`、`docs/CHANGELOG.md`：是；新增报告导航和本轮记录。
- AGENTS、DEV_ENVIRONMENT、素材/联机/产品/ADR：不改；无策略、素材或产品范围变更。

## 6. 未解决问题、风险和下一步

源码级完整 Code Review、Windows 实际游戏预览/画面/运行生命周期、Mac 实机 CLI 和微信真机均未完成；本轮准备审查材料与脚本安全复核不代替它们。ZIP 也不是无需依赖和引擎即可运行的游戏发行包。

保留工作区全部成果，不进行 Git 暂存/提交/推送/PR/合并，不启动后续 Issue。完成审查包交付后停止，等待进一步复审和用户单独通知 GUI 验收。
