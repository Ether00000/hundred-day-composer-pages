# 百日作曲实验室：GitHub Pages 部署说明

仓库地址：`https://github.com/Ether00000/hundred-day-composer-pages`

## 上传并发布

1. 在本机解压 `hundred-day-composer-pages.zip`。
2. 打开仓库，点击 **Add file → Upload files**。
3. 上传解压后的全部内容，包括：
   - `index.html`
   - `styles.css`
   - `app.js`
   - `curriculum.js`
   - `.github/workflows/pages.yml`
4. 点击 **Commit changes**。
5. 打开仓库的 **Actions** 页面，等待 **Deploy GitHub Pages** 任务完成。
6. 网站地址将是：`https://ether00000.github.io/hundred-day-composer-pages/`

如果 Actions 提示尚未启用 Pages，请进入 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**，再重新运行工作流。

> 注意：GitHub 不会自动解压上传的 ZIP，请先在本机解压后再上传其中的文件。
