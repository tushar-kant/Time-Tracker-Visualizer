import * as vscode from 'vscode';

export function getHtmlForWebview(webview: vscode.Webview, pieChartData: string, barChartData: string, dateWiseData: string, tableData: string): string {
    const nonce = getNonce();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Time Tracking Report</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
            body {
                background-color: #f8f9fa; /* Light background by default */
                color: #212529; /* Dark text color by default */
                transition: background-color 0.3s, color 0.3s;
            }
            .container {
                padding: 20px;
            }
            .chart-container {
                width: 100%;
                height: 400px;
                margin-bottom: 20px;
                background-color: #e9ecef; /* Slightly lighter background for charts */
                border-radius: 8px;
                padding: 10px;
            }
            h1 {
                color: #212529;
            }
            .chart-header {
                margin-bottom: 10px;
                font-size: 1.2em;
                color: #495057; /* Slightly darker color for headers */
            }
            table {
                width: 100%;
                border-collapse: collapse;
                background-color: #e9ecef;
            }
            th, td {
                border: 1px solid #ced4da;
                padding: 8px;
                color: #212529;
            }
            th {
                background-color: #dee2e6;
            }

            /* Dark mode */
            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #343a40;
                    color: #f8f9fa;
                }
                .chart-container {
                    background-color: #495057;
                }
                h1 {
                    color: #f8f9fa;
                }
                .chart-header {
                    color: #e9ecef;
                }
                table {
                    background-color: #495057;
                }
                th, td {
                    border: 1px solid #6c757d;
                    color: #f8f9fa;
                }
                th {
                    background-color: #6c757d;
                }
            }
        </style>
    </head>
    <body>
        <div class="container mt-4">
            <div class="">
                ${tableData}
            </div>
            <h1 class="mb-4">Time Tracking Reports</h1>
            <div class="row">
                <div class="col-md-12 chart-container">
                    <div class="chart-header">Bar Chart</div>
                    <canvas id="barChart"></canvas>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 chart-container">
                    <div class="chart-header">Pie Chart</div>
                    <canvas id="pieChart"></canvas>
                </div>
                <div class="col-md-6 chart-container">
                    <div class="chart-header">Date Wise Chart</div>
                    <canvas id="dateWiseChart"></canvas>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            const pieChartData = ${pieChartData};
            const barChartData = ${barChartData};
            const dateWiseData = ${dateWiseData};

            const chartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                }
            };

            const ctxPie = document.getElementById('pieChart').getContext('2d');
            new Chart(ctxPie, {
                type: 'pie',
                data: pieChartData,
                options: chartOptions
            });

            const ctxBar = document.getElementById('barChart').getContext('2d');
            new Chart(ctxBar, {
                type: 'bar',
                data: barChartData,
                options: chartOptions
            });

            const ctxDateWise = document.getElementById('dateWiseChart').getContext('2d');
            new Chart(ctxDateWise, {
                type: 'line',
                data: dateWiseData,
                options: chartOptions
            });
        </script>
    </body>
    </html>
    `;
}

function getNonce() {
    const crypto = require('crypto');
    return crypto.randomBytes(16).toString('hex');
}
