import * as vscode from 'vscode';
import { getHtmlForWebview } from './HtmlHelper';
import path from 'path';

export class ReportGenerator {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    generateReport() {
        const timeData = this.context.globalState.get<{ [date: string]: { [file: string]: number } }>('timeData', {});

        const panel = vscode.window.createWebviewPanel(
            'timeTrackerReport',
            'Time Tracking Report',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        const { pieChartData, barChartData } = this.prepareChartData(timeData);
        const tableData = this.prepareTableData(timeData);

        panel.webview.html = getHtmlForWebview(panel.webview, pieChartData, barChartData, tableData);
    }

    private prepareChartData(timeData: { [date: string]: { [file: string]: number } }): { pieChartData: string, barChartData: string } {
        const rootFolderTime: { [rootFolder: string]: number } = {};
        const fileTime: { [file: string]: number } = {};

        for (const files of Object.values(timeData)) {
            for (const [filePath, time] of Object.entries(files)) {
                const parsedPath = path.parse(filePath);
                const rootFolder = path.basename(path.dirname(parsedPath.dir));

                if (!rootFolderTime[rootFolder]) {
                    rootFolderTime[rootFolder] = 0;
                }
                rootFolderTime[rootFolder] += time;

                fileTime[filePath] = time;
            }
        }

        const pieChartData = JSON.stringify({
            labels: Object.keys(rootFolderTime),
            datasets: [{
                label: 'Time Spent per Root Folder',
                data: Object.values(rootFolderTime),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        });

        const barChartData = JSON.stringify({
            labels: Object.keys(fileTime),
            datasets: [{
                label: 'Time Spent on Files',
                data: Object.values(fileTime),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        });

        return { pieChartData, barChartData };
    }

    private prepareTableData(timeData: { [date: string]: { [file: string]: number } }): string {
        let tableHtml = `
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Date</th>
                        <th>Root Folder</th>
                        <th>Subfolder</th>
                        <th>File</th>
                        <th>Time Spent (minutes)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const [date, files] of Object.entries(timeData)) {
            for (const filePath of Object.keys(files)) {
                const time = files[filePath];
                const timeInMinutes = (time / 60).toFixed(2);

                const parsedPath = path.parse(filePath);
                const rootFolder = path.basename(path.dirname(parsedPath.dir));
                const subfolder = path.basename(parsedPath.dir);
                const fileName = parsedPath.base;

                tableHtml += `
                    <tr>
                        <td>${date}</td>
                        <td>${rootFolder}</td>
                        <td>${subfolder}</td>
                        <td>${fileName}</td>
                        <td>${timeInMinutes}</td>
                    </tr>
                `;
            }
        }

        tableHtml += '</tbody></table>';
        return tableHtml;
    }
}
