# 技术参考资料（官方来源优先）

> DOC-REF · v1.3 · 查证日期：2026-10-26。外部内容可能更新，实施前复核。

1. [Cocos Creator 3.8 · 命令行发布项目](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-in-command-line.html) —— 官方明确命令行构建**也需要 GUI 环境**，以及命令行参数和退出码。
2. [Cocos Creator 3.8 · 发布到微信小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html) —— 构建小游戏、Cocos 的“运行”操作唤起微信开发者工具；设备方向可选 Portrait/Landscape，构建时写入 game.json。本轮只查文档，未构建验证。
3. [Cocos Creator 3.8 · 小游戏分包](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html) —— Asset Bundle 分包与微信小游戏适配。
4. [Cocos Creator V3.8.8 正式发布（Cocos 社区）](https://forum.cocos.org/t/topic/172319) —— 发布信息，2025-12-16。
5. [Cocos Creator 3.8 · 跨平台发布](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/) —— 支持平台总览。
6. [Cocos 官方编辑器版本 API](https://creator-api.cocos.com/api/cocoshub/editor_version_list?lang=zh&ver=2.3.2) —— 本轮实际取得 3.8.8 Windows 包 `CocosCreator-v3.8.8-win-121518.zip`；校验签名、版本及 hash 后安装。
7. [项目结构](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/project-structure/index.html) 与 [tsconfig](https://docs.cocos.com/creator/3.8/manual/zh/scripting/tsconfig.html) —— 源码、settings、meta 与生成缓存的边界；实际模板使用 `temp/tsconfig.cocos.json`，以本轮安装包为准。
8. [操作当前场景](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/scene-script.html) 与 [消息系统](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/messages.html) —— 临时 Windows 扩展通过 `execute-scene-script` 调用引擎，使用资产数据库保存；不是 Mac 安全 CLI。
9. [项目设置](https://docs.cocos.com/creator/3.8/manual/zh/editor/project/index.html) —— 默认 Canvas 的设计分辨率、Fit Height/Fit Width；默认值与旧场景布局分别核验，不能只改默认值便认定场景正确。
10. [多分辨率适配方案](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/multi-resolution.html) —— 设计分辨率与屏幕分辨率有别；同时启用 Fit Height/Fit Width 可等比完整显示设计区域，可能留边。本项目 Startup 暂用此策略；项目实际执行证据统一见任务报告，不由技术资料推定通过。

说明：微信邀请/登录的最终 API 字段、授权范围、平台备案/包体规则须在 P4/P5 以前以微信官方当时最新开发文档和测试结果为准；本阶段只做需求设计，不宣称已验证 SDK 行为。
