var superagent = require('superagent')
var expect = require('expect.js')

var collections = describe('express rest api server - collections', function() {
	var id, url = "http://localhost:3000/collections"

	it('post object', function(done) {
		superagent.post(url + '/test')
		.send({name: 'John', email: 'john@example.com'})
		.end(function(e, res) {
			// console.log(res.body)
			expect(e).to.eql(null)
			expect(res.body.length).to.eql(1)
			expect(res.body[0]._id.length).to.eql(24)
			id = res.body[0]._id
			done()
		})
	})

	it('retrieve an object', function(done) {
		superagent.get(url + '/test/' + id)
		.end(function(e, res){
      // console.log(res.body)
      expect(e).to.eql(null)
      expect(typeof res.body).to.eql('object')
      expect(res.body._id.length).to.eql(24)        
      expect(res.body._id).to.eql(id)               
      done()
     })
	})

	it('updates an object', function(done){
    superagent.put(url + '/test/' + id)
      .send({name: 'Peter'
        , email: 'peter@yahoo.com'})
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')        
        done()
      })
  })

  it('checks an updated object', function(done){
    superagent.get(url + '/test/' + id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        expect(res.body.name).to.eql('Peter')        
        done()
      })
  }) 

	it('remove an object', function(done) {
		superagent.del(url + '/test/' + id)
		.end(function(e, res) {
			// console.log(res.body)
			expect(e).to.eql(null)
			expect(typeof res.body).to.eql('object')
			expect(res.body.msg).to.eql('success')    
      done()
		})
	})
})

module.exports = collections