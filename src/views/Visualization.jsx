import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useStudentContext } from '../store/StudentContext';

const Visualization = () => {
  const { students, fetchStudents } = useStudentContext();
  const classChartRef = useRef(null);
  const genderChartRef = useRef(null);
  const subjectChartRef = useRef(null);
  const scoreChartRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (students.length > 0) {
      initCharts();
    }

    // 清理函数
    return () => {
      if (classChartRef.current) {
        classChartRef.current.dispose();
      }
      if (genderChartRef.current) {
        genderChartRef.current.dispose();
      }
      if (subjectChartRef.current) {
        subjectChartRef.current.dispose();
      }
      if (scoreChartRef.current) {
        scoreChartRef.current.dispose();
      }
    };
  }, [students]);

  const initCharts = () => {
    initClassChart();
    initGenderChart();
    initSubjectChart();
    initScoreChart();
  };

  const initClassChart = () => {
    const classData = getClassData();
    const chart = echarts.init(classChartRef.current);
    const option = {
      title: {
        text: '班级学生数量'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: classData.classes
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: classData.counts,
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          }
        }
      ]
    };
    chart.setOption(option);
    classChartRef.current = chart;
    window.addEventListener('resize', () => chart.resize());
  };

  const initGenderChart = () => {
    const genderData = getGenderData();
    const chart = echarts.init(genderChartRef.current);
    const option = {
      title: {
        text: '性别比例',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '性别',
          type: 'pie',
          radius: '50%',
          data: [
            { value: genderData.male, name: '男' },
            { value: genderData.female, name: '女' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    chart.setOption(option);
    genderChartRef.current = chart;
    window.addEventListener('resize', () => chart.resize());
  };

  const initSubjectChart = () => {
    const subjectData = getSubjectData();
    const chart = echarts.init(subjectChartRef.current);
    const option = {
      title: {
        text: '学科成绩分布'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['平均分', '最高分', '最低分']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: subjectData.subjects
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '平均分',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.2)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: subjectData.average
        },
        {
          name: '最高分',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103, 194, 58, 0.5)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.2)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: subjectData.max
        },
        {
          name: '最低分',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245, 108, 108, 0.5)' },
              { offset: 1, color: 'rgba(245, 108, 108, 0.2)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: subjectData.min
        }
      ]
    };
    chart.setOption(option);
    subjectChartRef.current = chart;
    window.addEventListener('resize', () => chart.resize());
  };

  const initScoreChart = () => {
    const scoreData = getScoreData();
    const chart = echarts.init(scoreChartRef.current);
    const option = {
      title: {
        text: '成绩分数段统计'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: scoreData.intervals
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: scoreData.counts,
          type: 'bar',
          itemStyle: {
            color: '#E6A23C'
          }
        }
      ]
    };
    chart.setOption(option);
    scoreChartRef.current = chart;
    window.addEventListener('resize', () => chart.resize());
  };

  const getClassData = () => {
    const classMap = {};
    students.forEach(student => {
      classMap[student.class] = (classMap[student.class] || 0) + 1;
    });
    return {
      classes: Object.keys(classMap).sort(),
      counts: Object.values(classMap)
    };
  };

  const getGenderData = () => {
    const male = students.filter(student => student.gender === '男').length;
    const female = students.filter(student => student.gender === '女').length;
    return { male, female };
  };

  const getSubjectData = () => {
    const subjects = ['语文', '数学', '英语', '科学', '音乐', '美术', '体育'];
    const subjectMap = {};

    subjects.forEach(subject => {
      subjectMap[subject] = {
        sum: 0,
        count: 0,
        max: 0,
        min: 100
      };
    });

    students.forEach(student => {
      const subject = student.subject;
      const score = student.score;
      subjectMap[subject].sum += score;
      subjectMap[subject].count += 1;
      subjectMap[subject].max = Math.max(subjectMap[subject].max, score);
      subjectMap[subject].min = Math.min(subjectMap[subject].min, score);
    });

    return {
      subjects,
      average: subjects.map(subject => {
        const data = subjectMap[subject];
        return data.count > 0 ? Math.round(data.sum / data.count) : 0;
      }),
      max: subjects.map(subject => subjectMap[subject].max),
      min: subjects.map(subject => subjectMap[subject].min)
    };
  };

  const getScoreData = () => {
    const intervals = ['60以下', '60-70', '70-80', '80-90', '90-100'];
    const counts = [0, 0, 0, 0, 0];

    students.forEach(student => {
      const score = student.score;
      if (score < 60) counts[0]++;
      else if (score < 70) counts[1]++;
      else if (score < 80) counts[2]++;
      else if (score < 90) counts[3]++;
      else counts[4]++;
    });

    return { intervals, counts };
  };

  return (
    <div className="visualization">
      <div className="container">
        <h2>学生信息可视化</h2>
        <div className="chart-container">
          <div className="chart-item">
            <h3>班级学生数量统计</h3>
            <div id="classChart" ref={classChartRef} style={{ width: '100%', height: '400px' }}></div>
          </div>
          <div className="chart-item">
            <h3>性别比例</h3>
            <div id="genderChart" ref={genderChartRef} style={{ width: '100%', height: '400px' }}></div>
          </div>
          <div className="chart-item">
            <h3>学科成绩分布</h3>
            <div id="subjectChart" ref={subjectChartRef} style={{ width: '100%', height: '400px' }}></div>
          </div>
          <div className="chart-item">
            <h3>成绩分数段统计</h3>
            <div id="scoreChart" ref={scoreChartRef} style={{ width: '100%', height: '400px' }}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .visualization {
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
        }

        .chart-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }

        .chart-item {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }

        .chart-item h3 {
          margin-bottom: 20px;
          color: #333;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .chart-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Visualization;