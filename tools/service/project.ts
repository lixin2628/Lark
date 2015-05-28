﻿
import http = require('http');
import state = require('./state');
import cprocess = require('child_process')
import utils = require('../lib/utils');
import FileUtil = require('../lib/FileUtil');

class Project {
    path: string;
    state: state.DirectoryState;
    changes: state.FileChanges;
    timer: NodeJS.Timer;
    buildProcess: cprocess.ChildProcess;
    buildPort: http.ServerResponse;
    penddingRequest: http.ServerResponse;

    init() {
        var stat = new state.DirectoryState();
        stat.path = this.path;
        stat.init();
        this.state = stat;
    }

    fileChanged(path?:string,changeType?:string) {
        if (path && changeType) {
            this.initChanges();
            this.changes[changeType].push(path);
        }
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(() => this.build(), 200);
    }

    build() {
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
    }

    buildWholeProject() {
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
            encoding:'utf8'
        });

        this.buildProcess = build;
    }

    buildWithExistBuildService() {
        if (!this.buildProcess) {
            this.buildWholeProject();
            return;
        }

        console.log(this.changes);

        this.sendCommand({
            command: "build",
            changes: this.changes.added.concat(this.changes.modified).concat(this.changes.removed)
        });
    }

    private sendCommand(cmd: lark.ServiceBuildCommand) {
        //this.buildProcess.stdin.write(JSON.stringify(cmd), 'utf8');
        this.buildPort.write(JSON.stringify(cmd));
        //this.buildProcess.send(cmd);
    }

    onBuildServiceMessage(text) {
        //console.log(text);
        try {
            var msg: lark.ServiceCommandResult = JSON.parse(text);
        }
        catch (e) {

        }
        if (msg && msg.command == 'build') {
            if (this.penddingRequest) {
                this.penddingRequest.writeHead(200, { 'Content-Type': 'text/plain' });
                this.penddingRequest.end(JSON.stringify(msg));
            }
        }
    }

    private onBuildServiceExit(code: number, signal:string) {
        console.log("Build service exit with", code, signal);
        this.buildProcess = null;
    }

    private showBuildWholeProject() {
        var tsAddorRemove = this.changes.added.concat(this.changes.removed).filter(f=> /\.ts/.test(f));
        console.log(tsAddorRemove);
        return tsAddorRemove.length > 0;
    }

    private initChanges() {
        if (this.changes)
            return;
        this.changes = {
            added: [],
            modified: [],
            removed: []
        };
    }
}

export = Project;

















/// <reference path="../lib/types.d.ts" />