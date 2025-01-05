import { detectCodeBlockLanguage, unescapeSpecialChars } from "../utils/index.js";

// 公共规则
export const addCommonRules = (turndownService) => {
    // 自定义规则：将 <pre><code> 转换为 Markdown 代码块
    turndownService.addRule('common_codeBlock', {
        filter: ['pre'],
        replacement: (content, node) => {
            // 提取 <code> 标签的内容
            const codeNode = node.querySelector('code');
            let codeContent = codeNode?.textContent || content;

            // 检测语言
            const language = detectCodeBlockLanguage(node);

            // 对 codeContent 进行转义处理
            const escapedContent = unescapeSpecialChars(codeContent.trim());

            // 返回代码块
            return `\`\`\`${language}\n${escapedContent}\n\`\`\`\n`;
        },
    });

    // 添加自定义规则：过滤掉 * * *
    turndownService.addRule('common_filterHorizontalRule', {
        filter: function (node) {
            // 检查是否是水平分割线
            return node.nodeName === 'HR' || (node.nodeName === 'DIV' && node.textContent.trim() === '* * *');
        },
        replacement: function () {
            return ''; // 返回空字符串，过滤掉
        }
    });



};
