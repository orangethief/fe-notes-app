import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer} from 'recharts';

const Charts = ({moodAnalysis}) => {
 const data = Object.keys(moodAnalysis).map(key => ({
    subject: key,
    A: moodAnalysis[key],
    fullMark: 150,
  }));

  console.log(typeof moodAnalysis);
  console.log(data);


return (
<div>
  <ResponsiveContainer width="100%" height={340}>
    
    <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data} >
      <PolarGrid strokeWidth={1.5}/>
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontWeight: 'semi-bold', padding: '1'}} tickSize={10}/>
      <PolarRadiusAxis tick={{fill: '#74777b'}} />
      <Radar name="mood" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.7} strokeWidth={3}/>
    </RadarChart>
  </ResponsiveContainer>
</div>
);
}


export default Charts;
