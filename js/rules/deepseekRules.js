// 定义计数器
let titleCounter = 0;

// deepseekRules.js
export const addDeepSeekRules = (turndownService) => {
    // 清空代码块前面的复制和编程语言。（影响美观）
    turndownService.addRule('deepseek_codeBlock_cv_remove', {
        filter: (node) => {
            // 匹配 <span> 标签且 class 包含 "highlight"
            return node.nodeName === 'DIV' && node.classList.contains('md-code-block-banner');
        },
        replacement: (content) => {
            return '';
        }
    });

    // 自定义规则：让用户提问的问题充当标题
    turndownService.addRule('deepseek_fa81Div', {
        filter: (node) => {
            // 匹配类名为 fa81 的 div
            return node.tagName === 'DIV' && node.classList.contains('fa81');
        },
        replacement: (content, node) => {
            // 获取第一个子 div
            const firstChildDiv = node.querySelector('div');
            if (firstChildDiv) {
                titleCounter++;
                // 返回第一个子 div 的值
                return `## ${titleCounter}. ${firstChildDiv.textContent}`;
            }
            return ''; // 如果没有子 div，返回空字符串
        },
    });



    // 清空不需要的地方
    // One more step before you proceed...
    turndownService.addRule('deepseek_no_use', {
        filter: function (node) {
            // 检查元素是否有特定的 id
            return node.nodeName === 'DIV' && node.id === 'cf-overlay';
        },
        replacement: function (content) {
            // 返回自定义的 Markdown 内容
            return ``;
        }
    })

    // 添加自定义规则：替换文章最后的关键词
    turndownService.addRule('deepseek_replaceKeywords', {
        filter: function (node) {
            // 检查是否为元素节点
            return node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === 'DIV' &&
                node.textContent.includes('内容由 AI 生成，请仔细甄别');
        },
        replacement: function (content) {
            const keywords = [
                '开启新对话',
                '深度思考',
                '联网搜索',
                '内容由 AI 生成，请仔细甄别',
            ];
            keywords.forEach(keyword => {
                content = content.replace(new RegExp(keyword, 'g'), '');
            });
            return content;
        }
    });

}


