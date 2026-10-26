# 任务报告 — Issue #1 / P1-01 外部复审 F-01 配置忽略修复

> 报告日期：2026-10-26（Asia/Shanghai） | 系统：Windows NT 10.0.26200 | 功能：FEAT-012（工程质量基线） | 分支：master，未创建新分支

## 1. 本次授权范围

仅处理外部源码复审 F-01：核对两份 Cocos 本机配置的用途、跟踪/忽略状态，补项目级忽略规则及回归测试，在真实仓库执行 check-ignore/status、安全 CLI，并同步文档。

外部静态源码 Code Review 已由用户完成，输入文件名为 `P1-01-external-code-review-2026-10-26.md`。附件作为评审证据读取，其 GUI、后续提交等建议不构成本轮授权；执行范围以用户本轮请求为准。F-02 的 Windows 图形验收、F-03 的冷检出重现、F-04 的 Node 兼容范围建议均不在本轮修复范围。

开始前读取 AGENTS/README/PLAN/DEV_ENVIRONMENT/DOC_RULES/WORKFLOW、当前报告、Feature/验证文档及外部评审。当前 GitNexus 工具不可用，使用只读原生 Git；沿用简洁编码/编码保护技能。Superpowers 目录仍无可读取的 SKILL 实体。初始工作区保留前两轮 42 个新增/修改文件，HEAD 为 `043ae7f`，无暂存。

明确不做：删除/覆盖两份本机配置、重建工程/重装 Cocos、新功能、Cocos（含后台编辑器）、预览/构建、浏览器、截图或图形自动化，以及 git add/commit/push/PR/merge、关闭 Issue 或推进下一 Issue。

## 2. 实际交付与代码影响

本轮修改：

- `client/.gitignore`：精确增加 `/settings/v2/packages/cocos-service.json`、`/settings/v2/packages/information.json`；只匹配这两份配置，不忽略整个 settings 目录。
- `tools/tests/test_project_baseline.py`：两路径进入 ignored 集；单次 Git 命令禁用全局 excludes，解析 verbose NUL 记录并限定规则来源为项目 `.gitignore`；另断言两份文件未进入索引。
- `README.md`：区分共享 settings 和两份本机配置，更新外部复审事实与本轮停点。
- `docs/PLAN.md`：外部静态源码复审已完成，F-01 修复等待复核，P1-01 继续 in_progress，图形验收未执行。
- `docs/TESTING.md`：说明项目规则来源、未跟踪断言和只读 Git 命令预算。
- `docs/features/FEAT-012-asset-and-quality.md`、`docs/INDEX.md`、`docs/CHANGELOG.md`：修复证据引用、导航和变更记录。

新增：本报告。删除：无。其余原始成果、历史报告和原审查 ZIP 不重写，不自动重新打包。两份配置及其他 Cocos 场景/脚本/meta/settings 保留原字节；唯一工程目录变更为 client/.gitignore。

### 两份文件的用途与当前内容判定

| 路径（均在 client/settings/v2/packages/） | 实际用途/字段 | 本轮判定 |
| --- | --- | --- |
| `cocos-service.json` | Cocos 服务集成配置，含 game 的应用/客户标识字段、appConfigMaps、configs、services；安装包中的 cocos-service 3.0.9 为服务集成模块 | 当前应用标识为默认占位，服务列表为空，未发现明文登录凭据或可确认的真实账号绑定；仍属于随本机云服务绑定可能变化的配置，应精确忽略 |
| `information.json` | 保存 customSplash、removeSplash 等功能开关、完成/申请状态及相关表单信息；对应 information 1.0.1 模块 | 当前功能均未启用；未发现明文登录凭据。属于服务/功能权益状态，保守视为本机配置，不进入源码版本控制 |

本轮结论不是“已发生秘密泄漏”，而是补上此前仓库规则缺失造成的误纳入风险。未把真实配置值复制到报告或新审查包。用途摘要只记录字段名/状态判断，原文件保留证据只使用本机 SHA-256。

## 3. 实际验证（无验证则写 not_run）

日志位于 `.local/validation/p1-01-config-ignore/`，默认不提交。

