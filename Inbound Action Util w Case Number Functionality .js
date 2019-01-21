// Inbound Action New (will be able to drop contents into the comments of a case when received)
var caseNumber = extractCaseNumber(email.subject);
var updatedCase = false;
if(caseNumber != null) {
	var gr = new GlideRecord('sn_hr_core_case_relations');
	gr.addQuery('number', caseNumber);
	gr.query();
	if(gr.next()) {
		gr.work_notes = '\nFrom: ' + email.from + '\nTo: ' + email.to + '\nSubject: ' + email.subject + '\n\n' + email.body_text;
		gr.update();
		updatedCase = true;
	}
}
if(!updatedCase) {
	var gr = new GlideRecord('sn_hr_core_case_relations');
	gr.initialize();
	gr.work_notes = '\nFrom: ' + email.from + '\nTo: ' + email.to + '\nSubject: ' + email.subject + '\n\n' + email.body_text;
	gr.insert();
}

function extractCaseNumber(subject) {
	var arr = subject.split(' ');
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].startsWith('HRC')) {
			return arr[i];
		}
	}
	return null;
}