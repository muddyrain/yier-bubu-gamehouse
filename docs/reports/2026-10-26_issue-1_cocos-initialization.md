# 任务报告 — Issue #1 / P1-01 初始化 Cocos 工程与安全环境

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows NT 10.0.26200 | 功能：FEAT-012（工程基线），FEAT-001（边界说明） | 分支：master，未创建新分支

## 1. 本次授权范围

任务目标：执行 [Issue #1](https://github.com/muddyrain/yier-bubu-gamehouse/issues/1)，建立 Cocos Creator 3.8.8 最小真实工程、入口场景、TypeScript 配置、安全 CLI 和文档；用户随后明确授权安装环境，并亲自完成 Cocos 登录。

明确不做：正式大厅、选角、游戏生命周期/存档、塔防/矿工/合成/贪吃蛇、网络/后端、微信开发者工具/真机、正式角色素材；不 add、commit、push、建 PR、merge 或启动下一 Issue。

开始前完整读取根 AGENTS、README、PLAN、DEV_ENVIRONMENT、WORKFLOW、DOC_RULES、FEATURES、TECH_STACK、ARCHITECTURE、TESTING、FEAT-001/010/012、相关 ADR/素材规范/台账与报告模板；通过 GitHub 连接器读取 Issue 正文和评论（0 条）。初始 `git status --short --branch` 为干净的 `master...origin/master`，HEAD 为 `043ae7f`，没有其他未提交修改。

技能检查：读取并采用 GitNexus、karpathy-guidelines、encoding-guard；图形操作前读取 Computer Use 及其 guidance/confirmations。当前没有 GitNexus 工具，使用只读原生 Git。检查到本机 Superpowers 链接及安装目录，但没有可读取的 `SKILL.md` 实体，未声称执行其缺失流程，也未安装或更改技能。

用户后续要求在自己游玩其他游戏时不干扰操作；此后停止焦点切换、键鼠自动化和屏幕采集，仅继续 CLI 与 Windows 后台引擎数据操作。实际预览和画面验收留待复审后的合适时机。

## 2. 实际交付与代码影响

环境：

- Cocos Creator 3.8.8，官方 Windows 包 `CocosCreator-v3.8.8-win-121518.zip`，1,027,270,586 字节，解压约 3.92 GB。独立安装，无 Dashboard 安装、全局 PATH 或系统配置修改。
- 官方版本 API 实际返回该 URL。程序 ProductVersion/FileVersion 均为 3.8.8；Authenticode `Valid`，签名主体为 Xiamen Yaji Software Co., Ltd.。
- 下载 SHA-256：`E365030AA4F24B515F499CF093CD86FDF38A0F763B5FBCACB20E96253E0FCC0B`。它是本次下载的追踪 hash，不宣称来自官方公布的校验表。
- 现有 Node 26.4.0、npm 11.17.0、Python 3.13.5；无全局工具升级。TypeScript 5.8.2 与实际编辑器包内编译器版本一致。安装目录等本机绝对路径仅在忽略的 `.local/environment.json` 和本机日志中保存。

新增（可版本控制文件）：

- `.node-version`、`.npmrc`、`package.json`、`package-lock.json` — 固定 CLI 工具版本、唯一 TypeScript 依赖及完整性；禁用依赖脚本，无 GUI npm scripts。
- `client/.creator/default-meta.json`、`client/.gitignore` — 实际 `Empty(2D)` 模板导入/忽略配置。
- `client/package.json` — 项目名/独立 UUID；`creator.version` 由编辑器写入。
- `client/tsconfig.json` — 继承真实生成配置，strict/noEmit/noUnused；跳过引擎声明内部检查。
- `client/assets/scripts/SmokeTest.ts`、`client/assets/scripts/SmokeTest.ts.meta`、`client/assets/scripts.meta` — 最小启动组件；meta 为编辑器实际导入生成。
- `client/assets/scenes/Startup.scene`、`client/assets/scenes/Startup.scene.meta`、`client/assets/scenes.meta` — 官方 2D 预设经 3.8.8 的 `EditorExtends.serialize` 和资产数据库实际保存，含 Canvas/Camera/SmokeTest。
- `client/settings/v2/packages/engine.json` — 官方 2D 模板及编辑器更新的引擎模块配置。
- `client/settings/v2/packages/project.json` — 通过 Editor.Profile 实际写入的 720×1280、fitWidth 设计分辨率。
- `client/settings/v2/packages/builder.json`、`device.json`、`information.json`、`program.json`、`cocos-service.json`（均在同一 packages 目录）— 编辑器自动生成的默认版本/功能配置；无真实服务开通或账号密钥。
- `tools/validate.py` — 固定 CLI 白名单，记录 OS/Python，串行运行、超时、保留失败码/日志，缺输入时 blocked。
- `tools/tests/test_validation.py` — 5 个工具回归测试，包括实际短时子进程失败和超时终止。
- 本报告 — 仅维护本任务的实现和验证证据，不作为第二份状态表。

修改：

- `.gitignore` — 补充 profiles 和 Python 缓存；源码/场景/meta/settings/锁文件不被忽略。
- `tools/check_docs.py` — 限定扫描 README/AGENTS/docs，避免把 node_modules、引擎缓存和本机证据误判为自有文档。
- `README.md`、`docs/PLAN.md`、`docs/FEATURES.md`、`docs/TECH_STACK.md`、`docs/ARCHITECTURE.md`、`docs/TESTING.md`、`docs/DEV_ENVIRONMENT.md`、`docs/RESOURCES.md`、`docs/ASSET_LICENSES.md`、`docs/INDEX.md`、`docs/REFERENCES.md`、`docs/CHANGELOG.md`、`docs/features/FEAT-001-game-lobby.md`、`docs/features/FEAT-012-asset-and-quality.md` — 当前事实、边界、入口与证据联动；ENV 仅补充预算事实，不调整 OS 策略。

删除：无既有版本文件删除。临时编辑器扩展已移至忽略的 `.local/p1-01-scene-tools-used/`，不会随工程再次启动；安装包/日志/临时类型反例也仅在 `.local/`，未纳入版本控制。没有创建空的游戏模块或服务器目录。

既有行为受影响：此前只有文档检查；现在仍可直接执行 `tools/check_docs.py`，扫描范围收敛到自有文档。新增工具只写本地验证日志，场景不读写存档、不请求网络、不播放音频。两个角色始终同等展示，白/棕矩形不冒充正式美术。

## 3. 实际验证（无验证则写 not_run）

所有证据路径相对于仓库；`.local/` 默认不提交。常规最终检查目录由 `tools/validate.py` 终端输出与该目录 `summary.json` 对应，详见本节末尾。初期探测的输出来自本轮工具记录；重现命令和重点持久日志如下。

| OS | 命令/GUI/真机步骤 | 结果 `passed/failed/not_run/blocked` | 日志或证据 | 覆盖范围 / 不代表什么 |
| --- | --- | --- | --- | --- |
| Windows | OSDescription；`git status --short --branch`；`git log -1 --oneline`；`rg --files`；工具版本/安装路径/注册表/磁盘检查 | `passed` | 本轮命令输出，环境摘要 `.local/environment.json` | 初始干净、无已有 Cocos 安装；不是运行验证 |
| Windows | 官方 API 查询；curl HTTPS 下载，900 秒上限、最多 2 次重试；Get-FileHash；ZipFile 校验解压路径后解压；版本及 Authenticode 检查 | `passed` | `.local/validation/p1-01/cocos-download.log`、`cocos-download-sha256.log`、`cocos-extract.log`、`cocos-version-signature.json` | 安装包和实际程序版本，不验证游戏绘制 |
| Windows | 基线 `python -B tools/check_docs.py`（30 秒 subprocess 包装） | `passed` | `.local/validation/p1-01/baseline-docs.log` | 35 份 Markdown、12 Feature、29 相对链接 |
| Windows | 实现前 `python -B -m unittest discover -s tools/tests -v` | `failed`（预期红灯） | `.local/validation/p1-01/unit-red.log` | 当时 validate 模块尚未实现，不隐瞒失败 |
| Windows | 审阅 TypeScript 版本/依赖脚本后，npm install/lock 更新；最终调用本机 npm-cli.js 执行 `ci --ignore-scripts --no-audit --no-fund`（Python 包装 60 秒上限） | `passed` | `.local/validation/p1-01/npm-install.log`、`npm-lock-refresh.log`、`typescript-registry.json`、`npm-ci.log` | 唯一包来自 npm 官方 registry，完整性与锁文件一致；未执行包生命周期脚本 |
| Windows | `python -B tools/validate.py unit` | `passed` | `.local/validation/p1-01/20261026T122825.463374Z/unit.log` | 5 测试通过，覆盖白名单、失败码/日志、缺输入、超时、扫描边界 |
| Windows | 首轮 `python -B tools/validate.py all` | `failed` | `.local/validation/p1-01/20261026T123139.156912Z/` | docs/unit 通过；tsc 检查了引擎内部声明，出现私有 PAL/WebGPU 等诊断 |
| Windows | 明确第三方声明边界后 `python -B tools/validate.py typecheck` | `passed` | `.local/validation/p1-01/20261026T123255.411922Z/typecheck.log` | 项目严格源码检查，不复检引擎 SDK 的 `.d.ts` 内部实现 |
| Windows | 临时反例 `tsc --project .local/tsconfig-negative.json --noEmit`（60 秒上限） | `passed`（成功拒绝错误） | `.local/validation/p1-01/typecheck-negative.log` | `boolean = 1` 产生 TS2322 / exit 2；首次反例配置还继承了机器相关 types 路径，调整为不引入这些路径后确认目标诊断 |
| Windows | Cocos 3.8.8 打开 `client/`、导入脚本、生成配置和 meta；用户手动登录 | `passed` | `.local/validation/p1-01/editor-visible-stdout.log`，工程 `creator.version`、生成 meta | 只确认编辑器识别/加载工程，不等于运行预览 |
| Windows | 首轮临时扩展尝试编辑器 save-scene | `failed` | `.local/validation/p1-01/editor-api.jsonl`、`editor-api-stderr.log` | create-component 未找到节点，save-scene 请求 15 秒超时；未把超时当成功 |
| Windows | 改用实际引擎序列化 + asset-db save-asset；反序列化生成内容并显式调用 SmokeTest.start | `passed` | `.local/validation/p1-01/editor-api.jsonl`、`editor-api-result.json`、`editor-api2-stdout.log` | 真实 SceneAsset/组件，6 Label + 2 Graphics；上下文为 `engine-deserialize-editor-explicit-start`，不代表自动生命周期或像素正确 |
| Windows | 真实游戏预览、画面/布局、运行时 start 自动触发、正常预览退出 | `not_run` | - | 用户要求后台且不干扰本机游戏；Issue AC-02 未完成 |
| macOS | docs/unit/typecheck CLI 实机执行 | `not_run` | - | 当前仅 Windows；冷检出缺引擎声明时 typecheck 明确 blocked，不自动打开 Cocos |
| macOS | Cocos/浏览器/微信工具/GUI | `not_run` | - | 未在 Mac 执行任何操作 |
| 微信真机 | 构建、开发者工具、触控/启动/性能 | `not_run` | - | 本 Issue 未做微信平台联调 |
| Windows | 文档更新后 `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T125148.663762Z/summary.json` 及同目录日志 | 文档 36 份 / 12 Feature / 35 相对链接，5 单测，源码类型检查均 exit 0 |
| Windows | encoding-guard 对全部改动/新增文本检查；`git diff --check` | `passed` | `.local/validation/p1-01/final-encoding.log`、`final-diff-check.log` | 中文未发现编码/文本丢失；已有文件 diff 无空白错误 |
| Windows | `python -B .local/final_static_checks.py`；按安装路径查询本轮 Cocos 残留进程 | `passed` | `.local/validation/p1-01/final-vcs-static.json`、`editor-processes-after.json` | 4 份 meta UUID 唯一、场景含真实组件、保留/忽略边界正确、本机绝对路径未泄入可提交文件；进程 Count=0 |

最终静态核对的首次一次性命令因 Windows stdin CRLF 被 Git 当作文件名字符而断言失败，改用 `git check-ignore --stdin -z` 的 NUL 分隔后真实通过；没有为通过而改变忽略规则。首次零进程查询没有生成空日志文件，后改为显式记录 `Count=0`。上述排查均未触发 GUI 或改变系统设置。

预算引用与报告表格补齐后，另执行 `python -B tools/validate.py docs`，结果 `passed`，日志目录 `.local/validation/p1-01/20261026T125520.157652Z/`；编码、忽略规则、meta 和路径泄漏扫描亦重跑通过。最终 Git 核对为 HEAD `043ae7f`、16 个已跟踪文件修改、24 个新增文件、0 暂存，证据 `.local/validation/p1-01/final-git.json`。未提交、未推送、未创建 PR。

## 4. 运行环境保护核对

- 前半程根据 Windows 授权启动过 Cocos 窗口，登录由用户本人完成；没有操作账号密码、系统权限或安全设置。
- 窗口采集受到其他前台内容遮挡，未用该画面作为 Cocos 测试证据、未保存截图文件。检测持续用户输入后停止图形自动化；用户提出后台要求后没有再次采集屏幕或发送输入。
- 后半程仅 Windows 隐藏启动本轮编辑器及本地临时扩展，没有打开浏览器/微信工具、没有构建/持续预览；隐藏运行没有被用作 macOS 绕过方式或图形通过依据。
- 临时扩展单条消息 15 秒上限、等待资产库最多 30 次 × 1 秒，执行完后退出自己所属编辑器；两次运行的成功/失败与退出事件均保留。临时扩展已移出工程，不常驻。
- 本轮曾仅按记录 PID 和已核对的安装路径结束自己启动的编辑器树；没有按通用进程名结束用户游戏或其他应用。
- 无全局依赖安装/升级、PATH/shell 修改、系统执行策略/网络/权限/启动项修改，无用户存档和私人文件上传/覆盖。引擎初次运行产生自己的用户级配置和缓存；这不等于“系统零副作用”。
- 日志/依赖/缓存/本机绝对路径均留在忽略目录。外部 npm 对既有用户配置 `home` 发出警告，不影响本次退出码；没有擅自修改该用户配置。

## 5. 文档同步清单

- `docs/FEATURES.md`：是；仅 FEAT-012 进入 in_progress，其他产品 Feature 仍 planned。
- `docs/features/FEAT-012-asset-and-quality.md`：是；补充工程安全基线范围/验收和证据边界，正式美术/发布验收未勾选。
- `docs/features/FEAT-001-game-lobby.md`：是；明确 Startup 不是正式大厅，未把 FEAT-001 标成实现。
- `docs/PLAN.md`：是；修正基线已入库，P1 in_progress，P1-01 留待复审/图形验收，不标 done。
- `docs/CHANGELOG.md`：是；追加本轮实现和待验收项，历史记录保留。
- `README.md`、`docs/TECH_STACK.md`：是；真实版本、安装/检查入口、预算与依赖条件。
- `docs/ARCHITECTURE.md`、`docs/TESTING.md`：是；最小实际目录、安全白名单和编辑器探针限制。
- `docs/ASSET_LICENSES.md`：是；登记白/棕几何开发占位，角色商用授权仍 unverified。
- `docs/RESOURCES.md`、`docs/REFERENCES.md`、`docs/INDEX.md`：是；环境事实、官方来源、报告索引。
- `docs/DEV_ENVIRONMENT.md`：仅把“P1 尚待确定预算”同步为已实现 CLI 预算引用，不变更 OS 执行策略或红线。
- `AGENTS.md`、MULTIPLAYER、PRODUCT、ADR：未修改；不改变双平台红线、产品/联机范围或目标架构决策。

## 6. 未解决问题、风险和下一步

- Issue AC-01 的工程识别/有效源文件已有实际证据；AC-02 完整 Windows 图形运行验收仍未执行，因此 P1-01 不标 done、不关闭 Issue。
- Mac 实机 CLI、真实运行时生命周期、绘制/布局、微信真机/性能均未验证；不得据后台反序列化/API 探针宣称这些通过。
- 新检出没有引擎生成声明时类型检查会 blocked；Mac 用户应保留这一阻塞，不允许为补齐声明擅自启动 Cocos。本轮未验证一个无需引擎安装的完整 Mac tsc 路径。
- 下载/解压及引擎启动仍占磁盘和短时 CPU/内存，未测量对用户前台游戏帧率的影响；没有承诺后台操作完全零资源影响。无持续引擎预览或服务残留。
- 复审后由用户决定何时补充 Windows 预览和 Mac 实机检查；正式大厅和后续游戏必须另行授权。本轮停在工作区变更，等待复审。
