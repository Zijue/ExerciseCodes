### 配置eslint插件
- 安装`eslint`插件
- 配置工作区`.vscode/settings.json`文件

```json
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true 
    }
}
```