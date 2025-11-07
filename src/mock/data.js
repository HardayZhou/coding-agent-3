const Mock = require('mockjs');

// 生成学生数据
const students = Mock.mock({
  'students|20-50': [
    {
      'id|+1': 1,
      'name': '@cname',
      'class': /(一年级|二年级|三年级|四年级|五年级|六年级)(1|2|3)班/,
      'age|6-12': 1,
      'gender|1': ['男', '女'],
      'subject|1': ['语文', '数学', '英语', '科学', '音乐', '美术', '体育'],
      'score|60-100': 1,
      'hobby|1-3': ['看书', '画画', '音乐', '运动', '编程', '游戏', '旅游']
    }
  ]
}).students;

module.exports = { students };