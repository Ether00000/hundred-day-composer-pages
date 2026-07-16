# 百日作曲实验室 · 本次升级上传说明

这次是完整升级，不是只改一两个按钮。请把压缩包解压后，将下面 6 个文件上传到 GitHub 仓库根目录并覆盖同名文件：

- `index.html`
- `styles.css`
- `app.js`
- `activities.js`（新增）
- `materials.js`（新增：100 套每日音乐素材）
- `studio.js`（新增）

仓库地址：`https://github.com/Ether00000/hundred-day-composer-pages`

## 上传步骤

1. 打开仓库的 **Code** 页面。
2. 点击绿色 **Code** 按钮左侧的 **Add file** → **Upload files**。
3. 将上面 6 个文件一起拖进上传区。
4. 页面提示同名文件时保留覆盖结果。
5. 在最下方点击 **Commit changes**。
6. 等待 GitHub Pages 约 1–3 分钟，然后打开：
   `https://ether00000.github.io/hundred-day-composer-pages/`
7. 按 `Ctrl + Shift + R`（Mac：`Command + Shift + R`）强制刷新。

旧的 `curriculum.js` 和 `interactive.js` 即使留在仓库也不会再被加载，可以暂时不删除。

## 上传后快速验收

1. 首页应显示“100 套独立音乐素材 / 9 类创作工具 / WAV 真实作品保存”。
2. 点击“进入 Day 01 工作室”，应看到合成器工作台和原生音频播放器。
3. 先载入一个 Day 01 音色素材，再调整 3 个参数、播放 3 次、点击一次 A/B，对作品执行检测。
4. 通过后点击“保存 WAV 并打卡”。
5. 回到主页“我的作品”，刷新页面后音频仍应存在并可以播放、下载。

## 保存方式说明

网站是纯静态 GitHub Pages，不会把个人作品上传到服务器。工程和 WAV 使用浏览器 IndexedDB 保存在当前设备；如果浏览器禁用 IndexedDB，会自动回退为保存工程并在主页重新生成 WAV。清除网站数据、使用无痕模式或更换设备不会自动同步作品，请定期点击“下载 WAV”备份。
