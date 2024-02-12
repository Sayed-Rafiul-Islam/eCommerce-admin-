"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface OverviewProps {
    data : any[]
}

const Overview : React.FC<OverviewProps> = ({
    data
}) => {
    return ( 
        <div className='w-full flex-wrap overflow-x-scroll lg:overflow-auto md:overflow-auto'>
            <ResponsiveContainer width="120%" height={300} >
            <BarChart data={data}>
                <XAxis
                    dataKey='name'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey='total' fill='#3498db' radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
     );
}
 
export default Overview;