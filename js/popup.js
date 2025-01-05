// 引入 TurndownService 规则
import * as Rules from './rules/index.js'
import { getPageHTML, formatMarkdownIndentation } from './utils/index.js';

document.getElementById('convert-btn').addEventListener('click', async () => {
    try {
        // 初始化 TurndownService
        var turndownService = new TurndownService({});
        // 获取当前活动标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab && tab.id) {
            // 在当前标签页中执行脚本
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getPageHTML // 修改这里，使用 func 而不是 function
            });

            if (result && result[0] && result[0].result) {

                // 自定义规则：判断那种网站用那种规则
                Rules.applyRulesForUrl(tab.url, turndownService);

                // 转换 HTML 为 Markdown
                var markdown = turndownService.turndown(result[0].result);

                // 格式化
                markdown = formatMarkdownIndentation(markdown)
                // 显示 Markdown 内容
                document.getElementById('output').value = markdown;
            } else {
                console.error('未能获取页面HTML');
            }
        } else {
            console.error('没有找到活动的标签页');
        }

    } catch (error) {
        console.error('操作失败：', error);
    }
});

// 添加复制功能
document.getElementById('copy-btn').addEventListener('click', () => {
    const output = document.getElementById('output');
    const notification = document.getElementById('notification');
    navigator.clipboard.writeText(output.value)
        .then(() => {
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        })
        .catch(err => {
            console.error('复制到剪贴板失败:', err);
        });
});

