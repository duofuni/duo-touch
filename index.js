import Vue from "vue";
const modulesFiles = require.context("./modules", false, /\.js$/);

modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
    Vue.directive(moduleName, {
        inserted(el, { value }) {
            modulesFiles(modulePath).default(el, value)
        }
    });
    return modules;
}, {});