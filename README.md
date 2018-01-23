To Export Orders from Handshake to Orderbot
In handshake_to_orderbot_csv.js:
* Pull list of all customers from Orderbot API (http://api.orderbot.com/admin/customers.json/) and set file path to orderbot_customer_file
* Export orders from Handshake and set the file path to handshake_export_file
* Set names of orderbot_import_file, customers_to_add_to_orderbot_file, and order_notes_file to current date or desired name/path
* Run handshake_to_orderbot_csv.js
* Open customers_to_add_to_orderbot_file and add those customers to orderbot and/or update the customer ID in Handshake
* Re-export Handshake orders and update handshake_export_file path if necessary
* Re-run handshake_to_orderbot_csv.js
* Orders for Orderbot import are in the orderbot_import_file csv
