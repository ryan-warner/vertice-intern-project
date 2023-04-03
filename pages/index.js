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
  const [KPIForecastData, setKPIForecastData] = useState()
  
  // Member Data
  const [memberTenureData, setMemberTenureData] = useState()
  const [lifeStageData, setLifeStageData] = useState()
  const [originationChannelData, setOriginationChannelData] = useState()
  const [preferredChannelData, setPreferredChannelData] = useState()
  
  // General Engagement
  const [currentProductsData, setCurrentProductsData] = useState()
  const [currentProductsSortedData, setCurrentProductsSortedData] = useState()

  // Application State
  const [viewingKPIForecast, setViewingKPIForecast] = useState(false)
  const [customerViewMode, setCustomerViewMode] = useState("number")
  const [productsOrdering, setProductsOrdering] = useState("alphabetical")


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
    const numCustomers = fetchData.data.PropensityToMoveUp.YData.reduce((a, b) => a + b, 0)
    const probabilities = [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.0]
    const proportions = fetchData.data.PropensityToMoveUp.YData.map((item, index) => {
      return item / numCustomers * probabilities[index]
    })
    const tempDataProportions = []
    fetchData.data.Levels.YData.map((item, index) => {
      const name = fetchData.data.PropensityToMoveUp.XData[index]
      const tempIndex = index
      proportions.forEach((element, index )=> {
        return tempDataProportions.push({
          x: fetchData.data.Levels.YData[index],
          y: Math.round(element * item),
          series: fetchData.data.Levels.XData[tempIndex],
          name: fetchData.data.PropensityToMoveUp.XData[index]
      });
      })
    })
    setKPIForecastData(tempDataProportions)
  }

  function memberTenureDataHelper(fetchData) {
    const tempData = fetchData.data.MemberTenure.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.MemberTenure.YData[index],
        temp: "Customers"
      }})
    setMemberTenureData(tempData)
  }

  function lifeStageDataHelper(fetchData) {
    const tempData = fetchData.data.LifeStage.XData.map((item, index) => {
      return {
        x: item,
        y: fetchData.data.LifeStage.YData[index],
        temp: "Customers"
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
    const sortedValues = fetchData.data.CurrentProducts.YData.sort((a, b) => b - a)
    const sortedData = sortedValues.map((item) => {
      return {
        x: fetchData.data.CurrentProducts.XData[fetchData.data.CurrentProducts.YData.indexOf(item)],
        y: item
      }})
      console.log(sortedData)
    setCurrentProductsSortedData(sortedData)
  }

  return (
    <>
      <Head>
        <title>Vertice AI Dashboard</title>
        <meta name="description" content="Customer Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full min-h-screen">
        <Header 
          totalMembers = {verticeData !== undefined ? verticeData.data.Levels.YData.reduce((a, b) => a + b, 0) : 0}
          totalProducts = {verticeData !== undefined ? verticeData.data.CurrentProducts.YData.reduce((a, b) => a + b, 0) : 0}
        />
        <div className="flex flex-col gap-6 px-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="text-2xl font-semibold ">Key Perfomance Indicators</div>
              <Button type="primary" className="rounded-xl font-semibold" onClick={() => setViewingKPIForecast(!viewingKPIForecast)} >
                {
                  viewingKPIForecast ? "View Current KPI Data" : "Generate KPI Forecast"
                }
              </Button>
            </div>
            <div className="flex md:flex-row flex-col gap-6 w-100vh">
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Levels</div>
                {
                  levelsData !== undefined && !viewingKPIForecast ?
                  <Bar 
                    data={levelsData} 
                    xField="y" 
                    yField="x"
                    seriesField='x'
                    xAxis={{ title: { text: 'Customers (~)' } }}
                    yAxis={{ title: { text: 'Level' } }}
                  /> : levelsData !== undefined && viewingKPIForecast?
                  <Bar
                    data={KPIForecastData}
                    xField="y"
                    yField="series"
                    seriesField="name"
                    isStack={true}
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
                    xAxis={{ title: { text: 'Likelihood to Move Up' } }}
                    yAxis={{ title: { text: 'Number of Customers' } }}
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
                  customerViewMode === "number" ? "View Customer Proportions" : "View Customer Quantities"
                }
              </Button>
            </div>
            <div className="flex md:flex-row flex-col w-full gap-6">
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Life Stage</div>
                {
                  lifeStageData !== undefined && customerViewMode == "number" ?
                  <Column
                    data={lifeStageData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'Life Stage' } }}
                    yAxis={{ title: { text: 'Number of Customers' } }}
                    meta={{
                      x: {
                        alias: 'Life Stage',
                      },
                      y: {
                        alias: 'Number of Customers',
                      },
                    }}
                  /> : customerViewMode == "proportion" && lifeStageData!== undefined ?
                  <Bar
                    data={lifeStageData}
                    xField="y"
                    yField="temp"
                    seriesField="x"
                    isPercent={true}
                    isStack={true}
                    xAxis={{ title: { text: 'Proportion' } }}
                    meta={{
                      x: {
                        alias: 'Life Stage',
                      },
                      y: {
                        alias: 'Number of Customers',
                      },
                    }}
                    />
                  :null
                }
              </div>
              <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Customer Tenure</div>
                {
                  memberTenureData !== undefined && customerViewMode == "number" ?
                  <Column
                    data={memberTenureData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'Membership Time (years)' } }}
                    yAxis={{ title: { text: 'Number of Customers' } }}
                  /> : customerViewMode == "proportion" && lifeStageData!== undefined ?
                  <Bar
                    data={memberTenureData}
                    xField="y"
                    yField="temp"
                    seriesField="x"
                    isPercent={true}
                    isStack={true}
                    xAxis={{ title: { text: 'Proportion' } }}
                    meta={{
                      x: {
                        alias: 'Life Stage',
                      },
                      y: {
                        alias: 'Number of Customers',
                      },
                    }}
                    />
                  : null
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
                    xAxis={{ title: { text:  `${customerViewMode === "number" ? "Number" : "Proportion"} of Customers ` } }}
                    isPercent={customerViewMode === "proportion"}
                    isStack={true}
                  /> : null
                }
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="text-2xl font-semibold ">Products Overview</div>
              <Button type="primary" className="rounded-xl font-semibold" onClick={() => setProductsOrdering(productsOrdering === "alphabetical" ? "magnitude" : "alphabetical")}>
                {
                  productsOrdering === "alphabetical" ? "Sort by Magnitude" : "Sort Alphabetically"
                }
              </Button>
            </div>
            <div className="flex flex-col w-full gap-2 bg-gray-100 shadow-md rounded-lg p-2">
                <div className="text-xl font-semibold">Stuff</div>
                {
                  currentProductsData !== undefined ?
                  <Column
                    data={productsOrdering === "alphabetical" ? currentProductsData : currentProductsSortedData}
                    xField="x"
                    yField="y"
                    xAxis={{ title: { text: 'Product' } }}
                    yAxis={{ title: { text: 'Product Count' } }}
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
            <p className="text-center font-normal select-none">Powered by&#160;</p>
            <a className="text-center font-normal select-none decoration-transparent text-black opacity-[90%] hover:text-black hover:underline" target="_blank" href={"https://verticeanalytics.ai/"}>Vertice AI</a>
          </div>
          <p className="text-center h-full font-normal select-none">Made with &#10084; in Atlanta, GA</p>
        </div>
      </main>
    </>
  )
}
