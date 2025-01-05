document.getElementById('convert-btn').addEventListener('click', async () => {
    try {
        // 获取当前活动标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab && tab.id) {
            // 在当前标签页中执行脚本
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getPageHTML // 修改这里，使用 func 而不是 function
            });

            // 初始化 TurndownService
            const turndownService = new TurndownService();

            // 检查当前网站是否为 deepseek
            if (tab.url.includes('deepseek')) { // 修改这里，使用 tab.url 而不是 window.location.href
                turndownService.addRule('codeBlock_cv_remove', {
                    filter: (node) => {
                        // 匹配 <span> 标签且 class 包含 "highlight"
                        return node.nodeName === 'DIV' && node.classList.contains('md-code-block-banner');
                    },
                    replacement: (content) => {
                        return '';
                    }
                });
            }
            if (tab.url.includes('chatgpt')) {
                turndownService.addRule('sidebar_remove', {
                    filter: (node) => {
                        return node.nodeName === 'DIV' && node.classList.contains('bg-token-sidebar-surface-primary')
                            || node.classList.contains('sr-only')
                            || node.classList.contains('bg-token-main-surface-primary');
                    },
                    replacement: (content) => {
                        return '';
                    }
                });
            }

            // 自定义规则：将 < pre > <code> 转换为 Markdown 代码块
            turndownService.addRule('codeBlock', {
                filter: ['pre'],
                replacement: (content, node) => {
                    // 提取 <code> 标签的内容
                    const codeNode = node.querySelector('code');
                    let codeContent = codeNode?.textContent || content;

                    const cleanedContent = codeContent.trim();
                    return `\`\`\`\n${cleanedContent}\n\`\`\`\n`;
                },
            });

            // 转换 HTML 为 Markdown
            const markdown = turndownService.turndown(result[0].result);

            // 显示 Markdown 内容
            document.getElementById('output').value = markdown;
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
    navigator.clipboard.writeText(output.value)
        .then(() => {
            alert('Markdown 已复制到剪贴板！');
        })
        .catch(err => {
            console.error('复制到剪贴板失败:', err);
        });
});
// 获取页面HTML的函数
function getPageHTML() {
    // 移除<style>和<script>标签
    const styles = document.querySelectorAll('style');
    const scripts = document.querySelectorAll('script');

    styles.forEach(style => style.remove());
    scripts.forEach(script => script.remove());

    return document.documentElement.outerHTML;
}