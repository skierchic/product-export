// Take in a csv file of Handshake orders and create a csv that can be imported into Orderbot
let handshake_export_file = '2018-01-19_atlanta_handshake_orders.csv'
let orderbot_import_file = '2018-01-19_atlanta_orderbot_orders.csv'
let orderbot_customer_file = '2018-01-19_orderbot_customers.json'
let fs = require('fs');
let csv = require('csvtojson');
let json2csv = require('json2csv');
let input = fs.readFileSync(orderbot_customer_file)
let customers = JSON.parse(input)
let handshake_orders = []
//create a lookup object for Customer ID from Account ID
let accountToCustomer = {}
customers.forEach((customer) => {
  accountToCustomer[customer.account_id] = customer.customer_id
})
let customersNotInOrderbot = []

csv()
.fromFile(handshake_export_file)
.on('json', (jsonObj) => {
  orderbotOrder = {
    "Order #": jsonObj.orderID,
    "Order Date": jsonObj.order_date,
    "Ship Date": jsonObj.start_ship_date,
    "Order Status": "Quote",
    "Customer ID": accountToCustomer[jsonObj.customer_id],
    "Account ID": jsonObj.customer_id,
    "Orderguide ID": 840,
    "Product Name": jsonObj.description,
    "Item SKU": jsonObj.sku,
    "Product Quantity": jsonObj.qty,
    "Individual Unit Price": jsonObj.unit_price,
    "Individual Unit Discount": jsonObj.unit_discount,
    "Shipping": null,
    "Amount Paid": 0,
    "Payment Method": null,
    "Shipping Method": null,
    "Order Notes": jsonObj.notes,
    "Coupon Code": null,
    "Order PO #": jsonObj.customer_po,
    "Tracking Number": null,
    "Customer Reference Id": null,
    "Billing First Name": null,
    "Billing Last Name": null,
    "Billing Email": jsonObj.email,
    "Billing Phone": jsonObj.phone,
    "Billing Address 1": jsonObj.bill_street,
    "Billing Address 2": jsonObj.bill_street2,
    "Billing Post code": jsonObj.bill_postcode,
    "Billing City": jsonObj.bill_city,
    "Billing State": jsonObj.bill_state,
    "Billing Country": jsonObj.bill_country == 'United States' ? 'US' : jsonObj.bill_country,
    "Billing Company": jsonObj.customer,
    "Shipping First Name": null,
    "Shipping Last Name": null,
    "Shipping Email": jsonObj.email,
    "Shipping Address 1": jsonObj.ship_street,
    "Shipping Address 2": jsonObj.ship_street2,
    "Shipping Post code": jsonObj.ship_postcode,
    "Shipping City": jsonObj.ship_city,
    "Shipping State": jsonObj.ship_state,
    "Shipping Country": jsonObj.ship_country == 'United States' ? 'US' : jsonObj.ship_country,
    "Shipping Company": jsonObj.customer,
    "Shipping Phone": jsonObj.phone,
  }
  //set Ship Date to today if blank
  orderbotOrder["Ship Date"] = jsonObj.start_ship_date ? jsonObj.start_ship_date : todaysDate()

  //Set payment method to Credit Card unless Terms is chosen
  switch(jsonObj.payment_terms) {
    case "PREPAID":
      orderbotOrder["Payment Method"] = "Credit Card"
      break
    case "TERMS":
      orderbotOrder["Payment Method"] = "Net 30"
      break
    default:
      orderbotOrder["Payment Method"] = "Credit Card"
  }

  //set ship method to UPS Ground unless USPS or Collect Account selected
  switch(jsonObj.ship_method) {
    case "UPS":
      orderbotOrder["Shipping Method"] = "UPSG"
      break
    case "USPS":
      orderbotOrder["Shipping Method"] = "USPR" //this is for USPS Priority, USPFC is First Class
      break
    case "Collect Account":
      orderbotOrder["Shipping Method"] = null
      break
    default:
      orderbotOrder["Shipping Method"] = "UPSG"
  }
  //Split Billing Name
  let customerName = jsonObj.contact.split(' ')
  orderbotOrder["Billing First Name"] = customerName.shift()
  orderbotOrder["Shipping First Name"] = orderbotOrder["Billing First Name"]
  orderbotOrder["Billing Last Name"] = customerName.join(' ')
  orderbotOrder["Shipping Last Name"] = orderbotOrder["Billing Last Name"]
  handshake_orders.push(orderbotOrder)

  //Change Country to Abbreviation

  //If not in Orderbot add company to customersNotInOrderbot array
  if( !orderbotOrder["Customer ID"]){
    customersNotInOrderbot.push({"Vendor Name": jsonObj.customer})
  }
})
.on('done', (error) => {
  console.log('end')
  console.log(handshake_orders)
  console.log("These customers are not in orderbot:", Array.from(new Set(customersNotInOrderbot)))

  let fields = Object.keys(handshake_orders[0])

  let csv = json2csv({ data: handshake_orders, fields: fields })

  fs.writeFileSync(orderbot_import_file, csv)
  fs.writeFileSync('2018-01-18customersToAddToOrderbot.csv', json2csv({ data: customersNotInOrderbot, fields: ["Vendor Name"]}))
})

let todaysDate = () => {
  let today = new Date()
  let d = today.getDate()
  let m = today.getMonth() + 1
  let yy = today.getFullYear() - 2000
  return m + '/' + d + '/' + yy
}
