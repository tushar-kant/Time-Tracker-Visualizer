import * as vscode from 'vscode';

export function getHtmlForWebview(webview: vscode.Webview, pieChartData: string, barChartData: string, tableData: string): string {
    const nonce = getNonce();

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Time Tracking Report</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .chart-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .pie-chart-container { width: 35%; }
                .bar-chart-container { width: 63%; }
                #table-container { max-height: 50vh; overflow-y: auto; margin-top: 20px; }
                table { width: 100%; }
            </style>
            <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script nonce="${nonce}">
                window.addEventListener('load', () => {
                    const pieData = ${pieChartData};
                    const barData = ${barChartData};

                    const ctxPie = document.getElementById('pie-chart').getContext('2d');
                    new Chart(ctxPie, {
                        type: 'pie',
                        data: pieData,
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + ' minutes';
                                        }
                                    }
                                }
                            }
                        }
                    });

                    const ctxBar = document.getElementById('bar-chart').getContext('2d');
                    new Chart(ctxBar, {
                        type: 'bar',
                        data: barData,
                        options: {
                            responsive: true,
                            scales: {
                                x: {
                                    beginAtZero: true
                                },
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
            </script>
        </head>
        <body>
            <h1>Time Tracking Report</h1>
            <div class="chart-container">
                <div class="pie-chart-container">
                    <h2>Time Spent per Root Folder</h2>
                    <canvas id="pie-chart"></canvas>
                </div>
                <div class="bar-chart-container">
                    <h2>Time Spent on Files</h2>
                    <canvas id="bar-chart"></canvas>
                </div>
            </div>
            <div id="table-container">${tableData}</div>
        </body>
        </html>
    `;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
