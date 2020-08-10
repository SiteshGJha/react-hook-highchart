import React, {useReducer, useEffect} from 'react'
import axios from 'axios'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const initialState = {
    loading: true,
    error: '',
    records: [],
    options: {
        rangeSelector: {
            selected: 1
        },
        yAxis: [
            {
                labels: {
                    align: "right",
                    x: -3
                },
                title: {
                    text: "OHLC"
                },
                height: "100%",
                lineWidth: 1,
                resize: {
                enabled: true
                }
            }
        ],
        tooltip: {
            split: true
        },
        series: [
            {
                type: "ohlc",
                data: [],
                dataGrouping: {
                    units: [
                        ['week', [1, 2, 3]],
                        ['month', [1, 3, 6]]
                    ]
                }
            }
        ]
        
    }
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loadding: false,
                records: action.payload.map(data => data.split(',')),
                error: ''
            }
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                records: [],
                error: 'Something went wrong!'
            }
        case 'SET_DATA':
            return {
                ...state,
                options: {
                    ...state.options,
                    series: [
                        {
                            ...state.options.series[0],
                            data: action.payload
                        }
                    ]
                }
            }
        default:
            return state
    }
}

const HomeComponent = () => {

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(()=> {
        if (state.records.length) {
            let itemList = [];
            for (let i = 0; i < state.records.length; i += 1) {
                let item = state.records[i];

                itemList.push([
                    parseInt(item[0]), 
                    parseFloat(item[1]), 
                    parseFloat(item[2]), 
                    parseFloat(item[3]), 
                    parseFloat(item[4]) 
                ]);
            }

            dispatch({type: 'SET_DATA', payload: itemList})
        } else {
            axios.get('http://kaboom.rksv.net/api/historical')
            .then(response => {
               dispatch({
                   type: 'FETCH_SUCCESS',
                   payload: response.data
               })
            })
            .catch(error => {
                dispatch({
                    type: 'Fetch_ERROR'
                })
            })
        }
    }, [state.records])

    return (
        <div>
            <div>Home</div>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={state.options}
            />
        </div>
    )
}

export default HomeComponent;
