# Dev Time Visualizer

Dev Time Visualizer is a Visual Studio Code extension that helps you track and understand how much time you spend coding. With this extension, you can generate reports and view interactive charts that break down your coding time by files, folders, and days of the week.

## Features

- **Time Tracking:** Automatically tracks the time you spend on each file.
- **Folder Analysis:** See how much time you spend in different parts of your project.
- **Interactive Charts:** View your time data in easy-to-read pie and bar charts.
- **Weekly Overview:** Get a chart that shows your coding time for each day over the past week.
- **Detailed Reports:** Generate reports with a breakdown of your time by date, file, and project.
- **Export Data:** Save your reports as CSV files for further analysis or sharing.

## How to Use

### 1. Install the Extension

1. Open Visual Studio Code.
2. Click on the Extensions icon in the Activity Bar on the side of the window (or press `Ctrl+Shift+X`).
3. Search for "Dev Time Visualizer" and click the **Install** button.

### 2. Enable Time Tracking

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
2. Type `Dev Time Visualizer: Enable` and select it. This will start tracking the time you spend on your files.

### 3. Generate a Report

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette again.
2. Type `Dev Time Visualizer: Generate Report` and select it. This will create a report and open it in a new tab.

### 4. View Your Report

- The report will display:
  - **Pie Chart:** Shows time spent on different root folders of your project.
  - **Bar Chart:** Shows time spent on individual files.
  - **Weekly Chart:** Displays your coding time for each day over the last 7 days.
  - **Detailed Table:** Lists your coding time by date, root folder, subfolder, and file.

![Report Example](https://github.com/tushar-kant/Time-Tracker-Visualizer/blob/main/image1.jpeg)
![Chart Example](https://github.com/tushar-kant/Time-Tracker-Visualizer/blob/main/image2.jpeg)
![Chart Example1](https://github.com/tushar-kant/Time-Tracker-Visualizer/blob/main/image3.jpeg)

### 5. Export Your Report

- In the report view, you can click on the **Export** button to save your data as a CSV file. This allows you to share or analyze the data outside of Visual Studio Code.

## Extension Settings

You can configure the following settings:

- `devTimeVisualizer.enable`: Turn time tracking on or off.
- `devTimeVisualizer.report`: Generate a time tracking report.

To change these settings, go to **File > Preferences > Settings** (`Ctrl+,` or `Cmd+,` on macOS) and search for "Dev Time Visualizer."

## Known Issues

- If the extension is disabled or uninstalled, time tracking will not work.
- The pie chart may overlap with other content on smaller screens.

## Release Notes

### Version 1.0.0

- Initial release with basic time tracking and reporting features.

### Version 1.0.1

- Fixed display issues with charts on smaller screens.

### Version 1.1.0

- Added the ability to export reports as CSV files.

## Additional Information

For more details on how to use Visual Studio Code extensions, you can check out:

- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)
- [Markdown Syntax Guide](https://help.github.com/articles/markdown-basics/)




Enjoy using Dev Time Visualizer to better understand your coding habits and improve your productivity!
