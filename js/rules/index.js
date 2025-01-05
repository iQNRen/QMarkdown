// 后缀.js不要省略，会报错
import { addCommonRules } from "./commonRules.js";
import { addChatGPTRules } from "./chatgptRules.js";
import { addDeepSeekRules } from "./deepseekRules.js";

// 添加更多规则
const rulesConfig = [
    { keyword: 'deepseek', handler: addDeepSeekRules },
    { keyword: 'chatgpt', handler: addChatGPTRules },
];

const applyRulesForUrl = (url, turndownService) => {
    // 先应用通用规则
    addCommonRules(turndownService);
    // 再应用特定规则
    const matchedRule = rulesConfig.find(rule => url.includes(rule.keyword));
    if (matchedRule) {
        matchedRule.handler(turndownService);
    }
}

export {
    addChatGPTRules,
    addDeepSeekRules,
    applyRulesForUrl,
}
