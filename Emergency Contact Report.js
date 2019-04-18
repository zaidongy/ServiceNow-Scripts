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
  // var csv = "";
  // var headers = Object.keys(jsonArr[0]);
  // csv += headers.join(",") + "\n";
  // return csv;
}

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
        "Requested By": caseObj.requested_by,
        Relationship: caseObj.ec_relationship,
        "First Name": caseObj.ec_first_name,
        "Last Name": caseObj.ec_last_name,
        "Primary Contact Number": caseObj.ec_primary_contact_phone,
        "Emergency Address Line 1": caseObj.ec_address_line_1,
        "Emergency Address line 2": caseObj.ec_address_line_2,
        City: caseObj.ec_city,
        State: caseObj.ec_state,
        Country: caseObj.ec_country,
        "Zip Code": caseObj.ec_zip_code,
        "Effective Date": caseObj.ec_effective_date
      });
  }
}
var csvfile = json2csv(caseObjects);
csvfile;
