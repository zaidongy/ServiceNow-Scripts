// Taken from https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
function json2csv(jsonArr) {
  var json = jsonArr;
  var fields = Object.keys(json[0]);
  var replacer = function(key, value) {
    return value === null ? "" : value;
  };
  var csv = json.map(function(row) {
    return fields
      .map(function(fieldName) {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  csv.unshift(fields.join(",")); // add header column

  return csv.join("\r\n");
}

function getDisplayValue(value, table) {
  var dValue = new GlideRecord(table);
  dValue.get(value);
  return dValue.getDisplayValue();
}

function main() {
  var caseObjects = [];
  var hrcase = new GlideRecord("sn_hr_core_case");
  hrcase.addQuery("hr_service", "0acbadb9db668340d098fb131d9619c2"); // Change my personal information
  hrcase.query();
  while (hrcase.next()) {
    if (hrcase.payload != "") {
      var caseObj = JSON.parse(hrcase.payload);
      if (caseObj.change_type == "Update Emergency Contact")
        caseObjects.push({
          Number: hrcase.getValue("number"),
          "Change Type": caseObj.change_type,
          "Requested By": hrcase.opened_for.getDisplayValue(),
          "Requested By EID": hrcase.opened_for.employee_number.getValue(),
          Relationship: caseObj.ec_relationship,
          "First Name": caseObj.ec_first_name,
          "Last Name": caseObj.ec_last_name,
          "Primary Contact Number": caseObj.ec_primary_contact_phone,
          "Emergency Contact Address Line 1": caseObj.ec_address_line_1,
          "Emergency Contact Address line 2": caseObj.ec_address_line_2,
          City: caseObj.ec_city,
          State: getDisplayValue(caseObj.ec_state, "u_location_list"),
          Country: getDisplayValue(caseObj.ec_country, "u_location_list"),
          "Zip Code": caseObj.ec_zip_code,
          "Effective Date": caseObj.ec_effective_date
        });
    }
  }
  var csvfile = json2csv(caseObjects);
  return csvfile; //For xplore output
}

main();
