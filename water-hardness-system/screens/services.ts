import * as AWS from 'aws-sdk';

const tdsData = [
    {
        timestamp: "06:08:00 PM",
        data: 226.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 110.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 115.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 160.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 300.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 350.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 336.11,
    },
];

const tempData = [
    {
        timestamp: "06:08:00 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 180.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 115.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 160.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 300.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 350.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 336.11,
    },
];

const turbidityData = [
    {
        timestamp: "06:08:00 PM",
        data: 90.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 50.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 110.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 90.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 98.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 95.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 95.11,
    },
];

const phData = [
    {
        timestamp: "06:08:00 PM",
        data: 20.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 40.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 40.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 30.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 35.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 60.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 63.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 58.11,
    },
];

/*
    Put all API calls here
*/
export const grabSensorData = (sensorType: string) => {
    if (sensorType === 'tds') {
        return tdsData;
    } else if (sensorType === 'temperature') {
        return tempData;
    } else if (sensorType === 'ph') {
        return phData;
    } else if (sensorType === 'turbidity') {
        return turbidityData;
    }
}

export const getAllSensors = () => {
    const requestOptions = {
        method: 'GET'
      };

    return fetch("http://localhost:3000/user/getAllSensors?email=pe295@sj.ed", requestOptions);
}

export const getSensorData = (id: Number) => {
    const requestOptions = {
        method: 'GET'
    };

    return fetch("http://localhost:3000/user/getSensorData?email=pe295@sj.ed&deviceId=" + id, requestOptions);
} 