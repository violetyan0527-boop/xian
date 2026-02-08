# 天穹书阁

## 本地运行

```bash
python -m http.server 8000
```

访问：`http://127.0.0.1:8000/index.html`

## 生产域名

此项目为静态站点，若使用 GitHub Pages：

1. 在仓库 Settings → Pages 中选择部署分支（如 `main` 或 `work`）。
2. 自定义域名填写 `yaoxiaocs.com`。
3. 在 DNS 提供商中配置：
   - `A` 记录指向 GitHub Pages IP（如使用 Pages，需按 GitHub 官方文档填写）。
   - 或使用 `CNAME` 记录将 `www` 指向 GitHub Pages 域名。

> 提示：仓库根目录已包含 `CNAME` 文件，GitHub Pages 会自动绑定该域名。
