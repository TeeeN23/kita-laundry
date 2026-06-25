class Rack::Attack
  # `Rack::Attack` is configured to use the `Rails.cache` to store the number of
  # requests.
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  # Allow all local traffic
  safelist('allow-localhost') do |req|
    '127.0.0.1' == req.ip || '::1' == req.ip
  end

  # Throttle requests to any route by IP (max 100 requests per minute)
  throttle('req/ip', limit: 100, period: 1.minute) do |req|
    req.ip unless req.path.start_with?('/assets')
  end

  # Throttle login attempts by IP (max 5 requests per 20 seconds)
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    if req.path == '/api/v1/auth/login' && req.post?
      req.ip
    end
  end

  # Throttle registration attempts by IP (max 3 requests per minute)
  throttle('registrations/ip', limit: 3, period: 1.minute) do |req|
    if req.path == '/api/v1/auth/register' && req.post?
      req.ip
    end
  end

  # Custom response for throttled requests
  self.throttled_responder = lambda do |env|
    match_data = env['rack.attack.match_data']
    now = match_data[:epoch_time]

    headers = {
      'RateLimit-Limit' => match_data[:limit].to_s,
      'RateLimit-Remaining' => '0',
      'RateLimit-Reset' => (now + (match_data[:period] - now % match_data[:period])).to_s,
      'Content-Type' => 'application/json'
    }

    [
      429,
      headers,
      [{ error: 'Too Many Requests. Please wait and try again later.' }.to_json]
    ]
  end
end
