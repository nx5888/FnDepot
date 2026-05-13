# FnDepot — 飞牛OS (FnOS) 应用包仓库

飞牛OS 第三方应用包（FPK）分发仓库。

## 📦 应用列表

### [Chat2API](./chat2api)

AI 服务商统一管理面板，提供标准 OpenAI 兼容 API 接口转发。

| 项目 | 说明 |
|------|------|
| 版本 | [v1.3.4](https://github.com/nx5888/FnDepot/releases/tag/v1.3.4) |
| 下载 | [chat2api.fpk](https://github.com/nx5888/FnDepot/releases/download/v1.3.4/chat2api.fpk) |
| API 端口 | **8080**（同 OpenAI `/v1/chat/completions` 格式） |
| 管理端口 | **8081**（Web 管理界面） |

**功能特性：**
- 多服务商管理：OpenAI、Claude、Gemini、Qwen 等
- 统一 API 代理（兼容 OpenAI SDK）
- Web 管理面板（Dashboard、代理设置、模型管理、会话日志）
- 内置均衡负载与会话管理

**最新更新 v1.3.4：**
- 🛡️ 修复浏览器翻译插件导致 React 18 `insertBefore` 崩溃（添加 `notranslate` 防护）
- 🔗 API 与管理界面端口分离（8080 ↔ 8081）
- 🎯 ErrorBoundary 手动重试优化
- ⚡ Dashboard 数据版本隔离，防止陈旧请求污染

---

## 🔧 使用说明

1. 下载 `.fpk` 文件
2. 在飞牛OS 应用中心 → 手动安装 → 选择下载的 fpk 文件
3. 安装完成后访问 `http://<NAS_IP>:8081` 进入管理界面

## 📁 目录结构

```
FnDepot/
├── chat2api/          # Chat2API 源码与构建包
│   ├── chat2api.fpk   # 安装包
│   ├── app/           # 服务端源码（server.cjs + 前端构建）
│   ├── manifest       # FnDepot 应用清单
│   └── _build_fpk.py  # FPK 构建脚本
├── fnpack.json        # 索引文件
└── README.md
```

## ⚖️ 许可

各应用包遵循其上游项目的许可协议。
