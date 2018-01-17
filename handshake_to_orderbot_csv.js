// Take in a csv file of Handshake orders and create a csv that can be imported into Orderbot
let handshake_export_file = '2018-01-15_atlanta_handshake_orders_short.csv'
let orderbot_import_file = '2018-01-15_atlanta_orderbot_orders.csv'
let fs = require('fs');
let csv = require('csvtojson');
let json2csv = require('json2csv');
let handshake_orders = []
csv()
.fromFile(handshake_export_file)
.on('json', (jsonObj) => {
  orderbotOrder = {
    "Order Date": jsonObj.order_date,
    "Ship Date": jsonObj.start_ship_date,
    "Order Status": "Quote",
    "Customer ID": "LOOKUP CUSTOMER ID",
    "Account ID": jsonObj.customer_id,
    "Orderguid ID": 840,
    "Product Name": jsonObj.description,
    "Item SKU": jsonObj.sku,
    "Product Quantity": jsonObj.qty,
    "Individual Unit Price": jsonObj.unit_price,
    "Individual Unit Discount": jsonObj.unit_discount,
  }
  handshake_orders.push(orderbotOrder)
})
.on('done', (error) => {
  console.log('end')
  console.log(handshake_orders)
  console.log(handshake_orders.length)
})

// let input = fs.readFileSync(handshake_export_file, 'utf8').trim()
// console.log(input)
// let rows = input.split('\n')
// // console.log(rows)
// let handshake_fields = rows[0].split(',')
// let handshake_orders = []
//
// for ( let i = 1; i < rows.length; i++ ) {
//   let order_array = rows[i].split(',')
//   let order = {}
//   // console.log(order_array)
//   for (let j = 0; j < handshake_fields.length; j++) {
//     order[handshake_fields[j].trim()] = order_array[j].trim()
//   }
//   handshake_orders.push(order)
// }
// // console.log(handshake_orders[0].customer)
