// 定义计数器
let titleCounter = 0;
// chatgptRules.js
export const addChatGPTRules = (turndownService) => {
    // 清空侧边栏
    turndownService.addRule('chatgpt_sidebar_remove', {
        filter: (node) => {
            return node.nodeName === 'DIV' && node.classList.contains('bg-token-sidebar-surface-primary')
                || node.classList.contains('sr-only')
                || node.classList.contains('bg-token-main-surface-primary');
        },
        replacement: (content) => {
            return '';
        }
    });

    // 自定义规则：处理带有 data-testid 属性的 div
    turndownService.addRule('chatgpt_conversationTurn', {
        filter: (node) => {
            // 匹配带有 data-testid 属性的 article
            return node.nodeName === 'ARTICLE' && node.getAttribute('data-testid')?.startsWith('conversation-turn-');
        },
        replacement: (content, node) => {
            // 获取 data-testid 属性的值
            const testId = node.getAttribute('data-testid');

            // 使用正则表达式提取数字部分
            const match = testId.match(/conversation-turn-(\d+)/);
            if (match) {
                const number = parseInt(match[1], 10); // 提取数字并转换为整数

                // 判断数字是否为偶数
                if (number % 2 === 0) {
                    titleCounter++;
                    // 如果是偶数，将其作为标题处理
                    return `## ${titleCounter}.${content.trim()}\n`; // 添加 Markdown 标题前缀
                } else {
                    // 如果是奇数，保持原样
                    return `${content}\n\n`;
                }
            }

            // 如果没有匹配到数字，保持原样
            return `${content}\n\n`;
        },
    });

    // 添加自定义规则：替换文章最后的关键词
    turndownService.addRule('chatgpt_replaceKeywords', {
        filter: function (node) {
            // 检查是否为元素节点
            return node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === 'DIV' &&
                node.textContent.includes('到目前为止，此对话有帮助吗？');
        },
        replacement: function (content) {
            const keywords = [
                '4o',
                '到目前为止，此对话有帮助吗？',
            ];
            keywords.forEach(keyword => {
                content = content.replace(new RegExp(keyword, 'g'), '');
            });
            return content;
        }
    });
}