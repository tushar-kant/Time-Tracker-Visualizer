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

        const { pieChartData, barChartData, dateWiseData } = this.prepareChartData(timeData);
        const tableData = this.prepareTableData(timeData);

        panel.webview.html = getHtmlForWebview(panel.webview, pieChartData, barChartData, dateWiseData, tableData);
    }

    private prepareChartData(timeData: { [date: string]: { [file: string]: number } }): { pieChartData: string, barChartData: string, dateWiseData: string } {
        const rootFolderTime: { [rootFolder: string]: number } = {};
        const subfolderTime: { [subfolder: string]: number } = {};
        const fileTime: { [file: string]: number } = {};
        const dateWiseTime: { [date: string]: number } = {};
        
        // Populate time spent on each root folder, subfolder, file, and by date
        for (const [date, files] of Object.entries(timeData)) {
            let dailyTimeInMinutes = 0;
            for (const [filePath, time] of Object.entries(files)) {
                const timeInMinutes = time / 60;
                const parsedPath = path.parse(filePath);
                const rootFolder = path.basename(path.dirname(parsedPath.dir));
                const subfolder = path.basename(parsedPath.dir);
        
                if (!rootFolderTime[rootFolder]) {
                    rootFolderTime[rootFolder] = 0;
                }
                rootFolderTime[rootFolder] += timeInMinutes;
        
                if (!subfolderTime[subfolder]) {
                    subfolderTime[subfolder] = 0;
                }
                subfolderTime[subfolder] += timeInMinutes;
        
                if (!fileTime[filePath]) {
                    fileTime[filePath] = 0;
                }
                fileTime[filePath] += timeInMinutes;
        
                dailyTimeInMinutes += timeInMinutes;
            }
            dateWiseTime[date] = dailyTimeInMinutes;
        }
        
        const pieChartData = JSON.stringify({
            labels: Object.keys(subfolderTime),
            datasets: [{
                label: 'Time Spent per Root Folder (Minutes)',
                data: Object.values(subfolderTime),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',  // Updated color
                    'rgba(54, 162, 235, 0.5)',  // Updated color
                    'rgba(255, 206, 86, 0.5)',  // Updated color
                    'rgba(75, 192, 192, 0.5)',  // Updated color
                    'rgba(153, 102, 255, 0.5)',  // Updated color
                    'rgba(255, 159, 64, 0.5)'   // Updated color
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // Updated color
                    'rgba(54, 162, 235, 1)',    // Updated color
                    'rgba(255, 206, 86, 1)',    // Updated color
                    'rgba(75, 192, 192, 1)',    // Updated color
                    'rgba(153, 102, 255, 1)',   // Updated color
                    'rgba(255, 159, 64, 1)'     // Updated color
                ],
                borderWidth: 1
            }]
        });
        
        const barChartData = JSON.stringify({
            labels: Object.keys(fileTime),
            datasets: [{
                label: 'Time Spent on Files (Minutes)',
                data: Object.values(fileTime),
                backgroundColor: 'rgba(255, 159, 64, 0.5)',  // Updated color
                borderColor: 'rgba(255, 159, 64, 1)',       // Updated color
                borderWidth: 1
            }]
        });
    
        const dateWiseData = JSON.stringify({
            labels: Object.keys(dateWiseTime),
            datasets: [{
                label: 'Time Spent per Date (Minutes)',
                data: Object.values(dateWiseTime),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',  // Updated color
            borderColor: 'rgba(153, 102, 255, 1)',       // Updated color
                borderWidth: 1
            }]
        });

        return { pieChartData, barChartData, dateWiseData };
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
                        <th>Time Spent (Minutes)</th>
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
