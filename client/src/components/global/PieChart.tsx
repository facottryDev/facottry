'use client'
import React from 'react'
import 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2';

type Props = {
    data: {
        title: string,
        value: string,
        distribution: {
            name: string,
            value: number
        }[]
    }
}

export const PieChart = ({ data }: Props) => {
    const labels = data.distribution.map(item => item.name);
    const values = data.distribution.map(item => item.value);

    return (
        <div className="flex flex-col p-8 bg-white rounded-lg shadow-md dark:bg-darkblue text-md font-medium max-w-[360px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3>{data.title}</h3>
                    <p className="text-3xl font-bold mt-1">{data.value}</p>
                </div>

                <div className="text-sm text-primary space-y-2">
                    {data.distribution.map((item, index) => (
                        <div key={index} className="flex">
                            <p>{item.name} - {item.value}%</p>
                        </div>
                    ))}
                </div>
            </div>

            <Doughnut data={{
                labels: labels,
                datasets: [{
                    label: 'Pie Chart',
                    data: values,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)',
                    ],
                    hoverOffset: 4,
                    borderColor: 'transparent'
                }]
            }}
                className="w-96"
                options={{
                    plugins: {
                        legend: {
                            position: 'bottom',
                            display: false
                        }
                    }
                }}
            />
        </div>
    )
}
