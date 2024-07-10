import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import './Producttypeforlisting.css';
import config from '../../config';

const API_BASE_URL = config.apiUrl;

const Producttypeforlisting = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [productTypeSettings, setProductTypeSettings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(
    {
      productType: "",
      category: "",
      brand: "",
      productDescription: "",
      identifierCodeType: "",
      identifierCode: "",
      colorTypeVariantimagePrice: "",
      packageWeight: 0,
      packageLength: 0,
      packageWidth: 0,
      packageHeight: 0,
      deliveryOptions: "",
      quantityinALEASEWILLIS: 0,
      quantityinCORNELLHODGES: 0,
      sizeChart: "",
      material: "",
      pattern: "",
      neckline: "",
      clothingLength: "",
      sleeveLength: "",
      season: "",
      occasion: "",
      style: "",
      feature: "",
      shape: "",
      scent: "",
      setting: "",
      use: "",
      installment: "",
      fit: "",
      stretch: "",
      careInstructions: "",
      waistHeight: "",
      volume: "",
      magnets: "",
      manufacturingTechnique: "",
      ageGroup: "",
      battery: "",
      bPAFree: "",
      otherDangerousGoodsorHazardousMaterials: "",
      cAProp65Carcinogens: "",
      carcinogen: "",
      cAProp65ReproChems: "",
      reprotoxicChemicals: "",
      containsBatteriesorCells: "",
      batteryType: "",
      howBatteriesArePacked: "",
      numberofBatteriesorcells: "",
      batteryorCellCapacityinWh: "",
      batteryorCellCapacityingrams: "",
      batteryorCellWeightingrams: "",
      flammableLiquid: "",
      flammableLiquidVolumeinml: "",
      aerosols: "",
      aerosolLiquidVolumeinml: "",
      safetyDataSheetforflammablematerials: "",
      safetyDataSheetforproductswithbatteries: "",
      safetyDataSheetforaerosolproducts: "",
      safetyDataSheetforotherdangerousgoodsorhazardousmaterials: ""
    }
);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState("");

  const patterns = [
    "Plaid",
    "Tie Dye",
    "Plain",
    "Striped",
    "Polka Dot",
    "Graphic",
    "Embroidered",
    "Herringbone",
    "Moire",
    "Floral",
    "Paisley",
    "Slogan",
    "Figure",
    "Camouflage",
    "Plants",
    "Houndstooth",
    "Marble",
    "Ombre",
    "Colorblock",
    "Novelty Print",
    "Digital Print",
    "Cartoon",
    "Camo",
    "Chain Print",
    "Ditsy Floral",
    "Fire",
    "Galaxy",
    "Geometric",
    "Landscape Print",
    "Pop Art Print",
    "Rainbow Stripe",
    "Tribal",
    "Feather",
    "Letters",
    "Flag",
    "Waffle Knit",
    "Cable-knit"
];
  const necklines = [
    "Halter Neck",
    "Collared Neck",
    "V-Neck",
    "Off Shoulder",
    "Boat Neck",
    "One Shoulder",
    "Mock Neck",
    "Scoop Neck",
    "High Neck",
    "Sweetheart Neck",
    "Crew Neck",
    "Square Neck",
    "Tie Neck",
    "Cowl Neck",
    "Keyhole Neckline",
    "Asymmetrical Neck",
    "Notched",
    "U Neck",
    "Deep V Neck",
    "Bandeau",
    "Criss Cross Neck"
];

  useEffect(() => {
    fetchProductTypeSettings();
  }, []);

  const fetchProductTypeSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/producttype-settings`, {
        headers: { 'x-auth-token': token },
      });
      setProductTypeSettings(response.data);
    } catch (error) {
      console.error('Error fetching Product Type settings:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setErrorMessage('');
    setShowModal(false);
    resetFormData();
    setCategory("");
  };

  const resetFormData = () => {
    setFormData({
      productType: "",
      category: "",
      brand: "",
      productDescription: "",
      identifierCodeType: "",
      identifierCode: "",
      colorTypeVariantimagePrice: "",
      packageWeight: 0,
      packageLength: 0,
      packageWidth: 0,
      packageHeight: 0,
      deliveryOptions: "",
      quantityinALEASEWILLIS: 0,
      quantityinCORNELLHODGES: 0,
      sizeChart: "",
      material: "",
      pattern: "",
      neckline: "",
      clothingLength: "",
      sleeveLength: "",
      season: "",
      occasion: "",
      style: "",
      feature: "",
      shape: "",
      scent: "",
      setting: "",
      use: "",
      installment: "",
      fit: "",
      stretch: "",
      careInstructions: "",
      waistHeight: "",
      volume: "",
      magnets: "",
      manufacturingTechnique: "",
      ageGroup: "",
      battery: "",
      bPAFree: "",
      otherDangerousGoodsorHazardousMaterials: "",
      cAProp65Carcinogens: "",
      carcinogen: "",
      cAProp65ReproChems: "",
      reprotoxicChemicals: "",
      containsBatteriesorCells: "",
      batteryType: "",
      howBatteriesArePacked: "",
      numberofBatteriesorcells: "",
      batteryorCellCapacityinWh: "",
      batteryorCellCapacityingrams: "",
      batteryorCellWeightingrams: "",
      flammableLiquid: "",
      flammableLiquidVolumeinml: "",
      aerosols: "",
      aerosolLiquidVolumeinml: "",
      safetyDataSheetforflammablematerials: "",
      safetyDataSheetforproductswithbatteries: "",
      safetyDataSheetforaerosolproducts: "",
      safetyDataSheetforotherdangerousgoodsorhazardousmaterials: ""
    });
    setEditing(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    if(e.target.name === "category"){
      setCategory(e.target.value);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      if (editing) {
        await axios.put(`${API_BASE_URL}/api/producttype-settings/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/producttype-settings`, formData, config);
      }

      fetchProductTypeSettings();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving Product Type setting:', error);
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        setErrorMessage('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.');
      } else if (status === 403) {
        setErrorMessage('Bạn không được phép thực hiện thao tác này.');
      } else if (status === 400) {
        setErrorMessage('Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setErrorMessage('Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.');
      }
    } else {
      setErrorMessage('Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.');
    }
  };

  const handleEdit = (setting) => {
    setCategory(setting.category);
    setFormData({
      productType: setting.productType,
      category: setting.category,
      brand: setting.brand,
      productDescription: setting.productDescription,
      identifierCodeType: setting.identifierCodeType,
      identifierCode: setting.identifierCode,
      colorTypeVariantimagePrice: setting.colorTypeVariantimagePrice,
      packageWeight: setting.packageWeight,
      packageLength: setting.packageLength,
      packageWidth: setting.packageWidth,
      packageHeight: setting.packageHeight,
      deliveryOptions: setting.deliveryOptions,
      quantityinALEASEWILLIS: setting.quantityinALEASEWILLIS,
      quantityinCORNELLHODGES: setting.quantityinCORNELLHODGES,
      sizeChart: setting.sizeChart,
      material: setting.material,
      pattern: setting.pattern,
      neckline: setting.neckline,
      clothingLength: setting.clothingLength,
      sleeveLength: setting.sleeveLength,
      season: setting.season,
      occasion: setting.occasion,
      style: setting.style,
      feature: setting.feature,
      shape: setting.shape,
      scent: setting.scent,
      setting: setting.setting,
      use: setting.use,
      installment: setting.installment,
      fit: setting.fit,
      stretch: setting.stretch,
      careInstructions: setting.careInstructions,
      waistHeight: setting.waistHeight,
      volume: setting.volume,
      magnets: setting.magnets,
      manufacturingTechnique: setting.manufacturingTechnique,
      ageGroup: setting.ageGroup,
      battery: setting.battery,
      bPAFree: setting.bPAFree,
      otherDangerousGoodsorHazardousMaterials: setting.otherDangerousGoodsorHazardousMaterials,
      cAProp65Carcinogens: setting.cAProp65Carcinogens,
      carcinogen: setting.carcinogen,
      cAProp65ReproChems: setting.cAProp65ReproChems,
      reprotoxicChemicals: setting.reprotoxicChemicals,
      containsBatteriesorCells: setting.containsBatteriesorCells,
      batteryType: setting.batteryType,
      howBatteriesArePacked: setting.howBatteriesArePacked,
      numberofBatteriesorcells: setting.numberofBatteriesorcells,
      batteryorCellCapacityinWh: setting.batteryorCellCapacityinWh,
      batteryorCellCapacityingrams: setting.batteryorCellCapacityingrams,
      batteryorCellWeightingrams: setting.batteryorCellWeightingrams,
      flammableLiquid: setting.flammableLiquid,
      flammableLiquidVolumeinml: setting.flammableLiquidVolumeinml,
      aerosols: setting.aerosols,
      aerosolLiquidVolumeinml: setting.aerosolLiquidVolumeinml,
      safetyDataSheetforflammablematerials: setting.safetyDataSheetforflammablematerials,
      safetyDataSheetforproductswithbatteries: setting.safetyDataSheetforproductswithbatteries,
      safetyDataSheetforaerosolproducts: setting.safetyDataSheetforaerosolproducts,
      safetyDataSheetforotherdangerousgoodsorhazardousmaterials: setting.safetyDataSheetforotherdangerousgoodsorhazardousmaterials
    });
    setEditing(true);
    setEditingId(setting._id);
    handleShowModal();
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/producttype-settings/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchProductTypeSettings();
    } catch (error) {
      console.error('Error deleting Product Type setting:', error);
    }
  };

  return (
    <div className="producttype-settings-container">
      <h2>Cài Đặt Loại Sản Phẩm cho Listing</h2>
      <Button variant="primary" onClick={handleShowModal}>Thêm</Button>
      <table className="producttype-settings-table">
        <thead>
          <tr>
            <th>Tên Loại Sản Phẩm</th>
            <th>Mô Tả</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {productTypeSettings.length > 0 ? (
            productTypeSettings.map((setting) => (
              <tr key={setting._id}>
                <td>{setting.productType}</td>
                <td>{setting.category}</td>
                <td>
                  <Button variant="secondary" onClick={() => handleEdit(setting)}>Sửa</Button>
                  <Button variant="danger" onClick={() => handleDelete(setting._id)}>Xóa</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Chỉnh sửa Cài Đặt' : 'Thêm Cài Đặt'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productType">
              <Form.Label>Tên Loại Sản Phẩm *</Form.Label>
              <Form.Control
                type="text"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category *</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Men's Tops/Shirts">Men's Tops/Shirts</option>
                <option value="Men's Tops/T-shirts">Men's Tops/T-shirts</option>
                <option value="coc">COC</option>
                <option value="no">no</option>
              </Form.Control>
            </Form.Group>

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // brand
              <Form.Group controlId="brand">
              <Form.Label>Brand *</Form.Label>
              <Form.Control
                as="select"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                <option value="No brand">No brand</option>
              </Form.Control>
            </Form.Group>
            )}
            
            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // productDescription
              <Form.Group controlId="productDescription">
                <Form.Label>Mô Tả *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && (  // identifierCodeType
              <Form.Group controlId="identifierCodeType">
                <Form.Label>Identifier Code Type</Form.Label>
                <Form.Control
                  as="select"
                  name="identifierCodeType"
                  value={formData.identifierCodeType}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // identifierCode
              <Form.Group controlId="identifierCode">
                <Form.Label>Identifier Code</Form.Label>
                <Form.Control
                  as="select"
                  name="identifierCode"
                  value={formData.identifierCode}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // colorTypeVariantimagePrice
              <Form.Group controlId="colorTypeVariantimagePrice">
                <Form.Label>Color | Type | Variant Image | Price *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="colorTypeVariantimagePrice"
                  placeholder="Black|T Shirt Size S|https://example.com|18.59"
                  value={formData.colorTypeVariantimagePrice}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // packageWeight
              <Form.Group controlId="packageWeight">
                <Form.Label>Package Weight(lb) *</Form.Label>
                <Form.Control
                  as="select"
                  name="packageWeight"
                  value={formData.packageWeight}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package Weight</option>
                  <option value="0.5">0.5</option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // packageLength
              <Form.Group controlId="packageLength">
                <Form.Label>Package Length(inch) *</Form.Label>
                <Form.Control
                  as="select"
                  name="packageLength"
                  value={formData.packageLength}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package Length</option>
                  <option value="13">13</option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // packageWidth
              <Form.Group controlId="packageWidth">
                <Form.Label>Package Width(inch) *</Form.Label>
                <Form.Control
                  as="select"
                  name="packageWidth"
                  value={formData.packageWidth}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package Width</option>
                  <option value="10">10</option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // packageHeight
              <Form.Group controlId="packageHeight">
                <Form.Label>Package Height(inch) *</Form.Label>
                <Form.Control
                  as="select"
                  name="packageHeight"
                  value={formData.packageHeight}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Package Height</option>
                  <option value="1">1</option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // deliveryOptions
              <Form.Group controlId="deliveryOptions">
                <Form.Label>Delivery options *</Form.Label>
                <Form.Control
                  as="select"
                  name="deliveryOptions"
                  value={formData.deliveryOptions}
                  onChange={handleChange}
                  required
                >
                  <option value="">Delivery options</option>
                  <option value="Shipped by Seller">Shipped by Seller</option>
                  <option value="Shipped by Tiktok">Shipped by Tiktok</option>
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // quantityinALEASEWILLIS
              <Form.Group controlId="quantityinALEASEWILLIS">
                <Form.Label>Quantity *</Form.Label>
                <Form.Control
                  type="text"
                  name="quantityinALEASEWILLIS"
                  value={formData.quantityinALEASEWILLIS}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {category === "coc" && ( // quantityinCORNELLHODGES
              <Form.Group controlId="quantityinCORNELLHODGES">
                <Form.Label>Quantity *</Form.Label>
                <Form.Control
                  type="text"
                  name="quantityinCORNELLHODGES"
                  value={formData.quantityinCORNELLHODGES}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // sizeChart
              <Form.Group controlId="sizeChart">
                <Form.Label>Size Chart *</Form.Label>
                <Form.Control
                  type="text"
                  name="sizeChart"
                  value={formData.sizeChart}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // material
              <Form.Group controlId="material">
                <Form.Label>Material</Form.Label>
                <Form.Control
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // pattern
              <Form.Group controlId="pattern">
                <Form.Label>Pattern</Form.Label>
                <Form.Control
                  type="text"
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // neckline
              <Form.Group controlId="neckline">
                <Form.Label>Neckline</Form.Label>
                <Form.Control
                  type="text"
                  name="neckline"
                  value={formData.neckline}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // clothingLength
              <Form.Group controlId="clothingLength">
                <Form.Label>Clothing Length</Form.Label>
                <Form.Control
                  type="text"
                  name="clothingLength"
                  value={formData.clothingLength}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // sleeveLength
              <Form.Group controlId="sleeveLength">
                <Form.Label>Sleeve Length</Form.Label>
                <Form.Control
                  type="text"
                  name="sleeveLength"
                  value={formData.sleeveLength}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // season
              <Form.Group controlId="season">
                <Form.Label>Season</Form.Label>
                <Form.Control
                  type="text"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // occasion
              <Form.Group controlId="occasion">
                <Form.Label>Occasion</Form.Label>
                <Form.Control
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // style
              <Form.Group controlId="style">
                <Form.Label>Style</Form.Label>
                <Form.Control
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // feature
              <Form.Group controlId="feature">
                <Form.Label>Feature</Form.Label>
                <Form.Control
                  type="text"
                  name="feature"
                  value={formData.feature}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // shape
              <Form.Group controlId="shape">
                <Form.Label>Shape</Form.Label>
                <Form.Control
                  type="text"
                  name="shape"
                  value={formData.shape}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // scent
              <Form.Group controlId="scent">
                <Form.Label>Scent</Form.Label>
                <Form.Control
                  type="text"
                  name="scent"
                  value={formData.scent}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // setting
              <Form.Group controlId="setting">
                <Form.Label>Setting</Form.Label>
                <Form.Control
                  type="text"
                  name="setting"
                  value={formData.setting}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // use
              <Form.Group controlId="use">
                <Form.Label>Use</Form.Label>
                <Form.Control
                  type="text"
                  name="use"
                  value={formData.use}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // installment
              <Form.Group controlId="installment">
                <Form.Label>Installment</Form.Label>
                <Form.Control
                  type="text"
                  name="installment"
                  value={formData.installment}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // fit
              <Form.Group controlId="fit">
                <Form.Label>Fit</Form.Label>
                <Form.Control
                  type="text"
                  name="fit"
                  value={formData.fit}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // stretch
              <Form.Group controlId="stretch"> 
                <Form.Label>Stretch</Form.Label>
                <Form.Control
                  type="text"
                  name="stretch"
                  value={formData.stretch}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // careInstructions
              <Form.Group controlId="careInstructions">
                <Form.Label>Care Instructions</Form.Label>
                <Form.Control
                  type="text"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // waistHeight
              <Form.Group controlId="waistHeight">
                <Form.Label>Waist Height</Form.Label>
                <Form.Control
                  type="text"
                  name="waistHeight"
                  value={formData.waistHeight}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // volume
              <Form.Group controlId="waistHvolumeeight">
                <Form.Label>Volume</Form.Label>
                <Form.Control
                  type="text"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // magnets
              <Form.Group controlId="magnets">
                <Form.Label>Magnets</Form.Label>
                <Form.Control
                  type="text"
                  name="magnets"
                  value={formData.magnets}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // manufacturingTechnique
              <Form.Group controlId="ManufacturingTechnique">
                <Form.Label>manufacturing Technique</Form.Label>
                <Form.Control
                  type="text"
                  name="manufacturingTechnique"
                  value={formData.manufacturingTechnique}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // ageGroup
              <Form.Group controlId="ageGroup">
                <Form.Label>Age Group</Form.Label>
                <Form.Control
                  type="text"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // battery
              <Form.Group controlId="battery">
                <Form.Label>Battery</Form.Label>
                <Form.Control
                  type="text"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // bPAFree
              <Form.Group controlId="bPAFree">
                <Form.Label>BPAFree</Form.Label>
                <Form.Control
                  type="text"
                  name="bPAFree"
                  value={formData.bPAFree}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // otherDangerousGoodsorHazardousMaterials
              <Form.Group controlId="otherDangerousGoodsorHazardousMaterials">
                <Form.Label>Other Dangerous Goods or Hazardous Materials</Form.Label>
                <Form.Control
                  type="text"
                  name="otherDangerousGoodsorHazardousMaterials"
                  value={formData.otherDangerousGoodsorHazardousMaterials}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // cAProp65Carcinogens
              <Form.Group controlId="cAProp65Carcinogens">
                <Form.Label>CA Prop 65: Carcinogens</Form.Label>
                <Form.Control
                  type="text"
                  name="cAProp65Carcinogens"
                  value={formData.cAProp65Carcinogens}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // carcinogen
              <Form.Group controlId="carcinogen">
                <Form.Label>Carcinogen</Form.Label>
                <Form.Control
                  type="text"
                  name="carcinogen"
                  value={formData.carcinogen}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // cAProp65ReproChems
              <Form.Group controlId="cAProp65ReproChems">
                <Form.Label>CA Prop65: ReproChems</Form.Label>
                <Form.Control
                  type="text"
                  name="cAProp65ReproChems"
                  value={formData.cAProp65ReproChems}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // reprotoxicChemicals
              <Form.Group controlId="reprotoxicChemicals">
                <Form.Label>Reprotoxic Chemicals</Form.Label>
                <Form.Control
                  type="text"
                  name="reprotoxicChemicals"
                  value={formData.reprotoxicChemicals}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // containsBatteriesorCells
              <Form.Group controlId="containsBatteriesorCells">
                <Form.Label>Contains Batteries or Cells</Form.Label>
                <Form.Control
                  type="text"
                  name="containsBatteriesorCells"
                  value={formData.containsBatteriesorCells}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // batteryType
              <Form.Group controlId="batteryType">
                <Form.Label>Battery Type</Form.Label>
                <Form.Control
                  type="text"
                  name="batteryType"
                  value={formData.batteryType}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // howBatteriesArePacked
              <Form.Group controlId="howBatteriesArePacked">
                <Form.Label>How Batteries Are Packed?</Form.Label>
                <Form.Control
                  type="text"
                  name="howBatteriesArePacked"
                  value={formData.howBatteriesArePacked}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // numberofBatteriesorcells
              <Form.Group controlId="numberofBatteriesorcells">
                <Form.Label>Number of Batteries or cells</Form.Label>
                <Form.Control
                  type="text"
                  name="numberofBatteriesorcells"
                  value={formData.numberofBatteriesorcells}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // batteryorCellCapacityinWh
              <Form.Group controlId="batteryorCellCapacityinWh">
                <Form.Label>Battery or Cell Capacity in Wh</Form.Label>
                <Form.Control
                  type="text"
                  name="batteryorCellCapacityinWh"
                  value={formData.batteryorCellCapacityinWh}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // batteryorCellCapacityingrams
              <Form.Group controlId="batteryorCellCapacityingrams">
                <Form.Label>Battery or Cell Capacity in grams</Form.Label>
                <Form.Control
                  type="text"
                  name="batteryorCellCapacityingrams"
                  value={formData.batteryorCellCapacityingrams}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "no" && ( // batteryorCellWeightingrams
              <Form.Group controlId="batteryorCellWeightingrams">
                <Form.Label>Battery or Cell Weight in grams</Form.Label>
                <Form.Control
                  type="text"
                  name="batteryorCellWeightingrams"
                  value={formData.batteryorCellWeightingrams}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // flammableLiquid
              <Form.Group controlId="flammableLiquid">
                <Form.Label>Flammable Liquid</Form.Label>
                <Form.Control
                  type="text"
                  name="flammableLiquid"
                  value={formData.flammableLiquid}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // flammableLiquidVolumeinml
              <Form.Group controlId="flammableLiquidVolumeinml">
                <Form.Label>Flammable Liquid Volume in ml</Form.Label>
                <Form.Control
                  type="text"
                  name="flammableLiquidVolumeinml"
                  value={formData.flammableLiquidVolumeinml}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // aerosols
              <Form.Group controlId="aerosols">
                <Form.Label>Aerosols</Form.Label>
                <Form.Control
                  type="text"
                  name="aerosols"
                  value={formData.aerosols}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // aerosolLiquidVolumeinml
              <Form.Group controlId="aerosolLiquidVolumeinml">
                <Form.Label>Aerosol Liquid Volume in ml</Form.Label>
                <Form.Control
                  type="text"
                  name="aerosolLiquidVolumeinml"
                  value={formData.aerosolLiquidVolumeinml}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // safetyDataSheetforflammablematerials
              <Form.Group controlId="safetyDataSheetforflammablematerials">
                <Form.Label>Safety Data Sheet for flammable materials</Form.Label>
                <Form.Control
                  type="text"
                  name="safetyDataSheetforflammablematerials"
                  value={formData.safetyDataSheetforflammablematerials}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // safetyDataSheetforproductswithbatteries
              <Form.Group controlId="safetyDataSheetforproductswithbatteries">
                <Form.Label>Safety Data Sheet for products with batteries</Form.Label>
                <Form.Control
                  type="text"
                  name="safetyDataSheetforproductswithbatteries"
                  value={formData.safetyDataSheetforproductswithbatteries}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {category === "coc" && ( // safetyDataSheetforaerosolproducts
              <Form.Group controlId="safetyDataSheetforaerosolproducts">
                <Form.Label>Safety Data Sheet for aerosol products</Form.Label>
                <Form.Control
                  type="text"
                  name="safetyDataSheetforaerosolproducts"
                  value={formData.safetyDataSheetforaerosolproducts}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            {(category === "Men's Tops/Shirts" || category === "Men's Tops/T-shirts") && ( // safetyDataSheetforotherdangerousgoodsorhazardousmaterials
              <Form.Group controlId="safetyDataSheetforotherdangerousgoodsorhazardousmaterials">
                <Form.Label>Safety Data Sheet for other dangerous goods or hazardous materials</Form.Label>
                <Form.Control
                  type="text"
                  name="safetyDataSheetforotherdangerousgoodsorhazardousmaterials"
                  value={formData.safetyDataSheetforotherdangerousgoodsorhazardousmaterials}
                  onChange={handleChange}
                  required
                >
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group>
              {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
          <Button variant="primary" onClick={handleSave}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Producttypeforlisting;
