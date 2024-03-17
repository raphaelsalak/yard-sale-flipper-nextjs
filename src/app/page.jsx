"use client"
import Image from "next/image";
import { useState } from "react";
import "./assets/styles.css" 
import Html5QrcodePlugin from "./Html5QrcodePlugin"
export default function Home() { 
  const [inputValue, setInputValue] = useState('')
  const [offerValue, setOfferValue] = useState('')
  const [data, setData] = useState(null) 
  const [decodedText, setDecodedText] = useState('')
  const [profit, setProfit] = useState('')

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }    
  const handleOfferChange = (event) => {
    setOfferValue(event.target.value);
  }    

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    setInputValue(decodedText)
  };

  const handleButtonClick = () => {
    makeApiCall(inputValue)
    
  }
  const calculateProfit = () => {
    let difference = 0
    let formattedNumber = 0
    if(sortedData != null){
      difference = offerValue - sortedData[0].price.value
      formattedNumber = difference.toFixed(2);
    }
    setProfit(formattedNumber)

  }
 
  const makeApiCall = async (value) => {
    const response = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ search: value})
    })
    const fetchedData = await response.json()
    setData(fetchedData)
    calculateProfit()
  }

  const sortedData = data?.itemSummaries.sort((a, b) => {
    const priceA = parseFloat(a.price.value);
    const priceB = parseFloat(b.price.value);
    return priceB - priceA;
  });

  return (
  <>
    <div className="center-container">
      <input
        className="input-field"
        type="number"
        value={offerValue}
        onChange={handleOfferChange}
        placeholder="enter offer"> 
      </input>
      <div className="card-container">
        <input
          className="input-field"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="enter product name"> 
        </input>
        <button className="submit-button" onClick={handleButtonClick}>submit</button>
      </div>
      <Html5QrcodePlugin
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
      />
      <div className="card-container">      
        {sortedData?.map(item => (
          <div key={item.itemId} className="card">
            <img src={item.image.imageUrl} alt="Item" />
            <p>{item.price.value} {item.price.currency}</p>
          </div>
      ))}
      </div>
      <p>Profit: {profit}</p>
    </div>
  </>
   
  );
}
