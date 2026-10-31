# Feature 总表、编号与实施状态（唯一 Feature 状态源）

> DOC-FEATURES · v1.10 · 2026-10-30。P1-04 已有真实运行证据；仅满足全部验收项的 Feature 标 done。单项详见 `docs/features/`。

全项目首发界面统一横屏，以 1280×720 为设计基准，暂不做单游戏动态旋转，见 [ADR-0003](decisions/ADR-0003-landscape-first.md)。P1-04 已实测双角色进入/操作/返回同一测试模块，补齐 FEAT-001 AC-03、FEAT-002 AC-02；各自现有验收项完成。正式四款、联机与发布质量仍未实现；FEAT-003 的跨正式游戏隔离/获权图像替换仍未完成。证据见 [演示报告](reports/2026-10-30_issue-4_visible-demo.md)。

开发优先级按 PLAN：P1-04 真实演示及矩阵已完成；F-01 未重复重构。下一阶段优先 FEAT-005 单关精致可玩切片，再扩五关；第一版不以前置存档/奖励架构拖延试玩。原稿/可用许可取得前，现有占位不冒充最终原作。

| ID | 功能与详情 | 优先级 | 阶段 | 状态 | 依赖 |
| --- | --- | --- | --- | --- | --- |
| FEAT-001 | [游戏大厅与目录](features/FEAT-001-game-lobby.md) | P0 | P1 | `done` | 无 |
| FEAT-002 | [一二/布布选角](features/FEAT-002-character-selection.md) | P0 | P1 | `done` | 001 |
| FEAT-003 | [小游戏生命周期和注册](features/FEAT-003-game-module-lifecycle.md) | P0 | P1 | `in_progress` | 001 |
| FEAT-004 | [玩家进度和存档](features/FEAT-004-save-system.md) | P0 | P1 | `planned` | 002、003 |
| FEAT-005 | [一二布布守护小屋](features/FEAT-005-tower-defense.md) | P0 | P2/P4 | `planned` | 第一版 002、003；保存扩展 004 |
| FEAT-006 | [一二布布黄金矿工](features/FEAT-006-gold-miner.md) | P0 | P3/P4 | `planned` | 002–004 |
| FEAT-007 | [一二布布合成乐园](features/FEAT-007-merge-game.md) | P1 | P4 | `planned` | 002–004 |
| FEAT-008 | [一二布布贪吃蛇](features/FEAT-008-snake-game.md) | P1 | P4 | `planned` | 002–004 |
| FEAT-009 | [公共奖励与小屋](features/FEAT-009-shared-progression.md) | P1 | P4 | `planned` | 004 |
| FEAT-010 | [微信平台适配](features/FEAT-010-wechat-platform.md) | P0 | P1/P4 | `planned` | 001–004 |
| FEAT-011 | [好友房、选角与联机](features/FEAT-011-multiplayer-room.md) | P1 | P5 | `planned` | 002、003、006、010 |
| FEAT-012 | [素材与发布质量](features/FEAT-012-asset-and-quality.md) | P0 | P1–P4 | `in_progress` | 关联 001、002、010（分阶段） |

优先级说明：P0 = 建立可用骨架/核心玩法所必需；P1 = 首发完整内容或重要延伸；P2 = 后续探索。阶段整体状态唯一记录于 `PLAN.md`，这里仅记录**功能自身状态**。

## 关键规则

- 新 Feature 按下一个编号添加一行并创建符合 `docs/templates/FEATURE_TEMPLATE.md` 的文件；编号只增不减。
- 状态迁移通常为 `planned → in_progress → done`；阻塞为 `blocked`，取消为 `cancelled`，保留记录。
- 进入 `done` 必须满足该 Feature 全部验收项，并有按 OS 分类的真实测试报告；纯文档完成不代表功能 done。
- 本列表与 `docs/PLAN.md` 不相互复制；更新时遵循 `docs/DOC_RULES.md`。
