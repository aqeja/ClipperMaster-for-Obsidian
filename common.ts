import { App, getLanguage } from "obsidian"
export const folderName = 'ClipperMaster'
export const upsertFile = async (app: App, fileName: string, content: string) => {
  const folder = await app.vault.getFolderByPath(folderName)
  if (!folder) {
    await app.vault.createFolder(folderName)
  }
  const filePath = `${folderName}/${fileName}.md`

  const file = await app.vault.getFileByPath(filePath)
  if (file) {
    await app.vault.modify(file, content)
  } else {
    await app.vault.create(filePath, content)
  }
}
const language = getLanguage()
export const isZh = language.startsWith('zh')

const getTexts = () => {
	if (isZh) {
		return {
			listeningPort: '监听端口号',
			desc: 'HTTP请求的端口号',
			enterPort: '输入端口号',
			error: '必须是一个有效的端口号 (1 - 65535)',
			welcome: '欢迎使用 ClipperMaster for Obsidian',
      fileSaved:'🎉 已保存到：',
      guidanceButton: '使用说明',
      guidanceDesc: '点击打开使用说明页面',
      openGuidance: '打开说明'
		}
	}
	return {
		listeningPort: 'Listening Port',
		desc: 'Port to listen for HTTP requests',
		enterPort: 'Enter Port Number',
		error: 'Must be a valid port number (1 - 65535)',
		welcome: 'Welcome to ClipperMaster for Obsidian',
		fileSaved: '🎉 File saved to:',
    guidanceButton: 'Guidance',
    guidanceDesc: 'Click to open guidance page',
    openGuidance: 'Open Guidance'
	}
}
export const texts = getTexts()


export const Welcome = isZh ? `# ClipperMaster for Obsidian

[ClipperMaster](https://clippermaster.com) 是一款强大的 Chrome 浏览器扩展，能让你轻松从网页中提取结构化数据，构建你的专属信息数据库。
![](https://clippermaster.com/clippermaster-intro.png)


# ClipperMaster Obsidian 插件使用指南

**让网页内容一键成为你的知识资产**

ClipperMaster Obsidian 插件是 **ClipperMaster Chrome 插件** 的完美搭档，帮助你将从网页中提取的结构化信息无缝发送并存储到 Obsidian，打造自动化知识管理流水线。

---

## **插件作用**
- **一键存储**：将从网页提取的文本、图片等内容，转换为 Markdown 格式并保存到 Obsidian。
- **结构化存储**：支持模板化存储、让内容井井有条。

---

## **安装步骤**

### **1. 安装 ClipperMaster Chrome 插件**
如果你还没有安装 Chrome 插件，请先前往 [Chrome 商店](https://chromewebstore.google.com/detail/clippermaster/bdilooeboaoifijdnpomfoinefbokjlj) 安装。

### **2. 安装 ClipperMaster Obsidian 插件**
1. 打开 Obsidian，进入 **设置** → **社区插件**。
2. 点击 **浏览**，搜索 **ClipperMaster**。
3. 找到插件后，点击 **安装**，然后 **启用**。
4. 在插件设置中，获取或者修改 **Port**。

### **3. 配置 Chrome 插件**
1. 打开 ClipperMaster Chrome 插件，进入 **Options** → **自动化** → **添加自动化** → 发送到**Obsidian** 。
2. 输入 Obsidian 端设置的 **Port**。

---

## **常见问题**

### **1. 插件支持哪些网页内容？**
- 文本、链接、图片等均可提取并存储。

### **2. 是否需要付费？**
- **发送到Obsidian**这项功能完全免费

### **3. 如何获取技术支持？**
- 访问 [ClipperMaster 官网](https://clippermaster.com) 或者 [给我们发送邮件](mailto:tony@clippermaster.com)。

---

## **立即体验**
点击下方链接，开始你的知识管理革命：
- [安装 ClipperMaster Chrome 插件](https://chromewebstore.google.com/detail/clippermaster/bdilooeboaoifijdnpomfoinefbokjlj)
- 安装 ClipperMaster Obsidian 插件

---
` : `# ClipperMaster for Obsidian

[ClipperMaster](https://clippermaster.com) is a powerful Chrome extension that empowers you to effortlessly extract structured data from web pages, building your personalized information database.

![](https://clippermaster.com/clippermaster-intro.png)


# ClipperMaster Obsidian Plugin User Guide

**Turn Web Content into Your Knowledge Assets with One Click**

The ClipperMaster Obsidian plugin is the perfect companion to the **ClipperMaster Chrome plugin**, helping you seamlessly send and store structured information extracted from web pages to Obsidian, creating an automated knowledge management pipeline.

---

## **Plugin Functionality**
- **One-Click Storage**: Convert text, images, and other content extracted from web pages into Markdown format and save them to Obsidian.
- **Structured Storage**: Supports templated storage, keeping your content organized.

---

## **Installation Steps**

### **1. Install the ClipperMaster Chrome Plugin**
If not already installed, get the Chrome plugin from the [Chrome Web Store](https://chromewebstore.google.com/detail/clippermaster/bdilooeboaoifijdnpomfoinefbokjlj).

### **2. Install the ClipperMaster Obsidian Plugin**
1. Open Obsidian, go to **Settings** → **Community plugins**.
2. Click **Browse**, search for **ClipperMaster**.
3. After finding the plugin, click **Install**, then **Enable**.
4. In the plugin settings, get or modify the **Port**.

### **3. Configure the Chrome Plugin**
1. Open the ClipperMaster Chrome plugin, go to **Options** → **Automations** → **Add Automation** → Send to **Obsidian**.
2. Enter the **Port** set in Obsidian.

---

## **Frequently Asked Questions**

### **1. What web content does the plugin support?**
- Text, links, images, etc., can be extracted and stored.

### **2. Is there a fee?**
- The **Send to Obsidian** feature is completely free.

### **3. How do I get technical support?**
- Visit the [ClipperMaster Official Website](https://clippermaster.com) or [send us an email](mailto:tony@clippermaster.com).

---

## **Experience It Now**
Click the links below to start your knowledge management revolution:
- [Install ClipperMaster Chrome Plugin](https://chromewebstore.google.com/detail/clippermaster/bdilooeboaoifijdnpomfoinefbokjlj)
- Install ClipperMaster Obsidian Plugin
---`