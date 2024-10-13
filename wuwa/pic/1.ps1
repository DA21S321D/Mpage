# 获取当前脚本所在的文件夹路径
$folderPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

# 设置输出文件路径（保存在脚本所在的目录）
$outputFile = Join-Path $folderPath "images.js"

# 获取所有图片文件（在 Path 中添加通配符 *）
$images = Get-ChildItem -Path "$folderPath\*" -Include *.jpg,*.jpeg,*.png,*.gif -File

# 初始化结果数组
$results = @()

# 添加 JavaScript 文件的开头部分，定义并导出 images 数组
$results += "export const images = ["

# 遍历每个图片文件
foreach ($image in $images) {
    # 构建相对路径
    $relativePath = "pic/" + $image.Name

    # 添加到结果数组，不添加逗号（稍后处理）
    $results += "  '$relativePath',"
}

# 将最后一个元素的逗号去掉
if ($results.Count -gt 1) {
    $lastIndex = $results.Count - 1
    $results[$lastIndex] = $results[$lastIndex].TrimEnd(',')
}

# 添加 JavaScript 文件的结尾部分
$results += "];"

# 将结果写入 JavaScript 文件
$results | Out-File -FilePath $outputFile -Encoding UTF8

