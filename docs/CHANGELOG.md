# 文档与产品决策变更记录

> DOC-CHANGELOG · v1.7 · 日期倒序记录。实现任务的详细验证证据写在报告，不在这里重复。

| 日期 | 类型 | 影响文件 | 原因与变化 | 验证/待验证 |
| --- | --- | --- | --- | --- |
| 2026-10-26 | P1-01-closeout | README、PLAN、TESTING、RESOURCES、FEAT-012、INDEX、收尾报告及本次全部已验收工程/测试/文档 | 用户最终复审接受基础工程、F-01、横屏基线和 Windows 三比例验收，明确授权最终检查后提交/推送 origin/master 并关闭 Issue #1；P1-01 标 done，P1/FEAT-012 继续 in_progress | 最终安全检查实际结果见收尾报告；私有配置/缓存/日志不入库，保留历史失败及竖屏记录；本轮无 GUI，Mac/微信真机/性能仍 not_run；停止，不开始 P1-02 |
| 2026-10-26 | P1-01-landscape-gui-acceptance | README、PLAN、TESTING、TECH_STACK、ARCHITECTURE、FEAT-012、REFERENCES、INDEX、横屏图形报告 | 用户确认横屏外部静态复审通过并另予本次前台/项目截图许可；现有 3.8.8 完成 16:9/4:3/21:9、两次自动启动和停止，正常关闭并保留 IPC/计时诊断；未改场景/脚本/配置 | 新项目截图、原始日志、CLI/忽略及原成果保留检查见报告；无阻断性脚本错误，Mac/微信真机/性能 not_run；保持 in_progress，停止待最终复审，无 Git 写入 |
| 2026-10-26 | P1-01-landscape-baseline | project.json、Startup.scene、SmokeTest.ts、工程静态测试、ADR-0003、PRODUCT、README、PLAN、TECH_STACK、ARCHITECTURE、FEATURES/受影响 Feature、MULTIPLAYER、TESTING、REFERENCES、INDEX、本轮报告 | 用户确认全项目横屏优先；默认配置与既有 Canvas 分别改为 1280×720，双占位对称、保留 Meta/对象 ID/生命周期，新增两项横屏静态回归；窄高玩法在横屏内布局 | CLI 实际结果见报告；本轮无 GUI，新横屏复验 not_run；旧竖屏报告/截图保留，P1-01 in_progress，停止待 Code Review，无 Git 写入 |
| 2026-10-26 | P1-01-AC-02-windows-gui | README、PLAN、TESTING、TECH_STACK、ARCHITECTURE、FEAT-012、INDEX、图形验收报告 | 经本次前台调试/项目截图许可，现有 3.8.8 两次运行 Startup；自动 start、双几何占位、竖屏布局及停止/重启通过；未改工程功能，编辑器正常退出 | 真实截图、原始诊断、文件保留及 CLI 结果见报告；Mac/微信真机与性能 not_run；保持 in_progress，等待最终 Code Review，无 Git 写入 |
| 2026-10-26 | P1-01-F-01-config-ignore | `client/.gitignore`、`tools/tests/test_project_baseline.py`、README、PLAN、TESTING、FEAT-012、INDEX、修复报告 | 外部静态源码复审已完成；本轮仅为 cocos-service/information 两份本机服务/权益配置补项目忽略，测试禁用全局忽略、断言项目规则来源及未跟踪状态，保留原文件 | 真实仓库 check-ignore/status 与安全 CLI 结果见报告；不运行 GUI、不提交、不关闭 Issue；P1-01 仍 in_progress |
| 2026-10-26 | P1-01-review-preparation | `tools/validate.py`、`tools/tests/**`、README、PLAN、TECH_STACK、TESTING、FEAT-012、INDEX、本轮报告 | 补齐四份生成声明的阻塞预检；把一次性 meta/场景/版本/忽略检查纳入回归；准备保留相对路径的源码审查 ZIP、diff、清单及校验数据；原工程与环境保留 | 只运行受控 CLI；源码级 Code Review、Windows 预览及 Mac 实机仍未完成；P1-01 保持 in_progress；本轮不运行任何 GUI |
| 2026-10-26 | P1-01-engine-safety | `client/**`、根依赖配置、`.gitignore`、`tools/**`、README、PLAN、FEATURES、FEAT-001/012、TECH_STACK、ARCHITECTURE、TESTING、DEV_ENVIRONMENT、RESOURCES、ASSET_LICENSES、REFERENCES、INDEX、任务报告 | 使用真实 3.8.8 官方模板/引擎序列化建立最小工程与场景；固定 TS 5.8.2，添加有时限/失败码/日志的 CLI；修正文档尚未入库的旧描述及预算引用，不改 OS 策略；用户要求后台后停止前台自动化 | Windows CLI/引擎数据验证见报告；运行预览、画面验收及 Mac/微信真机未执行；不标 P1-01 done，不自动提交或进入下一 Issue |
| 2026-10-26 | docs-repo-path | `README.md`、`docs/PLAN.md`、`docs/RESOURCES.md` | 核对用户新建的 GitHub 仓库 `muddyrain/yier-bubu-gamehouse`；同步仓库状态和 ZIP 解压到根目录的说明 | 未向 GitHub 远端提交任何文件；仅文档静态检查 |
| 2026-10-26 | initial-docs | `README.md`、`AGENTS.md`、`docs/**` | 建立项目 V1.0 文档基线与只读格式校验工具；明确平等双主角、首发 1+3、macOS GUI 禁止/Windows GUI 允许、未来好友房与统一 Feature 格式 | 文档包已生成；待用户审查并复制进新仓库。游戏/GUI/构建均未验证 |
