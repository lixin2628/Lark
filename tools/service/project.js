var state = require('./state');
var cprocess = require('child_process');
var utils = require('../lib/utils');
var FileUtil = require('../lib/FileUtil');
var Project = (function () {
    function Project() {
    }
    Project.prototype.init = function () {
        var stat = new state.DirectoryState();
        stat.path = this.path;
        stat.init();
        this.state = stat;
    };
    Project.prototype.fileChanged = function (path, changeType) {
        var _this = this;
        if (path && changeType) {
            this.initChanges();
            this.changes[changeType].push(path);
        }
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(function () { return _this.build(); }, 200);
    };
    Project.prototype.build = function () {
        this.timer = null;
        if (this.changes == null) {
            this.changes = this.state.checkChanges();
        }
        if (this.showBuildWholeProject()) {
            this.buildWholeProject();
        }
        else {
            this.buildWithExistBuildService();
        }
        this.state.init();
        this.changes = null;
    };
    Project.prototype.buildWholeProject = function () {
        this.buildProcess && this.buildProcess.kill();
        var larkPath = FileUtil.joinPath(utils.getLarkRoot(), 'tools/bin/lark');
        //var build = cprocess.fork(larkPath, ['buildService',this.path], {
        //    cwd: this.path,
        //    stdio: ['ignore', 'ignore', 'ignore'],
        //    silent:true
        //});
        //build.on('message', (msg) => this.onBuildServiceMessage(msg));
        //build.on('exit', (code, signal) => this.onBuildServiceExit(code, signal));
        var build = cprocess.spawn(process.execPath, [larkPath, 'buildService', this.path], {
            detached: true,
            cwd: process.cwd(),
            stdio: ['ipc'],
            encoding: 'utf8'
        });
        this.buildProcess = build;
    };
    Project.prototype.buildWithExistBuildService = function () {
        if (!this.buildProcess) {
            this.buildWholeProject();
            return;
        }
        console.log(this.changes);
        this.sendCommand({
            command: "build",
            changes: this.changes.added.concat(this.changes.modified).concat(this.changes.removed)
        });
    };
    Project.prototype.sendCommand = function (cmd) {
        //this.buildProcess.stdin.write(JSON.stringify(cmd), 'utf8');
        this.buildPort.write(JSON.stringify(cmd));
        //this.buildProcess.send(cmd);
    };
    Project.prototype.onBuildServiceMessage = function (text) {
        //console.log(text);
        try {
            var msg = JSON.parse(text);
        }
        catch (e) {
        }
        if (msg && msg.command == 'build') {
            if (this.penddingRequest) {
                this.penddingRequest.writeHead(200, { 'Content-Type': 'text/plain' });
                this.penddingRequest.end(JSON.stringify(msg));
            }
        }
    };
    Project.prototype.onBuildServiceExit = function (code, signal) {
        console.log("Build service exit with", code, signal);
        this.buildProcess = null;
    };
    Project.prototype.showBuildWholeProject = function () {
        var tsAddorRemove = this.changes.added.concat(this.changes.removed).filter(function (f) { return /\.ts/.test(f); });
        console.log(tsAddorRemove);
        return tsAddorRemove.length > 0;
    };
    Project.prototype.initChanges = function () {
        if (this.changes)
            return;
        this.changes = {
            added: [],
            modified: [],
            removed: []
        };
    };
    return Project;
})();
module.exports = Project;
/// <reference path="../lib/types.d.ts" /> 
//# sourceMappingURL=project.js.map