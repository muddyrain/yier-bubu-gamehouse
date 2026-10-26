# Git、Issue 与开发任务工作流

> DOC-WORKFLOW · v1.0 · 2026-10-26 · 只描述约定，不代表仓库/流水线已经创建。

## 1. 一次只做一个可验收范围

1. 选择一个稳定 `FEAT-xxx`，在 GitHub Issue 中写清「目标、范围/不做、依赖、验收、OS 验证要求、影响文档」。
2. 检查 `AGENTS.md`、`docs/PLAN.md`、当前系统，确定文件范围、已有改动与验证方式。
3. 功能约定变化时**先更改 Feature**，必要时更新 ADR/架构再改代码；避免代码与文档互相矛盾。
4. 实现最小纵切，执行允许的测试；需要 GUI 的部分由 Windows 执行，Mac 不得擅自打开。
5. 核对新增/修改/删除文件；更新 Feature 状态（仅真实验收后）与阶段计划、Changelog。
6. 按 `docs/templates/TASK_REPORT_TEMPLATE.md` 给出报告，交由用户审阅。

## 2. 分支与提交

- 建议分支名：`feat/<issue>-<short-slug>`、`fix/<issue>-<short-slug>`、`docs/<issue>-<short-slug>`。Issue 编号未知时不虚构。
- 默认**不**自动 `git add/commit/push/PR/merge`。只有用户显式要求提交/推送/开 PR 才执行；默认报告 diff 与建议提交说明。
- 不进行强制 reset、clean、rebase、删除分支，不修改其他 Issue 未完工作，遇到已存在未提交改动先保留并评估冲突。
- 项目实际初始化后，在 README 补充已验证的 branch 策略和 Git 命令，不能用虚构远端 URL。

## 3. 提交内容约束

- Source、`.meta`、Cocos 工程配置、文档纳入 Git；缓存、构建输出、日志、秘钥、临时截图放 `.local/` 等非版本目录。
- 单游戏素材和代码相互隔离，变更共享接口须列出受影响游戏。
- 不提交仅用于验证的未经授权角色截图、抓取的第三方原游戏资源或用户个人身份信息。

## 4. 每次任务报告最小证据

- 改动文件（分新增/修改/删除）；设计决策；真实 OS 与运行命令；通过/失败/未运行；截图若在 Windows 合规采集则记本地证据路径；残留风险；下一步。
- 如果用户要求停止等待审查，立即停在代码状态，不自行继续功能、提交或启动 GUI。

## 5. 文档更新规则引用

必须执行 `docs/DOC_RULES.md` 中的触发表。不要单独另建与 `docs/PLAN.md` 竞争的 `TODO.md`/`CONTEXT.md`。
