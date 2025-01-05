// 防止部分数字>9(两位数)出现缩进不同，导致显示成代码块。影响美观
export const formatMarkdownIndentation = (markdown, indentSize = 2) => {
    // 定义统一的缩进字符串
    const indent = ' '.repeat(indentSize);

    // 按行分割 Markdown 文本
    const lines = markdown.split('\n');

    // 标记是否处于代码块中
    let inCodeBlock = false;

    // 处理每一行
    const formattedLines = lines.map(line => {
        // 检查是否进入或退出代码块
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock; // 切换代码块状态
            return line; // 保持代码块标记行不变
        }

        // 如果处于代码块中，保持原样
        if (inCodeBlock) {
            return line;
        }

        // 匹配行首的缩进（空格或制表符）
        const match = line.match(/^[\s\t]+/);
        if (match) {
            // 将缩进替换为统一的空格
            return indent + line.trimStart();
        }

        return line; // 如果没有缩进，保持原样
    });

    // 重新拼接为 Markdown 文本
    return formattedLines.join('\n');
}

