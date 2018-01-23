let orderbot_export_file = './2018-01-12_orderbot_products.json'
let handshake_import_file = './2018-01-12_orderbot_products_for_handshake.csv'
let fs = require('fs');
let json2csv = require('json2csv');
let input = fs.readFileSync(orderbot_export_file)
let orderbot_products = JSON.parse(input)
let handshake_products = []
orderbot_products.forEach((product) => {
  if(!product.is_parent && product.active && product.product_group != 'Shopify' && product.product_group != 'custom' && product.product_group != 'Custom') {
    let new_handshake_product = {
      sku: product.sku,
      name: product.product_name,
      unitPrice: product.base_price,
      barcode: product.upc,
      minQty: 1,
      multQty: 1,
      'category:1': product.product_category,
      'category:2': product.product_group
    }
    let qty
    switch(product.product_group) {
      case "Pocket Monkey":
        qty = 6
        break
      case "Headgehog":
        qty = 6
      case "Maine Series":
        qty = 3
        break
      case "Sabertooth":
        qty = 12
        break
      case "WildCard":
        qty = 12
        break
      case "Rustico":
        qty = 6
        break
      case "Element Keyround":
        qty = 6
        break
      case "State Keyround":
        qty = 6
        break
      case "Zootility Keyround":
        qty = 12
        break
      case "Gift Boxes":
        qty = 4
        break
      case "Design Necklaces":
        qty = 6
        break
      case "State Necklaces":
        qty = 6
        break
      case "Live More Necklaces":
        qty = 6
        break
      case "State Coasters":
        qty = 2
        break
      case "ArtLifting Coasters":
        qty = 2
        break
      case "Cultural Coasters":
        qty = 2
        break
      case "Complete Sets":
        qty = 2
        break
      case "Individual Tools":
        qty = 2
        break
      case "Beer and friends":
        qty = 6
        break
      case "Fifty states":
        qty = 3
        break
      case "Animals":
        qty = 3
        break
      default:
        qty = 1
    }
    new_handshake_product.minQty = qty
    new_handshake_product.multQty = qty

    console.log(new_handshake_product)
    handshake_products.push(new_handshake_product)
  }
})
let fields = Object.keys(handshake_products[0])
let csv = json2csv({ data: handshake_products, fields: fields })


fs.writeFileSync(handshake_import_file, csv)
console.log(handshake_products.length)
