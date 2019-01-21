var g = new GlideRecord('sc_req_item');
g.get('76cba100db96abcce735567b4b961964');
g.state = 3;
g.stage = 'complete';
g.active = 'false';
g.setWorkflow(false);
g.autoSysFields(false);
g.update();