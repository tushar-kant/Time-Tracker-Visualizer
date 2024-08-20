import * as vscode from 'vscode';
import { TimeTracker } from './timeTracker';
import { ReportGenerator } from './reportGenerator';

export function activate(context: vscode.ExtensionContext) {
    // Instantiate TimeTracker to start tracking automatically
    new TimeTracker(context);

    // Register the command to generate the report
    const reportGenerator = new ReportGenerator(context);
    let disposable = vscode.commands.registerCommand('time-tracker.generateReport', () => {
        reportGenerator.generateReport();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
