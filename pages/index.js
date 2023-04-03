import Head from 'next/head'
import Header from '../components/header'
import { Column, Bar } from '@ant-design/plots'
import { Button } from 'antd'
import { useState, useEffect } from 'react'

export default function Home() {
  const [verticeData, setVerticeData] = useState()
  
  // KPIs
  const [levelsData, setLevelsData] = useState()
  const [propensityToMoveUpData, setPropensityToMoveUpData] = useState()
  
  // Member Data
  const [memberTenureData, setMemberTenureData] = useState()
  const [lifeStageData, setLifeStageData] = useState()
  const [originationChannelData, setOriginationChannelData] = useState()
  const [preferredChannelData, setPreferredChannelData] = useState()
  
  // General Engagement
  const [currentProductsData, setCurrentProductsData] = useState()

  // Application State
  const [viewingKPIForecast, setViewingKPIForecast] = useState(false)
  const [customerViewMode, setCustomerViewMode] = useState("number")


  useEffect(() => {
    async function getData() {
      const result = await fetch('https://1gxx8u3k6c.execute-api.us-east-1.amazonaws.com/default/getVerticeData',
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Headers",
        },
      })
      const data = await result.json()
      // Eliminate in favor of smaller discrete state variables and limits
      setVerticeData(data)

      // Set 
      levelsDataHelper(data)
      propensityDataHelper(data)
      memberTenureDataHelper(data)
      lifeStageDataHelper(data)
      originationChannelDataHelper(data)
      preferredChannelDataHelper(data)
      currentProductsDataHelper(data)
    }
    getData()
  }, [])

  function levelsDataHelper(fetchData) {
    const tempData = fetchData.data.Levels.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.Levels.YData[index]
      }})
    setLevelsData(tempData)
  }

  function propensityDataHelper(fetchData) {
    const tempData = fetchData.data.PropensityToMoveUp.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.PropensityToMoveUp.YData[index]
      }})
    setPropensityToMoveUpData(tempData)
  }

  function memberTenureDataHelper(fetchData) {
    const tempData = fetchData.data.MemberTenure.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.MemberTenure.YData[index]
      }})
    setMemberTenureData(tempData)
  }

  function lifeStageDataHelper(fetchData) {
    const tempData = fetchData.data.LifeStage.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.LifeStage.YData[index]
      }})
    setLifeStageData(tempData)
  }

  function originationChannelDataHelper(fetchData) {
    const tempData = fetchData.data.OriginationChannel.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.OriginationChannel.YData[index],
        channelType: "Origin"
      }})
    setOriginationChannelData(tempData)
  }

  function preferredChannelDataHelper(fetchData) {
    const tempData = fetchData.data.PreferredChannel.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.PreferredChannel.YData[index],
        channelType: "Preferred"
      }})
    setPreferredChannelData(tempData)
  }

  function currentProductsDataHelper(fetchData) {
    const tempData = fetchData.data.CurrentProducts.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.CurrentProducts.YData[index]
      }})
    setCurrentProductsData(tempData)
  }
  
  return (
    <>
      <Head>
        <title>Vertice AI Dashboard</title>
        <meta name="description" content="Customer Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full min-h-screen p-4">
        <Header />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="text-2xl font-semibold ">Key Perfomance Indicators</div>
              <Button type="primary" className="rounded-xl font-semibold" onClick={() => setViewingKPIForecast(!viewingKPIForecast)} >
                {
                  viewingKPIForecast ? "View Current KPI Data" : "Generate KPI Forecast"
                }
              </Button>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Levels</div>
                {
                  levelsData !== undefined ?
                  <Bar 
                    data={levelsData} 
                    xField="y" 
                    yField="x"
                    seriesField='x'
                    xAxis={{ title: { text: 'Customers (~)' } }}
                    yAxis={{ title: { text: 'Level' } }}
                  /> : null
                }
              </div>
              
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Propensity To Move Up</div>
                {
                  propensityToMoveUpData !== undefined ?
                  <Column
                    data={propensityToMoveUpData} 
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'X' } }}
                    yAxis={{ title: { text: 'Y' } }}
                  /> : null
                }
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="text-2xl font-semibold ">Customer Metrics</div>
              <Button type="primary" className="rounded-xl font-semibold" onClick={() => setCustomerViewMode(customerViewMode === "number" ? "proportion" : "number")}>
                {
                  customerViewMode === "number" ? "View Proportion of Customers" : "View Number of Customers"
                }
              </Button>
            </div>
            <div className="flex w-full gap-6">
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Life Stage</div>
                {
                  lifeStageData !== undefined ?
                  <Column
                    data={lifeStageData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'X' } }}
                    yAxis={{ title: { text: 'Y' } }}
                    meta={{
                      x: {
                        alias: 'Life Stage',
                      },
                      y: {
                        alias: 'Number of Customers',
                      },
                    }}
                  /> : null
                }
              </div>
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Customer Tenure</div>
                {
                  memberTenureData !== undefined ?
                  <Column
                    data={memberTenureData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'X' } }}
                    yAxis={{ title: { text: 'Y' } }}
                  /> : null
                }
              </div>
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Customer Channel Statistics</div>
                {
                  preferredChannelData !== undefined && originationChannelData !== undefined? 
                  <Bar
                    data={[...originationChannelData, ...preferredChannelData]}
                    xField="y"
                    yField="channelType"
                    seriesField="x"
                    xAxis={{ title: { text: 'Proportion of Customers' } }}
                    isPercent={true}
                    isStack={true}
                  /> : null
                }
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold ">Products Overview</div>
            <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Stuff</div>
                {
                  currentProductsData !== undefined ?
                  <Column
                    data={currentProductsData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'X' } }}
                    yAxis={{ title: { text: 'Y' } }}
                    slider={{
                      start: 0,
                      end: 0.33,
                      textStyle: {
                        opacity: 0,
                      },
                      
                      backgroundStyle: {
                        fill: "#f3f4f6",
                        fillOpacity: 0,
                        opacity: 0,
                      }
                    }}
                  /> : null
                }
              </div>
          </div>
        </div>
        <div>
          {true ? null : JSON.stringify(verticeData)}
        </div>
        <div className="w-full flex flex-col justify-center h-auto py-4">
          <div className="flex justify-center h-8">
            <p className="text-center font-normal text-lg select-none">Powered by&#160;</p>
            <a className="text-center font-normal text-lg select-none decoration-transparent text-black opacity-[85%] hover:text-black hover:underline" target="_blank" href={"https://verticeanalytics.ai/"}>Vertice AI</a>
          </div>
          <p className="text-center h-full font-normal text-lg select-none">Made with &#10084; in Atlanta, GA</p>
        </div>
      </main>
    </>
  )
}
