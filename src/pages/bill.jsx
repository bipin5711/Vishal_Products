import React,{useEffect, useRef,useState} from 'react'
import {Button,Container,Typography,Grid,TextField} from '@mui/material';
import { makeStyles } from "@mui/styles";
import ReactToPrint from "react-to-print";
import './style.css';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: '#5f7395',
	},
	gridContainer: {
		// border: '10px double black',
		padding: '16px 12px',
		height: 'fit-content',
		// minHeight: '100vh',
		backgroundColor: 'white',
	},
	gridItem: {
		display: 'flex',
	},
	border: {
		width: '100%',
		backgroundColor: 'black',
		height: '4px',
	},
	flexSpaceBw: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}));
const getDateFormatted = (d) => {
	const date = d.substring(8, 10);
	const month = d.substring(5, 7);
	const year = d.substring(0, 4);


	return date + '-' + month + '-'+year;
} 
export default function Bill() {
  const classes = useStyles();
	let componentRef = useRef();
	const [invoiceNo, setInvoiceNo] = useState('');
	const [invoiceDate, setInvoiceDate] = useState(
		getDateFormatted(JSON.stringify(new Date()).slice(1, 11)
	));
	const [dueDate, setDueDate] = useState(
		getDateFormatted(JSON.stringify(new Date()).slice(1, 11)
		));
	const [billTo, setBillTo] = useState({company:'',address:''});
	const [shipTo, setShipTo] = useState({ company: '', address: '' });
	const [gstNumber, setGstNumber] = useState('27AGGPN7802D2ZH');
	const [mobile, setMobile] = useState('7977528857');
	const [company, setCompany] = useState({
		name: 'Vishal Plastic Products',
		address: 'Ground floor, Shop number 19, M I Udyog Nagar, Cabin Cross Road, Bhayandar East Thane, 401105, Maharashtra'
	});
	const [bank, setBank] = useState({
		name: 'Vishal plastic product',
		ifsc: 'PUNB0099510',
		accountNo: '09951011004451',
		bankName: 'Punjab National Bank,THANE BHAYANDER W',
	});
	const [gst, setGst] = useState({ cgst: 9, sgst: 9 });
	const [received, setReceived] = useState(0)
	const [taxableAmount, setTaxableAmount] = useState(0)
	const [cgst, setCgst] = useState(0);
	const [sgst, setSgst] = useState(0);
	const [items, setItems] = useState([]);
	const [subTotal, setSubTotal] = useState({qty:0,tax:0,amount:0});
	 const addItems = () => {
			setItems([
				...items,
				{
					name: '',
					hsn: '',
					qty: '',
					unitMeasure:'',
					rate: '',
					tax: '',
					amount: '',	
				},
			]);
	};
	const calculateTax = (totalAmount, percentage) => {
		console.log(
			'tax calculation',
			totalAmount,
			percentage,
			parseInt(parseInt(totalAmount) * parseInt(percentage)) / 100
		);
		if (totalAmount && percentage) {
		return parseInt((parseInt(totalAmount) * parseInt(percentage))/100);
		}
		return 0;
	}
	useEffect(() => {
		if (items) {
			updateData();
		}
	}, [items]);
	useEffect(() => {
		if (gst.cgst && gst.sgst) {
		const updatedItems = [];
		let newTax = '';
			items.map((item) => {
			console.log('test',gst,item)
			if (gst.cgst && gst.sgst) {
				newTax = calculateTax(
					item.qty * item.rate,
					gst.cgst + gst.sgst
				);
			console.log('test222', newTax, item);

				updatedItems.push({
					...item,
					tax: newTax,
					amount: item.qty * item.rate + newTax,
				});
			}
		});
			if (updatedItems) setItems(updatedItems);
		}
	},[gst])
	const updateData = () => {
	let qt = 0;
	let tx = 0;
	let amt = 0;
	let taxAmt = 0;
	let cgstAmt = 0;
	let sgstAmt = 0;
	items.map((item) => {
		qt = qt + item.qty;
		tx = tx + item.tax;
		amt = amt + item.amount;
		taxAmt = taxAmt + item.qty * item.rate;
		cgstAmt = cgstAmt + calculateTax(item.qty * item.rate, gst.cgst);
		sgstAmt = sgstAmt + calculateTax(item.qty * item.rate, gst.sgst);
	});
	setSubTotal({
		qty: qt,
		tax: tx,
		amount: amt,
	});
	setTaxableAmount(taxAmt);
	setCgst(cgstAmt);
	setSgst(sgstAmt);
	}
	console.log('itemssss',items,subTotal)
  return (
		<div className={classes.root}>
			<Container style={{ backgroundColor: 'white', padding: '12px 0' }}>
				<div style={{ padding: '0 12px' }}>
					<Typography
						style={{
							fontSize: '20px',
							width: '100%',
							textAlign: 'start',
							padding: '4px',
							fontWeight: '600',
							backgroundColor: '#e6e5e5',
							marginBottom: '12px',
						}}
					>
						Form
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								Company Details
							</Typography>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setCompany({
										...company,
										name: e.target.value,
									})
								}
								value={company.name}
								label="Company Name"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setCompany({
										...company,
										address: e.target.value,
									})
								}
								value={company.address}
								label="Company Address"
								fullWidth
								multiline
								rows={2}
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								Bank Details
							</Typography>
						</Grid>
						<Grid item xs={6} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBank({
										...bank,
										name: e.target.value,
									})
								}
								value={bank.name}
								label="Business Name"
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBank({
										...bank,
										ifsc: e.target.value,
									})
								}
								value={bank.ifsc}
								label="IFSC Code"
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBank({
										...bank,
										accountNo: e.target.value,
									})
								}
								value={bank.accountNo}
								label="Account No."
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBank({
										...bank,
										bankName: e.target.value,
									})
								}
								value={bank.bankName}
								label="Bank Name"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								Invoice Details
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) => setInvoiceNo(e.target.value)}
								value={invoiceNo}
								fullWidth
								label="Invoice No"
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) => setInvoiceDate(e.target.value)}
								fullWidth
								value={invoiceDate}
								label="Invoice Date"
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) => setDueDate(e.target.value)}
								value={dueDate}
								fullWidth
								label="Due Date"
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								BILL TO Details
							</Typography>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBillTo({
										...billTo,
										company: e.target.value,
									})
								}
								value={billTo.company}
								label="Company Name"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setBillTo({
										...billTo,
										address: e.target.value,
									})
								}
								value={billTo.address}
								label="Address"
								multiline
								fullWidth
								rows="4"
							/>
						</Grid>

						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								SHIP TO Details
							</Typography>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setShipTo({
										...shipTo,
										company: e.target.value,
									})
								}
								value={shipTo.company}
								label="Company Name"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) =>
									setShipTo({
										...shipTo,
										address: e.target.value,
									})
								}
								value={shipTo.address}
								label="Address"
								multiline
								fullWidth
								rows="4"
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								GST Details
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<TextField
								variant="outlined"
								size="small"
								name="cgst"
								onChange={
									(e) =>
									{
										console.log('e.target.value', e.target);
										setGst({
											...gst,
											cgst: e.target.value ? parseInt(e.target.value) : 0,
										});
										}
								}
								value={gst.cgst}
								fullWidth
								label="CGST"
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								variant="outlined"
								size="small"
								name="sgst"
								onChange={
									(e) =>{
										console.log('e.target.value', e.target);
										setGst({
											...gst,
											sgst: e.target.value
												? parseInt(e.target.value)
												: 0,
										});
									}
								}
								value={gst.sgst}
								fullWidth
								label="SGST"
							/>
						</Grid>
						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								Item Details
							</Typography>
						</Grid>
						{items.map((item, index) => (
							<>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										name="productname"
										size="small"
										onChange={(e) => {
											const list = [...items];
											list[index].name = e.target.value;
											setItems(list);
										}}
										value={item.name}
										fullWidth
										label="Name"
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										variant="outlined"
										size="small"
										name="hsn"
										onChange={(e) => {
											const list = [...items];
											list[index].hsn = e.target.value;
											setItems(list);
										}}
										value={item.hsn}
										fullWidth
										label="HSN"
									/>
								</Grid>

								<Grid item xs={2}>
									<TextField
										variant="outlined"
										size="small"
										name="qty"
										onChange={(e) => {
											let val = parseInt(e.target.value);
											// if (e.target.value) {
												const list = [...items];
												const totalRate =
													val * list[index].rate;
												const totalGst =
													gst.cgst + gst.sgst;
												const taxPerItem = calculateTax(
													totalRate,
													totalGst
												);
												list[index].qty = val;
												list[index].tax = taxPerItem;
												list[index].amount =
													totalRate + taxPerItem;
												setItems(list);
											// }
										}}
										value={item.qty}
										fullWidth
										label="Quantity"
										type="number"
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										variant="outlined"
										name="unit"
										size="small"
										onChange={(e) => {
											const list = [...items];
											list[index].unitMeasure =
												e.target.value;
											setItems(list);
										}}
										value={item.unitMeasure}
										fullWidth
										label="Unit Measure"
									/>
								</Grid>
								<Grid item xs={2}>
									<TextField
										variant="outlined"
										size="small"
										name="rate"
										onChange={(e) => {
											let val = parseInt(e.target.value);
											// if (e.target.value) {
												const list = [...items];
												const totalRate =
													val *
													list[index].qty;
												const totalGst =
													gst.cgst + gst.sgst;
												const taxPerItem = calculateTax(
													totalRate,
													totalGst
												);
												list[index].rate =
													val;
												list[index].tax = taxPerItem;
												list[index].amount =
													totalRate + taxPerItem;
												setItems(list);
											// }
										}}
										value={item.rate}
										fullWidth
										label="Rate"
									/>
								</Grid>
							</>
						))}
						<Grid item xs={12} textAlign="start">
							<Button onClick={addItems} variant="contained">
								Add Item
							</Button>
						</Grid>

						<Grid item xs={12} textAlign="start">
							<Typography
								style={{
									fontSize: '15px',
									textAlign: 'start',
									fontWeight: '600',
								}}
							>
								Amount Details
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<TextField
								variant="outlined"
								size="small"
								onChange={(e) => setReceived(e.target.value)}
								value={received}
								fullWidth
								//   type="number"
								label="Received Amount"
							/>
						</Grid>
					</Grid>
					<Typography
						style={{
							fontSize: '20px',
							width: '100%',
							textAlign: 'start',
							padding: '4px',
							fontWeight: '600',
							backgroundColor: '#e6e5e5',
							marginBottom: '12px',
							marginTop: '24px',
						}}
					>
						Preview
					</Typography>
				</div>

				<Grid
					container
					direction="row"
					// alignItems={'flex-start'}
					justify="space-between"
					className={classes.gridContainer}
					ref={(el) => (componentRef = el)}
				>
					<Grid
						item
						xs={12}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						<div
							style={{
								border: '1px solid #868597',
								padding: '2px 6px',
								borderRadius: '4px',
								marginRight: '8px',
							}}
						>
							<Typography
								style={{ color: '#868597', fontSize: '14px' }}
							>
								ORIGINAL FOR RECIPIENT
							</Typography>
						</div>
						<Typography style={{ fontSize: '14px' }}>
							TAX INVOICE
						</Typography>
					</Grid>
					<Grid item xs={12} className={classes.gridItem}>
						<Typography
							style={{
								fontSize: '24px',
								fontWeight: 600,
								margin: '6px 0 0 8px',
							}}
						>
							{company.name}
						</Typography>
					</Grid>

					<Grid item xs={12} className={classes.gridItem}>
						<Typography
							style={{
								fontSize: '15px',
								marginLeft: '8px',
								marginRight: '120px',
								whiteSpace: 'pre-wrap',
								textAlign: 'start',
							}}
						>
							{company.address}
						</Typography>
					</Grid>
					<Grid item xs={12} className={classes.gridItem}>
						<Typography
							style={{
								fontWeight: 600,
								marginLeft: '8px',
								fontSize: '15px',
								marginRight: '6px',
							}}
						>
							Mobile:
						</Typography>
						<Typography
							style={{
								fontSize: '14px',
								fontWeight: 'normal',
								marginLeft: '8px',
							}}
						>
							{mobile}
						</Typography>
						<Typography
							style={{
								marginLeft: '16px',
								fontSize: '15px',
								fontWeight: '600',
								marginRight: '6px',
							}}
						>
							GSTIN:
						</Typography>
						<Typography
							style={{
								fontSize: '14px',
								fontWeight: 'normal',
								marginLeft: '8px',
							}}
						>
							{gstNumber}
						</Typography>
					</Grid>

					<Grid item xs={12} style={{ marginTop: '2px' }}>
						<div className={classes.border}></div>
					</Grid>
					<Grid
						item
						xs={12}
						className={classes.flexSpaceBw}
						style={{
							backgroundColor: '#e6e5e5',
							padding: '8px 8px',
							marginBottom: '12px',
						}}
					>
						<div className={classes.gridItem}>
							<Typography style={{ fontSize: '14px' }}>
								Invoice No:
							</Typography>
							<Typography
								style={{ marginLeft: '4px', fontSize: '14px' }}
							>
								{invoiceNo}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography style={{ fontSize: '14px' }}>
								Invoice Date:
							</Typography>
							<Typography
								style={{ marginLeft: '4px', fontSize: '14px' }}
							>
								{invoiceDate}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography style={{ fontSize: '14px' }}>
								Due Date:
							</Typography>
							<Typography
								style={{ marginLeft: '4px', fontSize: '14px' }}
							>
								{dueDate}
							</Typography>
						</div>
					</Grid>
					<Grid
						item
						xs={6}
						textAlign={'start'}
						style={{ paddingLeft: '8px', paddingRight: '18px' }}
					>
						<Typography
							style={{
								fontSize: '17px',
								fontWeight: '700',
								letterSpacing: 1.8,
								marginBottom: '3px',
							}}
						>
							BILL TO
						</Typography>
						<Typography
							style={{
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							{billTo.company}
						</Typography>
						<Typography
							style={{
								fontSize: '13px',
								fontWeight: '400',
								whiteSpace: 'pre-wrap',
								textAlign: 'start',
							}}
						>
							{billTo.address}
						</Typography>
					</Grid>
					<Grid
						item
						xs={6}
						textAlign={'start'}
						style={{ paddingRight: '8px', paddingLeft: '18px' }}
					>
						<Typography
							style={{
								fontSize: '17px',
								fontWeight: '700',
								letterSpacing: 1.8,
								marginBottom: '3px',
							}}
						>
							SHIP TO
						</Typography>
						<Typography
							style={{
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							{shipTo.company}
						</Typography>
						<Typography
							style={{
								fontSize: '13px',
								fontWeight: '400',
								whiteSpace: 'pre-wrap',
								textAlign: 'start',
							}}
						>
							{shipTo.address}
						</Typography>
					</Grid>

					<Grid item xs={12} style={{ marginTop: '8px' }}>
						<div className={classes.border}></div>
					</Grid>
					<Grid
						item
						xs={12}
						className={classes.gridItem}
						style={{ margin: '0 8px', padding: '8px 0' }}
					>
						<Typography
							textAlign={'start'}
							style={{
								width: '30%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							ITEMS
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '10%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							HSN
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '15%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							QTY.
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '15%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							RATE
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '15%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							TAX
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '15%',
								fontSize: '15px',
								fontWeight: '600',
							}}
						>
							AMOUNT
						</Typography>
					</Grid>

					<Grid item xs={12}>
						<div style={{ border: '3px solid #ececec' }}></div>
					</Grid>
					{items.map((item) => (
						<>
							<Grid
								item
								xs={12}
								className={classes.gridItem}
								style={{ margin: '0 8px', padding: '8px 0' }}
							>
								<Typography
									textAlign={'start'}
									style={{
										width: '30%',
										fontSize: '14px',
									}}
								>
									{item.name}
								</Typography>
								<Typography
									textAlign={'end'}
									style={{
										width: '10%',
										fontSize: '14px',
									}}
								>
									{item.hsn}
								</Typography>
								<Typography
									textAlign={'end'}
									style={{
										width: '15%',
										fontSize: '14px',
									}}
								>
									{item.qty + ' ' + item.unitMeasure}
								</Typography>
								<Typography
									textAlign={'end'}
									style={{
										width: '15%',
										fontSize: '14px',
									}}
								>
									{item.rate}
								</Typography>
								<Typography
									textAlign={'end'}
									style={{
										width: '15%',
										fontSize: '14px',
									}}
								>
									{item.tax}
								</Typography>
								<Typography
									textAlign={'end'}
									style={{
										width: '15%',
										fontSize: '14px',
									}}
								>
									{item.amount}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<div
									style={{
										border: '1px solid #ececec',
										margin: '3px 0',
									}}
								></div>
							</Grid>
						</>
					))}
					<Grid item xs={12}>
						<div
							style={{
								border: '3px solid #ececec',
								marginTop: '48px',
							}}
						></div>
					</Grid>
					<Grid
						item
						xs={12}
						className={classes.gridItem}
						style={{ margin: '0 8px', padding: '8px 0 6px 0' }}
					>
						<Typography
							textAlign={'start'}
							style={{
								width: '30%',
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							SUB TOTAL
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '25%',
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							{subTotal.qty}
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '30%',
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							₹ {subTotal.tax}
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								width: '15%',
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							₹ {subTotal.amount}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.border}></div>
					</Grid>
					<Grid
						item
						xs={8}
						textAlign={'start'}
						style={{ marginTop: '12px' }}
					>
						<Typography
							style={{
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							BANK DETAILS
						</Typography>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '30%', fontSize: '14px' }}
							>
								Name:
							</Typography>
							<Typography
								style={{ width: '70%', fontSize: '14px' }}
							>
								{bank.name}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '30%', fontSize: '14px' }}
							>
								IFSC Code:
							</Typography>
							<Typography
								style={{ width: '70%', fontSize: '14px' }}
							>
								{bank.ifsc}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '30%', fontSize: '14px' }}
							>
								Account No:
							</Typography>
							<Typography
								style={{ width: '70%', fontSize: '14px' }}
							>
								{bank.accountNo}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '30%', fontSize: '14px' }}
							>
								Bank:
							</Typography>
							<Typography
								style={{ width: '70%', fontSize: '14px' }}
							>
								{bank.bankName}
							</Typography>
						</div>

						<div>
							<Typography
								style={{
									fontSize: '14px',
									fontWeight: '600',
									marginTop: '12px',
								}}
							>
								TERMS AND CONDITIONS:
							</Typography>
							<Typography
								style={{
									fontSize: '14px',
								}}
							>
								1. Goods once sold will not be taken back or
								exchanged
							</Typography>
							<Typography
								style={{
									fontSize: '14px',
								}}
							>
								2. All disputes are subject to
								[ENTER_YOUR_CITY_NAME] jurisdiction only
							</Typography>
						</div>
					</Grid>
					<Grid item xs={4} style={{ marginTop: '12px' }}>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '60%', fontSize: '14px' }}
								textAlign={'end'}
							>
								Taxable Amount
							</Typography>
							<Typography
								style={{ width: '40%', fontSize: '14px' }}
								textAlign={'end'}
							>
								₹ {taxableAmount}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '60%', fontSize: '14px' }}
								textAlign={'end'}
							>
								CGST @{gst.cgst}%
							</Typography>
							<Typography
								style={{ width: '40%', fontSize: '14px' }}
								textAlign={'end'}
							>
								₹ {cgst}
							</Typography>
						</div>
						<div className={classes.gridItem}>
							<Typography
								style={{ width: '60%', fontSize: '14px' }}
								textAlign={'end'}
							>
								SGST @{gst.sgst}%
							</Typography>
							<Typography
								style={{ width: '40%', fontSize: '14px' }}
								textAlign={'end'}
							>
								₹ {sgst}
							</Typography>
						</div>
						<div
							style={{
								width: '100%',
								backgroundColor: 'black',
								height: 1.5,
								margin: '6px 0',
							}}
						></div>

						<div className={classes.gridItem}>
							<Typography
								style={{
									width: '60%',
									fontSize: '14px',
									fontWeight: '600',
								}}
								textAlign={'end'}
							>
								Total
							</Typography>
							<Typography
								style={{
									width: '40%',
									fontSize: '15px',
									fontWeight: '600',
								}}
								textAlign={'end'}
							>
								₹ {subTotal.amount}
							</Typography>
						</div>
						<div
							style={{
								width: '100%',
								backgroundColor: 'black',
								margin: '6px 0',
								height: 1.5,
							}}
						></div>

						<div className={classes.gridItem}>
							<Typography
								style={{ width: '60%', fontSize: '14px' }}
								textAlign={'end'}
							>
								Received Amount
							</Typography>
							<Typography
								style={{ width: '40%', fontSize: '14px' }}
								textAlign={'end'}
							>
								₹ {received}
							</Typography>
						</div>
						<div
							style={{
								width: '100%',
								backgroundColor: 'black',
								margin: '6px 0',
								height: 1,
							}}
						></div>

						<div className={classes.gridItem}>
							<Typography
								style={{
									width: '60%',
									fontSize: '14px',
									fontWeight: '600',
								}}
								textAlign={'end'}
							>
								Balance
							</Typography>
							<Typography
								style={{
									width: '40%',
									fontSize: '15px',
									fontWeight: '700',
								}}
								textAlign={'end'}
							>
								₹ {subTotal.amount - received}
							</Typography>
						</div>
					</Grid>
					<Grid xs={12}>
						<Typography
							textAlign={'end'}
							style={{
								fontSize: '14px',
								fontWeight: '600',
								marginTop: '16px',
							}}
						>
							Invoice Amount (in words)
						</Typography>
						<Typography
							textAlign={'end'}
							style={{
								fontSize: '14px',
								// fontWeight: '700',
							}}
						>
							{amountInWords(subTotal.amount)} Rupees
						</Typography>
					</Grid>
				</Grid>
				<ReactToPrint
					trigger={() => (
						<div style={{ textAlign: 'center', margin: '1em 0' }}>
							<Button variant="contained" color="info">
								Print
							</Button>
						</div>
					)}
					content={() => componentRef}
				/>
			</Container>
		</div>
  );
}
 function amountInWords(number) {
		var NS = [
			{ value: 10000000, str: 'Crore' },
			{ value: 100000, str: 'Lakh' },
			{ value: 1000, str: 'Thousand' },
			{ value: 100, str: 'Hundred' },
			{ value: 90, str: 'Ninety' },
			{ value: 80, str: 'Eighty' },
			{ value: 70, str: 'Seventy' },
			{ value: 60, str: 'Sixty' },
			{ value: 50, str: 'Fifty' },
			{ value: 40, str: 'Forty' },
			{ value: 30, str: 'Thirty' },
			{ value: 20, str: 'Twenty' },
			{ value: 19, str: 'Nineteen' },
			{ value: 18, str: 'Eighteen' },
			{ value: 17, str: 'Seventeen' },
			{ value: 16, str: 'Sixteen' },
			{ value: 15, str: 'Fifteen' },
			{ value: 14, str: 'Fourteen' },
			{ value: 13, str: 'Thirteen' },
			{ value: 12, str: 'Twelve' },
			{ value: 11, str: 'Eleven' },
			{ value: 10, str: 'Ten' },
			{ value: 9, str: 'Nine' },
			{ value: 8, str: 'Eight' },
			{ value: 7, str: 'Seven' },
			{ value: 6, str: 'Six' },
			{ value: 5, str: 'Five' },
			{ value: 4, str: 'Four' },
			{ value: 3, str: 'Three' },
			{ value: 2, str: 'Two' },
			{ value: 1, str: 'One' },
		];

		var result = '';
		for (var n of NS) {
			if (number >= n.value) {
				if (number <= 99) {
					result += n.str;
					number -= n.value;
					if (number > 0) result += ' ';
				} else {
					var t = Math.floor(number / n.value);
					// console.log(t);
					var d = number % n.value;
					if (d > 0) {
						return (
							amountInWords(t) +
							' ' +
							n.str +
							' ' +
							amountInWords(d)
						);
					} else {
						return amountInWords(t) + ' ' + n.str;
					}
				}
			}
		}
		return result;
 }