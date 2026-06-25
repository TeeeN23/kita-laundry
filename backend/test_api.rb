require 'json'
u = User.find_by(email: 'manager.sunggal@kitalaundry.com')
token = JsonWebToken.encode(user_id: u.id)
app.get('/admin/orders', params: { search: '0499' }, headers: { 'Authorization' => "Bearer #{token}" })
puts app.response.body
