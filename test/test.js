var expect = require('chai').expect;
var exec = require('@momsfriendlydevco/exec');


describe('each tests', ()=> {

	before('setup exec', ()=> {
		exec.defaults.buffer = true;
		exec.defaults.logStderr = true;
		exec.defaults.cwd = `${__dirname}/data`;
	});

	it('should echo all found files', ()=>
		exec([
			`${__dirname}/../each.js`,
			'**/*.txt',
			'--',
			'echo',
			'%f',
		]).then(res => {
			expect(res.split('\n')).to.deep.equal([
				'a.txt',
				'b.txt',
				'c.txt',
				'd.txt',
				'e.txt',
				'f.txt',
				'g.txt',
			])
		})
	);

});
