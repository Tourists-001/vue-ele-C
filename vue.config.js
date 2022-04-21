const {
    defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
    devServer: {
        proxy: 'http://localhost:7001',
    },
    transpileDependencies: true,
    lintOnSave: false,
})