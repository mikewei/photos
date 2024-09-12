require 'json'
require 'fileutils'

# 设置目录路径
album_dir = File.join(Dir.pwd, 'album')
output_dir = File.join(Dir.pwd, 'assets', 'data')
output_file = File.join(output_dir, 'album.json')

# 确保输出目录存在
FileUtils.mkdir_p(output_dir)

# 初始化合并数据数组
merged_data = []

# 读取并合并所有JSON文件
Dir.glob(File.join(album_dir, '*.json')).each do |file|
  file_content = File.read(file)
  json_data = JSON.parse(file_content)
  merged_data << json_data
end

# 将合并后的数据写入输出文件
File.write(output_file, JSON.pretty_generate(merged_data))

puts "JSON文件已成功合并到 #{output_file}"