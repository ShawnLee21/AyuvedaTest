import re

# 输入文件和输出文件路径
input_file = "form.html"
output_file = "form_updated.html"

# 定义选项和 Dosha 的映射
dosha_mapping = {
    # 体型
    "苗条": "vata",
    "适中": "pitta",
    "巨大": "kapha",
    
    # 体重
    "过轻": "vata",
    "适中": "pitta",
    "过重": "kapha",
    
    # 皮肤
    "薄，干，冷，粗糙，色深": "vata",
    "平滑，多油，温暖，红润": "pitta",
    "厚，多油，凉，白，苍白": "kapha",
    
    # 毛发
    "枯黄，漆黑，纠结，脆，稀薄": "vata",
    "直，多油，金黄，灰，红，秃": "pitta",
    "厚，卷曲，多油，波浪状，浓密，各种颜色均有": "kapha",
    
    # 牙齿
    "突出，大，宽，牙龈薄": "vata",
    "适中，软，牙龈柔嫩": "pitta",
    "健康，白，牙龈强健": "kapha",
    
    # 鼻子
    "形状凹凸不平，鼻中隔偏曲": "vata",
    "长而尖，鼻头红": "pitta",
    "短而圆，鼻塌": "kapha",
    
    # 眼睛
    "小，深陷，干涩，灵活，黑，棕，神经质": "vata",
    "锐利，明亮，灰，绿，黄/红，对光敏感": "pitta",
    "大，美，蓝，冷静，慈爱": "kapha",
    
    # 指甲
    "干燥，粗糙，脆，易开衩断裂": "vata",
    "尖锐，有弹性，粉红，有光泽": "pitta",
    "厚，多油，平滑，光亮": "kapha",
    
    # 嘴唇
    "干燥，有裂纹，略带黑/棕色": "vata",
    "红，红肿，带黄色": "pitta",
    "平滑，多油，苍白，带白色": "kapha",
    
    # 下巴
    "薄，有棱角": "vata",
    "尖细": "pitta",
    "圆，双下巴": "kapha",
    
    # 脸颊
    "有皱纹，凹陷": "vata",
    "平滑，平坦": "pitta",
    "圆，丰满": "kapha",
    
    # 脖子
    "细，长": "vata",
    "适中": "pitta",
    "粗大，有皱纹": "kapha",
    
    # 胸部
    "平坦，凹陷": "vata",
    "适中": "pitta",
    "宽阔，圆": "kapha",
    
    # 腹部
    "薄，平坦，凹陷": "vata",
    "适中": "pitta",
    "巨大，大腹便便": "kapha",
    
    # 肚脐
    "小，不规则，突出": "vata",
    "椭圆，浅": "pitta",
    "大，深，圆，撑开": "kapha",
    
    # 臀部
    "修长，瘦薄": "vata",
    "适中": "pitta",
    "沉重，大": "kapha",
    
    # 关节
    "冷，噼啪作响": "vata",
    "适中": "pitta",
    "宽大，圆润": "kapha",
    
    # 食欲
    "时好时坏，量少": "vata",
    "消化旺盛，食量大": "pitta",
    "吃得慢，但食量稳定": "kapha",
    
    # 消化
    "时好时坏，易胀气": "vata",
    "快，造成灼热": "pitta",
    "时间长，形成粘液": "kapha",
    
    # 味道的偏好
    "甜，酸，咸": "vata",
    "甜，苦，涩": "pitta",
    "苦，辛辣，涩": "kapha",
    
    # 口渴状态
    "时而这样，时而那样": "vata",
    "经常口渴": "pitta",
    "很少口渴": "kapha",
    
    # 排便
    "容易便秘": "vata",
    "形状松散": "pitta",
    "粗厚，多油，排便迟缓": "kapha",
    
    # 生理活动
    "过动": "vata",
    "适中": "pitta",
    "久坐不动": "kapha",
    
    # 心智活动
    "总是积极主动": "vata",
    "适中": "pitta",
    "迟钝，缓慢": "kapha",
    
    # 情绪
    "焦虑，恐惧，不确定，灵活": "vata",
    "愤怒，仇恨，猜忌，决断": "pitta",
    "冷静，贪婪，依恋": "kapha",
    
    # 价值观
    "可变，多变": "vata",
    "热切，极端": "pitta",
    "一致，深入，老练成熟": "kapha",
    
    # 对于问题
    "回应迅速，不求完美": "vata",
    "回应精确": "pitta",
    "缓慢且确实": "kapha",
    
    # 记忆力
    "短期记忆好，长期记忆差": "vata",
    "明白清楚": "pitta",
    "记忆缓慢但持久": "kapha",
    
    # 梦境
    "快速的，积极的，大量的，恐惧的": "vata",
    "火爆的，战争，暴力": "pitta",
    "湖泊，雪，浪漫的": "kapha",
    
    # 睡眠
    "不足，断断续续，失眠": "vata",
    "少但睡得好": "pitta",
    "深沉，时间长": "kapha",
    
    # 说话
    "快速，但语义不清": "vata",
    "精准，一针见血": "pitta",
    "缓慢，声音单调": "kapha",
    
    # 财务
    "钱花在琐碎的东西上": "vata",
    "钱花在奢侈品上": "pitta",
    "善于存钱": "kapha"
}


# 读取 HTML 文件
with open(input_file, "r", encoding="utf-8") as file:
    html_content = file.read()

# 正则匹配和替换函数
def add_dosha_attribute(match):
    input_tag = match.group(0)
    value_match = re.search(r'value="([^"]+)"', input_tag)
    if value_match:
        value_text = value_match.group(1)
        dosha = dosha_mapping.get(value_text, "")
        if dosha:
            # 添加 data-dosha 属性
            return input_tag.replace(">", f' data-dosha="{dosha}">')
    return input_tag

# 更新 HTML 内容
updated_html = re.sub(r'<input[^>]+>', add_dosha_attribute, html_content)

# 写入更新后的文件
with open(output_file, "w", encoding="utf-8") as file:
    file.write(updated_html)

print(f"HTML 更新完成，生成的文件为: {output_file}")
