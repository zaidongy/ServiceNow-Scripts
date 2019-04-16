// This script replaces all incidents requests and requested items of the dummyUser with the existing user
// It will also delete the dummy user entirely from our sys_user table

function getExistingUser() {
	var user = new GlideRecord('sys_user');
	user.get('employee_number', current.u_employee_id);
	return user.sys_id;
}

function getDummyUser() {
	return current.subject_person.sys_id;
}

function updateRITMs(existing, dummy) {
	var ritms = new GlideRecord('sc_req_item');
	ritms.addQuery('u_req_for', dummy);
	ritms.query();
	while(ritms.next()) {
		ritms.u_req_for = existing;
		ritms.work_notes = "Requested For updated by " + current.number + " workflow";
		if(ritms.variables.u_requested_for != "" && ritms.variables.u_requested_for != undefined)
			ritms.variables.u_requested_for = existing;
		ritms.autoSysFields(false);
		ritms.update();
	}
}

function updateINCs(existing, dummy) {
	var incs = new GlideRecord('incident');
	incs.addQuery('caller_id', dummy);
	incs.query();
	while(incs.next()) {
		incs.u_req_for = existing;
		incs.work_notes = "Caller updated by " + current.number + " workflow";
		incs.autoSysFields(false);
		incs.update();
	}
}

function updateREQ(existing) {
	var req = new GlideRecord('sc_request');
	req.get(current.parent);
	req.requested_for = existing;
	// req.setWorkflow(false); // cannot be used in a scoped app
	req.autoSysFields(false);
	req.update();
}

function updateCurrentCase(existing, dummy) {
	current.work_notes = "Subject Person Update from: " + existing + " to " + dummy;
	current.subject_person = existing;
	current.autoSysFields(false);
	current.update();
}

function deleteShell(shell) {
	var hrUser = new GlideRecord('sn_hr_core_profile');
	if(hrUser.get('user', shell))
		hrUser.deleteRecord();

	var user = new GlideRecord('sys_user');
	if(user.get(shell))
		user.deleteRecord();
}

// Script starts here
var existingUser = getExistingUser();
var dummyUser = getDummyUser();
updateCurrentCase(existingUser, dummyUser);
updateRITMs(existingUser, dummyUser);
updateREQ(existingUser);
updateINCs(existingUser, dummyUser);
deleteShell(dummyUser);
