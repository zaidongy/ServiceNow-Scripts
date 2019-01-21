(function executeRule(current, previous /*null when async*/) {

	var msgBody = current.body;
	var matchStr = "Change Type: SSN Change<br>What is your new Social Security number?: ";
	// var matchStr = "Social Security";
	var ssnLength = "1234567589".length; //Sample SSN

	var indexStart = msgBody.indexOf(matchStr);
	
	var indexEnd = indexStart + matchStr.length + ssnLength;

	
	var origStr = msgBody.substring(indexStart, indexEnd);
	var replaceStr = matchStr + " XXXXXXXXX";
	
	// gs.info("CY: Masked SSN for| " + origStr + " | " + replaceStr);

	current.body = msgBody.replace(origStr, replaceStr);
	current.update();
	
})(current, previous);