require 'net/http'
require 'json'
require 'uri'

u = User.find_by(email: 'manager.sunggal@kitalaundry.com')
token = JsonWebToken.encode(user_id: u.id)

uri = URI.parse('http://localhost:8000/admin/orders?page=1&limit=20')
req = Net::HTTP::Get.new(uri)
req['Authorization'] = "Bearer #{token}"
begin
  res = Net::HTTP.start(uri.host, uri.port) do |http|
    http.request(req)
  end

  data = JSON.parse(res.body)
  puts "Success: #{data['success']}"
  if data['data'] && data['data']['orders']
    orders = data['data']['orders']
    puts "Orders count: #{orders.length}"
    puts "First 5 orders ID: #{orders.first(5).map{|o| o['id']}.inspect}"
  elsif data['data'] && data['data'].is_a?(Array)
    puts "Orders count: #{data['data'].length}"
    puts "First 5 orders ID: #{data['data'].first(5).map{|o| o['id']}.inspect}"
  else
    puts "Response: #{data.inspect}"
  end
rescue => e
  puts "Failed: #{e.message}"
end
