import * as vscode from 'vscode';

export class TimeTracker {
    private context: vscode.ExtensionContext;
    private activeFile: string | null = null;
    private startTime: number | null = null;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;

        vscode.window.onDidChangeActiveTextEditor(this.onFileChange.bind(this));
        vscode.workspace.onDidCloseTextDocument(this.onFileClose.bind(this));
        vscode.workspace.onDidChangeWorkspaceFolders(this.onWorkspaceChange.bind(this));

        this.startTracking();
    }

    private startTracking() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            this.activeFile = editor.document.uri.fsPath;
            this.startTime = Date.now();
        }
    }

    private onFileChange(editor: vscode.TextEditor | undefined) {
        if (this.activeFile && this.startTime) {
            const timeSpent = (Date.now() - this.startTime) / 1000; // Time in seconds
            this.updateTimeData(this.activeFile, timeSpent);
        }

        this.startTracking();
    }

    private onFileClose(document: vscode.TextDocument) {
        if (this.activeFile === document.uri.fsPath && this.startTime) {
            const timeSpent = (Date.now() - this.startTime) / 1000; // Time in seconds
            this.updateTimeData(this.activeFile, timeSpent);
            this.activeFile = null;
            this.startTime = null;
        }
    }

    private onWorkspaceChange(event: vscode.WorkspaceFoldersChangeEvent) {
        if (event.added.length > 0 || event.removed.length > 0) {
            this.startTracking();
        }
    }

    private updateTimeData(filePath: string, timeSpent: number) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
        const workspaceRoot = workspaceFolder ? workspaceFolder.uri.fsPath : 'Unknown Workspace';

        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const timeData = this.context.globalState.get<{ [date: string]: { [folder: string]: number } }>('timeData', {});
        
        if (!timeData[today]) {
            timeData[today] = {};
        }

        if (workspaceRoot in timeData[today]) {
            timeData[today][workspaceRoot] += timeSpent;
        } else {
            timeData[today][workspaceRoot] = timeSpent;
        }
        
        this.context.globalState.update('timeData', timeData);
    }
}
