// 检测代码块的语言
export const detectCodeBlockLanguage = (node) => {
    var languageNode = null;

    languageNode === null && (languageNode = node.closest('.md-code-block')?.querySelector('.md-code-block-infostring'));

    // gpt得还没适配
    return languageNode?.textContent.trim() || null;

}
