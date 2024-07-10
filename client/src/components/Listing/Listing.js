import React, {useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import './Listing.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import config from '../../config';

import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

const API_BASE_URL = config.apiUrl;

const Listing = () => {
  const [items, setItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State để theo dõi ảnh đang được phóng to
  const [productTypes, setproductTypes] = useState([]);
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState("idle");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State để lưu thông báo lỗi


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const fetchProductData = async(page, itemCount, volume) => {
    try {
        const response = await axios.get(`https://www.etsy.com/c/clothing/mens-clothing/shirts-and-tees?explicit=1&ship_to=US&category_landing_page=true&order=highest_reviews&page=${page}`, {
          // host: 's8.v2.proxyviet.net', port: 8854, auth: {
          //   username: 'kilz1996', password: 'kilz1996'
          // } 
        });

        const $ = cheerio.load(response.data);

        for(let i = 0; i < $('li.wt-list-unstyled').length; i++){

            const link = $($('li.wt-list-unstyled')[i]).find('a.listing-link').attr('href');

            // await sleep(500);

            

            const response2 = await axios.get(link.split('?')[0], {
              host: 's8.v2.proxyviet.net', port: 8854, auth: {
                username: 'kilz1996', password: 'kilz1996'
              } 
          });

            const $$ = cheerio.load(response2.data);

              console.log($$('p.wt-text-title-01.wt-text-brick').text().trim())
              console.log($$('h1.wt-line-height-tight.wt-break-word.wt-text-body-01').text().trim())
            if(!$$('h1.wt-line-height-tight.wt-break-word.wt-text-body-01').text().trim().toLowerCase().includes("custom") && ($$('p.wt-text-title-01.wt-text-brick').text().trim().toLowerCase().includes("in demand") || $$('p.wt-text-title-01.wt-text-brick').text().trim().toLowerCase().includes("20+ views in the last 24 hours"))){
                let image = [];
                $$('img.wt-max-width-full.wt-horizontal-center.wt-vertical-center.carousel-image.wt-rounded').each((index, element) => {
                    image.push(element.attribs.src.replace(/il_\d+x[a-zA-Z]\./, "il_350xN."));
                });
                setItems(prevItems => [...prevItems, [image, $$('h1').text().trim(), ""]]);
                itemCount++;
                console.log(itemCount);
                if(itemCount >= volume){
                    return true;
                }
            }
        }
        
        await fetchProductData(page + 1, itemCount, volume);
    } catch (error) {
      console.error("Lỗi", error.message);
        if(error.message.includes("403")){
            console.error("Không thể truy cập trang web:", error.message);
            console.log("Đổi IP");
            await sleep(10000);
            await fetchProductData(page, itemCount, volume);
        } else{
          console.error("Không thể truy cập trang web:", error);
          return "Lỗi Kết Nối";
        }
    }
  }

  useEffect(()=> {
    const fetchProductTypeSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/producttype-settings`, {
          headers: { 'x-auth-token': token }
        });
        setproductTypes(response.data);
      } catch (error) {
        console.error('Error fetching AI settings:', error);
      }
    };
    fetchProductTypeSettings();
  },[])

  const handleDelete = (itemIndex) => {
    const newItems = items.filter((_, index) => index !== itemIndex);
    setItems(newItems);
  };

  const handleDeleteImage = (itemIndex, imageIndex) => {
    const newItems = items.map((item, i) => {
      if (i === itemIndex) {
        const newImages = item[0].filter((_, imgIdx) => imgIdx !== imageIndex);
        return [newImages, item[1], item[2]];
      }
      return item;
    });
    setItems(newItems);
  };

  const handleProductTypeChange = (index, newType) => {
    const newItems = items.map((item, i) => i === index ? [item[0], item[1], newType] : item);
    setItems(newItems);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleChangeVolume = (e) => {
    setVolume(e.target.value);
  }

  const handleStart = async (e) => {
    setIsButtonDisabled(true);
    if(volume){
      if(await fetchProductData(1, items.length, volume)){
        setStatus("done");
        setIsButtonDisabled(false);
      }
    }
  }

  useEffect(()=>{
    
    // console.log("items");
    // console.log(items);
  },[items])

  const handleExport = () => {

    const allTypesSelected = items.every(item => item[2]);
    if (!allTypesSelected) {
      setErrorMessage("Vui lòng chọn loại sản phẩm cho tất cả các mục trước khi xuất dữ liệu.");
      return;
    }

    setErrorMessage(""); // Reset thông báo lỗi nếu tất cả các loại đã được chọn

    document.getElementById('fileInput').click();
  }
  
  const handleFileChange = (event) => {

    const file = event.target.files[0];
    if (!file) {
      return;
    }
    

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      // Đọc tiêu đề từ dòng thứ 3
      const headersRow = worksheet.getRow(3);
      const headers = headersRow.values;


      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); 
      const year = String(today.getFullYear()).slice(-2); 
      const daymonthyear = day + month + year;
      let index = 1;
      
      console.log("headers")
      console.log(headers)

      // Bắt đầu thêm dữ liệu từ dòng thứ 7
      let rowNum = 7;

      items.forEach((item) => {
        const productType = item[2];
        const productDetails = productTypes.find(type => type._id === productType);
        console.log(productDetails)

        if (productDetails) {
          const images = item[0];
          const productName = item[1];

          const colorTypePriceList = productDetails.colorTypeVariantimagePrice.split('\n');

          colorTypePriceList.forEach(entry => {
            const [color, type, variantimage, price] = entry.split("|");
            const rowData = 

            {
              "Aerosol Liquid Volume in ml": productDetails.aerosolLiquidVolumeinml,
              "Aerosols": productDetails.aerosols,
              "Age Group": productDetails.ageGroup,
              "BPA Free": productDetails.bPAFree,
              "Battery": productDetails.battery,
              "Battery or Cell Capacity in Wh": productDetails.batteryorCellCapacityinWh,
              "Battery or Cell Capacity in grams": productDetails.batteryorCellCapacityingrams,
              "Battery or Cell Weight in grams": productDetails.batteryorCellWeightingrams,
              "Battery type": productDetails.batteryType,
              "Brand": productDetails.brand,
              "CA Prop 65: Carcinogens": productDetails.cAProp65Carcinogens,
              "CA Prop 65: Repro. Chems": productDetails.cAProp65ReproChems,
              "Carcinogen": productDetails.carcinogen,
              "Care Instructions": productDetails.careInstructions,
              "Category": productDetails.category,
              "Clothing Length": productDetails.clothingLength,
              "Contains Batteries or Cells?": productDetails.containsBatteriesorCells,
              "Delivery options": productDetails.deliveryOptions,
              "Feature": productDetails.feature,
              "Fit": productDetails.fit,
              "Flammable Liquid": productDetails.flammableLiquid,
              "Flammable Liquid Volume in ml": productDetails.flammableLiquidVolumeinml,
              "How Batteries Are Packed": productDetails.howBatteriesArePacked,
              "Identifier Code": productDetails.identifierCode,
              "Identifier Code Type": productDetails.identifierCodeType,
              "Installment": productDetails.installment,
              "Magnets": productDetails.magnets,
              "Manufacturing Technique": productDetails.manufacturingTechnique,
              "Material": productDetails.material,
              "Neckline": productDetails.neckline,
              "Number of Batteries or cells": productDetails.numberofBatteriesorcells,
              "Occasion": productDetails.occasion,
              "Other Dangerous Goods or Hazardous Materials": productDetails.otherDangerousGoodsorHazardousMaterials,
              "Package Height(inch)": productDetails.packageHeight,
              "Package Length(inch)": productDetails.packageLength,
              "Package Weight(lb)": productDetails.packageWeight,
              "Package Width(inch)": productDetails.packageWidth,
              "Pattern": productDetails.pattern,
              "Product Description": productDetails.productDescription,
              "Main Product Image": images[0].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 2": images[1].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 3": images[2].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 4": images[3].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 5": images[4].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 6": images[5].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 7": images[6].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 8": images[7].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Image 9": images[8].replace(/il_\d+x[a-zA-Z]\./, "il_fullxfull.") || "",
              "Product Name": productName,
              "Product Status": "Draft(2)", // Draft(2) Active(1)
              "Quantity in U.S Pickup Warehouse": productDetails.quantityinALEASEWILLIS ? productDetails.quantityinALEASEWILLIS : productDetails.quantityinCORNELLHODGES,
              "Quantity in ALEASE WILLIS": productDetails.quantityinALEASEWILLIS,
              "Quantity in CORNELL HODGES": productDetails.quantityinCORNELLHODGES,
              "Reprotoxic Chemicals": productDetails.reprotoxicChemicals,
              "Retail Price (Local Currency)": price,
              "Safety Data Sheet (SDS) for aerosol products": productDetails.safetyDataSheetforaerosolproducts,
              "Safety Data Sheet (SDS) for flammable materials": productDetails.safetyDataSheetforflammablematerials,
              "Safety Data Sheet (SDS) for other dangerous goods or hazardous materials": productDetails.safetyDataSheetforotherdangerousgoodsorhazardousmaterials,
              "Safety Data Sheet (SDS) for products with batteries": productDetails.safetyDataSheetforproductswithbatteries,
              "Scent": productDetails.scent,
              "Season": productDetails.season,
              "Seller SKU": "HONG-TIKTOK-" + daymonthyear + "-" + index,
              "Setting": productDetails.setting,
              "Shape": productDetails.shape,
              "Size Chart": productDetails.sizeChart,
              "Sleeve Length": productDetails.sleeveLength,
              "Stretch": productDetails.stretch,
              "Style": productDetails.style,
              "Use": productDetails.use,
              "Variant Image": variantimage,
              "Variation 1": color,
              "Variation 2": type,
              "Volume": productDetails.volume,
              "Waist Height": productDetails.waistHeight
          }


            // {
            //   "Category": productDetails.category,
            //   "Brand": productDetails.brand,
            //   "Product Name": productName,
            //   "Product Description": productDetails.description,
            //   "Package Weight(lb)": productDetails.packageWeight,
            //   "Package Length(inch)": productDetails.packageLength,
            //   "Package Width(inch)": productDetails.packageWidth,
            //   "Package Height(inch)": productDetails.packageHeight,
            //   "Delivery options": productDetails.deliveryOptions,
            //   "Identifier Code Type": productDetails.identifierCodeType,
            //   "Identifier Code": productDetails.identifierCode,
            //   "Variation 1": color,
            //   "Variation 2": type,
            //   "Variant Image": variantimage,
            //   "Retail Price (Local Currency)": price,
            //   "Quantity in ALEASE WILLIS": productDetails.quantity,
            //   "Seller SKU": "Tool-TIKTOK-" + daymonthyear + "-" + index,
            //   "Main Product Image": images[0] || "",
            //   "Product Image 2": images[1] || "",
            //   "Product Image 3": images[2] || "",
            //   "Product Image 4": images[3] || "",
            //   "Product Image 5": images[4] || "",
            //   "Product Image 6": images[5] || "",
            //   "Product Image 7": images[6] || "",
            //   "Product Image 8": images[7] || "",
            //   "Product Image 9": images[8] || "",
            //   "Size Chart": productDetails.sizeChart,
            //   "Material": productDetails.material,
            //   "Pattern": productDetails.pattern,
            //   "Neckline": productDetails.neckline,
            //   "Clothing Length": productDetails.clothingLength,
            //   "Sleeve Length": productDetails.sleeveLength,
            //   "Season": productDetails.season,
            //   "Style": productDetails.style,
            //   "Fit": productDetails.fit,
            //   "Stretch": productDetails.stretch,
            //   "Care Instructions": productDetails.careInstructions,
            //   "Waist Height": productDetails.waistHeight,
            //   "Other Dangerous Goods or Hazardous Materials": "No",
            //   "CA Prop 65: Carcinogens": "No",
            //   "CA Prop 65: Repro. Chems": "No",
            //   "Product Status": "Active(1)"
            // };

            const newrowData = {};
            headers.forEach(key => {
                if (key && rowData.hasOwnProperty(key)) {
                  newrowData[key] = rowData[key];
                }
            });

            // Đảm bảo rằng giá trị đầu tiên của hàng mới là một mảng rỗng
            const rowValues = headers.map(header => newrowData[header] || "");
            const newRow = worksheet.getRow(rowNum);
            newRow.values = rowValues;

            // Áp dụng định dạng từ hàng tiêu đề
            // headersRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            //   newRow.getCell(colNumber).style = { ...cell.style };
            // });

            newRow.commit();
            rowNum++;
          });
          index++;
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'output.xlsx');
    };
    reader.readAsArrayBuffer(file);
  }
  
  return (
    <div className="listing-container">
      <div className='header'>
        <h2>Crawl Data</h2>
        {isButtonDisabled ? <h5>Đang Xử Lý</h5> : errorMessage ? <p className="error-message">{errorMessage}</p> : <h5>Thông Tin</h5>}
        {status === "idle" ? (
        <Form>
          <Form.Group controlId="volume">
            <Form.Label>Số Lượng Cần:</Form.Label>
            <Form.Control
              disabled={isButtonDisabled}
              type="text"
              name="volume"
              onChange={handleChangeVolume}
              required
            />      
          </Form.Group>
          <Form.Group>
            {<Button className='export-button' variant="primary" disabled={isButtonDisabled} onClick={handleStart}>Bắt Đầu</Button>} 
          </Form.Group>
        </Form>
        ) : (
            <Button className='export-button' variant="primary" onClick={handleExport}>Xuất Dữ Liệu</Button>
        )}
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
      </div>
      
      <table className="listing-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tiêu Đề</th>
            <th>Chọn Loại Sản Phẩm</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, itemIndex) => (
              <tr key={itemIndex}>
                <td>{itemIndex + 1}</td>
                <td>
                  {item[0].map((image, imgIndex) => (
                    <div
                      className="image-wrapper"
                      key={imgIndex}
                      onMouseEnter={() => handleMouseEnter(`${itemIndex}-${imgIndex}`)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={image}
                        alt={`Image ${imgIndex + 1}`}
                        className={hoveredIndex === `${itemIndex}-${imgIndex}` ? "zoomed" : ""}
                      />
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteImage(itemIndex, imgIndex)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </td>
                <td>{item[1]}</td>
                <td>
                  <Form.Select
                    value={item[2]}
                    onChange={(e) => handleProductTypeChange(itemIndex, e.target.value)}
                  >
                    <option value="">Chọn Loại Sản Phẩm</option>
                    {productTypes.map((type) => (
                      <option key={type._id} value={type._id}>{type.productType}</option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(itemIndex)}>Xóa</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Listing;
