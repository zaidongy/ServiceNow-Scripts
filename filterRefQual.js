filterReference();
function filterReference() {
	var nonMDRHcategories = ['student', 'nurse', 'volunteer', 'physician', 'other'];
	var isCedars = nonMDRHcategories.some(function(cat) {
		return current.variables.u_category == cat;
	});
	if(isCedars) {
		return 'u_business_unit!=u_mdrh1';
	}
	else {
		return 'u_business_unit=u_mdrh1';
	}
}