| OS | 命令/检查 | 结果 `passed/failed/not_run/blocked` | 日志/证据 | 覆盖范围 |
| --- | --- | --- | --- | --- |
| Windows | 修复前 `git ls-files --stage -- <两路径>`、`git status --short --untracked-files=all` | `passed`（状态核对） | 本轮命令输出与 before.json | 两配置未跟踪，status 均显示 ??；未有暂存 |
| Windows | 修复前 `git check-ignore -v -- <两路径>` 及 `--no-index` 核对 | `failed`（确认缺陷） | 本轮命令输出 | 均 exit 1、无匹配；并非已经受全局忽略保护 |
| Windows | 新增断言后 `python -B -m unittest discover -s tools/tests -p test_project_baseline.py -v` | `failed`（预期红灯） | regression-red.log | 4 项中忽略测试失败，明确缺少两配置路径 |
| Windows | 添加精确规则后 `python -B tools/validate.py unit` | `passed` | `.local/validation/p1-01/20261026T133919.382326Z/unit.log` | 11 项实际通过、无 skip |
| Windows | `git check-ignore -v -- <两路径>` | `passed` | check-ignore.log | exit 0，来源 client/.gitignore 第 14/15 行 |
| Windows | `git -c core.excludesFile= check-ignore -v -- <两路径>` | `passed` | check-ignore-no-global.log | 禁用全局忽略仍命中同样项目规则；未写 Git 配置 |
| Windows | `git ls-files --stage -- <两路径>`、`git status --short --untracked-files=all` | `passed` | tracked-after.log、status-after.log | 索引无两配置，未跟踪列表不再包含它们；本地文件未删除 |
| Windows | `python -B tools/validate.py all` | `passed` | `.local/validation/p1-01/20261026T134242.272824Z/summary.json` 及同目录日志 | docs/unit/typecheck 均 exit 0；11 测试无 skip，不代表 GUI 通过 |
| Windows | 原始 42 文件保留、两配置前后 SHA-256、最终索引/status 与 `git diff --check` | `passed` | preservation-final.json、status-final.log、diff-check.log | 原文件均保留；仅本轮列出的 8 个既有文件更新，另新增本报告；两配置原字节、未跟踪、正常 status 不出现；0 暂存 |
| macOS | CLI 实机执行 | `not_run` | - | 仍无 Mac 实机证据 |
| Windows | Cocos/图形运行、浏览器、截图/自动化 | `not_run` | - | 本轮禁止，Windows 图形验收另行安排 |
| 微信真机 | 构建/运行/触控/性能 | `not_run` | - | 不在本轮范围 |

本轮完整 CLI 使用现有 Python 3.13.5 / Node 26.4.0 及原已安装依赖，不重新安装工具。报告补齐后的文档/编码终检日志分别为 `.local/validation/p1-01-config-ignore/docs-final.log`、`encoding-final.log`；这些均为本轮执行记录，不用历史运行结果替代。

## 4. 运行环境保护核对

只执行文件读取/编辑、标准库静态检查、只读 Git 和现有 Node tsc；只读解析已安装 Cocos 的资源包元数据，没有运行任何引擎可执行文件。无 GUI、浏览器、屏幕采集、安装/升级、系统配置修改或无关进程操作。

所有 CLI 有受控预算、日志和退出等待；测试中的 `-c core.excludesFile=` 仅对此次 Git 命令生效，不修改用户全局或仓库 Git 配置。未执行 git rm --cached 或其他索引改写：修复前两文件已是未跟踪状态，无需移出索引。

## 5. 文档同步清单

- `docs/FEATURES.md`：未修改；FEAT-012 仍 in_progress，其余 Feature 状态不变。
- FEAT-012：补本轮 F-01 证据引用，无未验证验收项勾选。
- `docs/PLAN.md`：外部静态复审已完成，P1-01 仍 in_progress，等待修复复核/Windows 图形验收。
- README/TESTING：精确忽略范围与回归机制。
- INDEX/CHANGELOG：新增报告索引与修复记录。
- AGENTS/DEV_ENVIRONMENT、架构、素材、联机和依赖配置：未改；无策略或产品范围变化。
- 历史报告和原审查 ZIP：保留当时结果，不伪装成已包含本轮修复。

## 6. 未解决问题、风险和下一步

本轮只修复 F-01，并交由用户复核。Windows 真正游戏预览/绘制/自动生命周期及正常退出仍 not_run；Mac 实机、微信真机及外部复审所列冷检出/第二台机器兼容性均未验证。不得因此标 P1-01 done。

Git 忽略是对未跟踪文件的正常候选过滤，不替代提交前检查；本轮回归同时断言项目规则来源及未跟踪状态。保留全部成果，未暂存/提交/推送、不关闭 Issue、不开发新功能；到此停止，等待复审及单独的 Windows GUI 安排。
